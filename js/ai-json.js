// Shared AI JSON utilities for GR Perform (browser-side)
// Exposes window.GR_AI_JSON

(function () {
  'use strict';

  function stripCodeFences(text) {
    const t = String(text || '');
    // Remove ```json ... ``` wrappers if present (keep inner content)
    return t.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, '$1');
  }

  function extractFirstBalancedJson(text) {
    const src = stripCodeFences(text);
    const s = String(src || '');

    // Find first { or [
    let start = -1;
    let open = '';
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '{' || ch === '[') {
        start = i;
        open = ch;
        break;
      }
    }
    if (start === -1) return null;

    const closeFor = (c) => (c === '{' ? '}' : c === '[' ? ']' : '');
    const stack = [open];

    let inString = false;
    let stringQuote = '"';
    let escaped = false;

    for (let i = start + 1; i < s.length; i++) {
      const ch = s[i];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === '\\') {
          escaped = true;
          continue;
        }
        if (ch === stringQuote) {
          inString = false;
        }
        continue;
      }

      if (ch === '"' || ch === "'") {
        inString = true;
        stringQuote = ch;
        continue;
      }

      if (ch === '{' || ch === '[') {
        stack.push(ch);
        continue;
      }

      if (ch === '}' || ch === ']') {
        const last = stack[stack.length - 1];
        const expected = closeFor(last);
        if (ch === expected) {
          stack.pop();
          if (stack.length === 0) {
            return s.slice(start, i + 1);
          }
        }
      }
    }

    return null;
  }

  function parseFirstJson(text) {
    const chunk = extractFirstBalancedJson(text);
    if (!chunk) return { ok: false, error: 'JSON not found', jsonText: null, value: null };
    try {
      const value = JSON.parse(chunk);
      return { ok: true, error: null, jsonText: chunk, value };
    } catch (e) {
      return { ok: false, error: String(e && e.message ? e.message : e), jsonText: chunk, value: null };
    }
  }

  // Minimal guards
  function isPlainObject(v) {
    return v != null && typeof v === 'object' && !Array.isArray(v);
  }

  window.GR_AI_JSON = {
    stripCodeFences,
    extractFirstBalancedJson,
    parseFirstJson,
    isPlainObject
  };
})();
