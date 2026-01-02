#!/usr/bin/env python3
"""Minimal dev server for GR Perform (static files + AI proxies).

Why: Node isn't available on the host right now; this runs with Python 3 only.

Usage (sh):
  cd /var/home/gabriele/Scaricati/gr-perform
  export GROQ_API_KEY="..."
  export PORT=3000   # optional
  python3 dev-server.py

Then open:
  http://localhost:3000/generate-workout.html
  (from phone on same Wi‑Fi) http://<LAN_IP>:3000/generate-workout.html

AI routing:
    - POST /api/ai/chat         (provider-agnostic)
    - POST /api/ai/groq-chat    (force Groq, backward-compatible)
    - POST /api/ai/ollama-chat  (force Ollama)
    - POST /api/ai/gemini-chat  (force Gemini)

Environment variables:
    - AI_PROVIDER=groq|ollama|gemini
    - AI_FALLBACK_PROVIDER=ollama  (optional)
    - AI_MIN_INTERVAL_MS=900       (optional)
    - AI_MAX_429_RETRIES=2         (optional)
    - OLLAMA_URL=http://localhost:11434
    - OLLAMA_MODEL=qwen2.5:14b
    - GEMINI_API_KEY=...           (required for Gemini)
"""

from __future__ import annotations

import json
import mimetypes
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT_DIR = Path(__file__).resolve().parent


def _load_dotenv_file(path: Path):
    """Very small .env loader (no deps).

    - Supports KEY=VALUE
    - Ignores blank lines and lines starting with #
    - Strips surrounding single/double quotes
    - Does NOT override existing environment variables
    """

    if not path.exists() or not path.is_file():
        return
    try:
        for raw_line in path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()
            if not key:
                continue
            if key in os.environ and os.environ.get(key):
                continue
            if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                value = value[1:-1]
            os.environ[key] = value
    except Exception:
        # Best-effort only; server can still run with exported env vars.
        return


# Load local env files early so GROQ_API_KEY can be picked up without manual `export`.
_load_dotenv_file(ROOT_DIR / ".env")
_load_dotenv_file(ROOT_DIR / ".env.local")


PORT = int(os.environ.get("PORT", "3000"))
HOST = os.environ.get("HOST", "0.0.0.0")

AI_PROVIDER = str(os.environ.get("AI_PROVIDER", "groq")).strip().lower() or "groq"
AI_FALLBACK_PROVIDER = str(os.environ.get("AI_FALLBACK_PROVIDER", "")).strip().lower()
AI_MIN_INTERVAL_MS = max(0, int(os.environ.get("AI_MIN_INTERVAL_MS", "900")))
AI_MAX_429_RETRIES = max(0, int(os.environ.get("AI_MAX_429_RETRIES", "2")))

OLLAMA_URL = str(os.environ.get("OLLAMA_URL", "http://localhost:11434")).strip() or "http://localhost:11434"
OLLAMA_DEFAULT_MODEL = str(os.environ.get("OLLAMA_MODEL", "qwen2.5:14b")).strip() or "qwen2.5:14b"

GEMINI_API_KEY = (
    str(os.environ.get("GEMINI_API_KEY", "")).strip()
    or str(os.environ.get("GOOGLE_API_KEY", "")).strip()
    or str(os.environ.get("GCP_API_KEY", "")).strip()
)
GEMINI_BASE_URL = str(os.environ.get("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta")).strip() or "https://generativelanguage.googleapis.com/v1beta"

_ai_lock = threading.Lock()
_last_ai_call_at = 0.0


def _sleep(ms: int):
    if ms > 0:
        time.sleep(ms / 1000.0)


def _throttle_ai_calls():
    global _last_ai_call_at
    if AI_MIN_INTERVAL_MS <= 0:
        return
    with _ai_lock:
        now = time.monotonic() * 1000.0
        wait_ms = max(0.0, float(AI_MIN_INTERVAL_MS) - (now - _last_ai_call_at))
        if wait_ms > 0:
            _sleep(int(wait_ms))
        _last_ai_call_at = time.monotonic() * 1000.0


def _http_post_json(url: str, payload: dict, headers: dict | None = None, timeout: int = 60):
    req = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", **(headers or {})},
        method="POST",
    )
    try:
        with urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                data = {"raw": body}
            return int(resp.status), data, resp.headers
    except HTTPError as e:
        raw = ""
        try:
            raw = e.read().decode("utf-8") if hasattr(e, "read") else ""
        except Exception:
            raw = ""
        try:
            data = json.loads(raw) if raw else {"raw": raw}
        except Exception:
            data = {"raw": raw}
        return int(getattr(e, "code", 500) or 500), data, getattr(e, "headers", None)


class UpstreamError(Exception):
    def __init__(self, status: int, details: object | None = None, message: str | None = None):
        super().__init__(message or "Upstream error")
        self.status = int(status or 500)
        self.details = details


def _wrap_ollama_as_openai(model: str, content: str) -> dict:
    now = int(time.time())
    return {
        "id": f"ollama-{now}",
        "object": "chat.completion",
        "created": now,
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": content or ""},
                "finish_reason": "stop",
            }
        ],
    }


def get_lan_ip() -> str | None:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Doesn't need to be reachable; just used to select interface
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return None


class Handler(BaseHTTPRequestHandler):
    server_version = "GRPerformDevServer/1.0"

    def _send_json(self, status: int, payload: dict):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        try:
            self.end_headers()
            self.wfile.write(data)
        except BrokenPipeError:
            # Client disconnected (e.g., user stopped request); ignore.
            return

    def _read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        if length > 1_000_000:
            raise ValueError("Body too large")
        raw = self.rfile.read(length)
        return json.loads(raw.decode("utf-8"))

    def do_POST(self):
        if self.path == "/api/ai/chat":
            return self._handle_ai_chat(force_provider=None)
        if self.path == "/api/ai/groq-chat":
            return self._handle_ai_chat(force_provider="groq")
        if self.path == "/api/ai/ollama-chat":
            return self._handle_ai_chat(force_provider="ollama")
        if self.path == "/api/ai/gemini-chat":
            return self._handle_ai_chat(force_provider="gemini")
        self.send_error(404, "Not found")

    def do_GET(self):
        if self.path in ("/api/ai/chat", "/api/ai/groq-chat", "/api/ai/ollama-chat", "/api/ai/gemini-chat"):
            self.send_response(405)
            self.send_header("Allow", "POST")
            self.end_headers()
            return

        # Browsers often request /favicon.ico by default; avoid noisy 404s in local dev.
        if self.path.split("?", 1)[0] == "/favicon.ico":
            self.send_response(204)
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            return
        return self._serve_static()

    def do_HEAD(self):
        return self.do_GET()

    def _handle_ai_chat(self, force_provider: str | None):
        if self.command != "POST":
            self.send_response(405)
            self.send_header("Allow", "POST")
            self.end_headers()
            return

        try:
            body = self._read_json_body()
        except Exception as e:
            return self._send_json(400, {"error": f"Invalid JSON: {e}"})

        model = body.get("model")
        messages = body.get("messages")
        temperature = body.get("temperature", 0.2)
        max_tokens = body.get("max_tokens", 2048)
        provider_body = str(body.get("provider") or "").strip().lower()
        json_mode = bool(body.get("jsonMode") or False)
        response_format = body.get("response_format")

        if not model or not isinstance(messages, list):
            return self._send_json(400, {"error": "Invalid body: model and messages are required"})

        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature if isinstance(temperature, (int, float)) else 0.2,
            "max_tokens": max_tokens if isinstance(max_tokens, int) else 2048,
        }

        # Optional JSON mode support for OpenAI-compatible APIs (e.g., Groq)
        # If the client requests jsonMode, enforce it via response_format unless already provided.
        if isinstance(response_format, dict):
            payload["response_format"] = response_format
        elif json_mode:
            payload["response_format"] = {"type": "json_object"}

        provider = (force_provider or provider_body or AI_PROVIDER or "groq").lower()

        _throttle_ai_calls()

        try:
            if provider == "ollama":
                data = self._call_ollama(payload)
                return self._send_json(200, data)

            if provider == "gemini":
                data = self._call_gemini(payload)
                return self._send_json(200, data)

            # Default: Groq
            data = self._call_groq(payload)
            return self._send_json(200, data)
        except UpstreamError as e:
            status = int(getattr(e, "status", 500) or 500)
            details = getattr(e, "details", None)

            # Optional fallback to Ollama on common upstream failures
            if (
                AI_FALLBACK_PROVIDER == "ollama"
                and provider != "ollama"
                and status in (401, 403, 429, 500)
            ):
                try:
                    data = self._call_ollama(payload)
                    return self._send_json(200, data)
                except Exception as oe:
                    return self._send_json(status, {"error": "Upstream error", "details": details, "fallback_error": str(oe)})

            return self._send_json(status, {"error": "Upstream error", "details": details})
        except URLError as e:
            return self._send_json(502, {"error": "Upstream unreachable", "details": str(e)})
        except Exception as e:
            return self._send_json(500, {"error": "Unexpected server error", "details": str(e)})

    def _call_groq(self, payload: dict) -> dict:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise UpstreamError(500, {"error": "Server misconfigured: GROQ_API_KEY missing"}, "GROQ_API_KEY missing")

        attempt = 0
        while True:
            status, data, headers = _http_post_json(
                "https://api.groq.com/openai/v1/chat/completions",
                payload,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "User-Agent": "GRPerform/1.0 (Python dev-server)",
                },
                timeout=60,
            )

            if status == 429 and attempt < AI_MAX_429_RETRIES:
                ra = headers.get("Retry-After") if headers else None
                try:
                    ra_ms = int(float(ra) * 1000) if ra is not None else None
                except Exception:
                    ra_ms = None
                backoff = ra_ms if ra_ms is not None else min(5000, int(900 * (2**attempt)))
                _sleep(backoff)
                attempt += 1
                continue

            if status >= 400:
                raise UpstreamError(status, data, "Groq API error")

            return data

    def _call_ollama(self, payload: dict) -> dict:
        model_raw = payload.get("model")
        looks_like_ollama_id = isinstance(model_raw, str) and (":" in model_raw)
        model = model_raw if looks_like_ollama_id else OLLAMA_DEFAULT_MODEL

        messages = payload.get("messages") if isinstance(payload.get("messages"), list) else []
        temperature = payload.get("temperature") if isinstance(payload.get("temperature"), (int, float)) else 0.2
        max_tokens = payload.get("max_tokens") if isinstance(payload.get("max_tokens"), int) else 2048

        url = f"{OLLAMA_URL.rstrip('/')}/api/chat"
        wants_json = False
        try:
            wants_json = isinstance(payload.get("response_format"), dict) and payload.get("response_format", {}).get("type") == "json_object"
        except Exception:
            wants_json = False

        status, data, _ = _http_post_json(
            url,
            {
                "model": model,
                "messages": messages,
                "stream": False,
                **({"format": "json"} if wants_json else {}),
                "options": {"temperature": temperature, "num_predict": max_tokens},
            },
            headers={},
            timeout=120,
        )

        if status >= 400:
            raise UpstreamError(status, data, "Ollama API error")

        content = ""
        try:
            content = str((data or {}).get("message", {}).get("content") or "")
        except Exception:
            content = ""
        return _wrap_ollama_as_openai(model, content)

    def _call_gemini(self, payload: dict) -> dict:
        if not GEMINI_API_KEY:
            raise UpstreamError(500, {"error": "Server misconfigured: GEMINI_API_KEY missing"}, "GEMINI_API_KEY missing")

        model_raw = payload.get("model")
        model = str(model_raw or "gemini-2.0-flash").strip() or "gemini-2.0-flash"

        messages = payload.get("messages") if isinstance(payload.get("messages"), list) else []
        temperature = payload.get("temperature") if isinstance(payload.get("temperature"), (int, float)) else 0.2
        max_tokens = payload.get("max_tokens") if isinstance(payload.get("max_tokens"), int) else 2048

        wants_json = False
        try:
            wants_json = isinstance(payload.get("response_format"), dict) and payload.get("response_format", {}).get("type") == "json_object"
        except Exception:
            wants_json = False

        # Gemini: split system instructions vs chat turns
        sys_parts: list[str] = []
        contents: list[dict] = []
        for m in messages:
            role = str((m or {}).get("role") or "").strip().lower()
            text = str((m or {}).get("content") or "")
            if not text:
                continue
            if role == "system":
                sys_parts.append(text)
                continue
            gem_role = "user" if role in ("user", "developer") else "model" if role == "assistant" else "user"
            contents.append({"role": gem_role, "parts": [{"text": text}]})

        body: dict = {
            "contents": contents or [{"role": "user", "parts": [{"text": ""}]}],
            "generationConfig": {
                "temperature": float(temperature),
                "maxOutputTokens": int(max_tokens),
                **({"responseMimeType": "application/json"} if wants_json else {}),
            },
        }
        if sys_parts:
            body["systemInstruction"] = {"parts": [{"text": "\n\n".join(sys_parts)}]}

        url = f"{GEMINI_BASE_URL.rstrip('/')}/models/{model}:generateContent?key={GEMINI_API_KEY}"
        status, data, _ = _http_post_json(url, body, headers={}, timeout=120)
        if status >= 400:
            raise UpstreamError(status, data, "Gemini API error")

        content_text = ""
        try:
            cand = (data or {}).get("candidates", [{}])[0]
            parts = ((cand or {}).get("content") or {}).get("parts") or []
            if parts:
                content_text = str((parts[0] or {}).get("text") or "")
        except Exception:
            content_text = ""

        wrapped = _wrap_ollama_as_openai(model, content_text)
        try:
            usage = (data or {}).get("usageMetadata") or {}
            wrapped["usage"] = {
                "prompt_tokens": int(usage.get("promptTokenCount") or 0),
                "completion_tokens": int(usage.get("candidatesTokenCount") or 0),
                "total_tokens": int(usage.get("totalTokenCount") or 0),
            }
        except Exception:
            pass
        return wrapped

    def _serve_static(self):
        path = self.path.split("?", 1)[0]
        if path == "/":
            path = "/index.html"

        # Prevent path traversal
        rel = path.lstrip("/")
        file_path = (ROOT_DIR / rel).resolve()
        if not str(file_path).startswith(str(ROOT_DIR)):
            return self.send_error(400, "Bad request")

        if not file_path.exists() or not file_path.is_file():
            return self.send_error(404, "Not found")

        ctype, _ = mimetypes.guess_type(str(file_path))
        if not ctype:
            ctype = "application/octet-stream"

        data = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()

        if self.command != "HEAD":
            self.wfile.write(data)


def main():
    print(f"[dev-server] Running on http://localhost:{PORT}")
    if HOST == "0.0.0.0":
        lan = get_lan_ip()
        if lan:
            print(f"[dev-server] LAN: http://{lan}:{PORT}")
    print("[dev-server] Open: /generate-workout.html (AI) or /coach-dashboard.html (UI)")

    httpd = ThreadingHTTPServer((HOST, PORT), Handler)

    # Compatibility: many links/tests expect :3010.
    # Run an additional listener on 3010 (serving the same app + APIs) when possible.
    # Best-effort only: if the port is busy, keep the main server running.
    if PORT != 3010:
        try:
            httpd_3010 = ThreadingHTTPServer((HOST, 3010), Handler)
            t = threading.Thread(target=httpd_3010.serve_forever, daemon=True)
            t.start()
            print("[dev-server] Also listening on http://localhost:3010")
            if HOST == "0.0.0.0":
                lan = get_lan_ip()
                if lan:
                    print(f"[dev-server] LAN: http://{lan}:3010")
        except OSError as e:
            print(f"[dev-server] Note: couldn't bind :3010 ({e}); continuing on :{PORT}")

    httpd.serve_forever()


if __name__ == "__main__":
    main()
