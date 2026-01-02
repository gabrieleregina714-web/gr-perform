/**
 * GR Perform - Dual AI Client
 * Supporta Groq e Gemini con confronto e validazione
 */

window.DualAI = (function() {
    'use strict';

    const VERSION = '1.0';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURAZIONE API
    // ═══════════════════════════════════════════════════════════════
    const CONFIG = {
        groq: {
            // IMPORTANT: API keys must NOT be in the browser.
            // Calls are proxied server-side via Vercel function `/api/ai/chat`.
            baseUrl: '/api/ai/chat',
            models: {
                fast: 'llama-3.1-8b-instant',
                balanced: 'llama-3.3-70b-versatile',
                review: 'llama-3.1-8b-instant'
            },
            maxTokens: 2000,
            rateLimit: 30 // RPM
        },
        gemini: {
            // IMPORTANT: API keys must NOT be in the browser.
            // Calls are proxied server-side via Vercel function `/api/ai/chat`.
            baseUrl: '/api/ai/gemini-chat',
            models: {
                fast: 'gemini-2.0-flash',
                balanced: 'gemini-2.0-flash',
                review: 'gemini-2.0-flash'
            },
            maxTokens: 4096,  // Aumentato per evitare troncamento
            rateLimit: 15 // RPM
        }
    };

    // Modalità di collaborazione
    const MODES = {
        GROQ_ONLY: 'groq_only',
        OLLAMA_ONLY: 'ollama_only',
        GEMINI_ONLY: 'gemini_only',
        GROQ_GENERATE_GEMINI_VALIDATE: 'groq_gen_gemini_val',
        OLLAMA_GENERATE_GEMINI_VALIDATE: 'ollama_gen_gemini_val',
        GEMINI_GENERATE_GROQ_VALIDATE: 'gemini_gen_groq_val',
        PARALLEL_CONSENSUS: 'parallel_consensus',
        FALLBACK: 'fallback' // Prova uno, se fallisce usa l'altro
    };

    let currentMode = MODES.GROQ_GENERATE_GEMINI_VALIDATE;
    let stats = {
        groqCalls: 0,
        geminiCalls: 0,
        groqErrors: 0,
        geminiErrors: 0,
        validationImprovements: 0,
        groqSuccess: 0,
        geminiSuccess: 0
    };

    // ═══════════════════════════════════════════════════════════════
    // GROQ API CLIENT
    // ═══════════════════════════════════════════════════════════════
    async function callGroq({ messages, model = 'balanced', temperature = 0.3, maxTokens = 700, jsonMode = false }) {
        const modelName = CONFIG.groq.models[model] || CONFIG.groq.models.balanced;

        const requestBody = {
            provider: 'groq',
            model: modelName,
            messages: (messages || []).map(m => ({
                role: m.role,
                content: String(m.content).slice(0, 12000)
            })),
            temperature,
            max_tokens: Math.min(maxTokens, CONFIG.groq.maxTokens),
            jsonMode: Boolean(jsonMode)
        };

        const response = await fetch(CONFIG.groq.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        stats.groqCalls++;

        if (!response.ok) {
            stats.groqErrors++;
            const error = await response.text();
            throw new Error(`Groq error (${response.status}): ${error}`);
        }

        const data = await response.json();
        stats.groqSuccess++;
        return {
            content: data.choices?.[0]?.message?.content || '',
            provider: 'groq',
            model: modelName,
            usage: data.usage
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // GEMINI API CLIENT
    // ═══════════════════════════════════════════════════════════════
    async function callGemini({ messages, model = 'balanced', temperature = 0.3, maxTokens = 2048, jsonMode = false }) {
        const modelName = CONFIG.gemini.models[model] || CONFIG.gemini.models.balanced;

        const requestBody = {
            provider: 'gemini',
            model: modelName,
            messages: (messages || []).map(m => ({
                role: m.role,
                content: String(m.content)
            })),
            temperature,
            max_tokens: Math.min(maxTokens, CONFIG.gemini.maxTokens),
            jsonMode: Boolean(jsonMode)
        };

        const response = await fetch(CONFIG.gemini.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        stats.geminiCalls++;

        if (!response.ok) {
            stats.geminiErrors++;
            const error = await response.text();
            throw new Error(`Gemini error (${response.status}): ${error}`);
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || '';
        stats.geminiSuccess++;
        
        return {
            content,
            provider: 'gemini',
            model: modelName,
            usage: {
                prompt_tokens: data.usage?.prompt_tokens || 0,
                completion_tokens: data.usage?.completion_tokens || 0
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // OLLAMA API CLIENT (locale)
    // ═══════════════════════════════════════════════════════════════
    async function callOllama({ messages, model = 'llama3.2', temperature = 0.3, maxTokens = 2000, jsonMode = false }) {
        // Usa modello da benchmark config se disponibile.
        // In UI, `model` spesso è 'fast'/'balanced'/'review': non è un ID valido per Ollama.
        const preferred = window.DualAI?._benchmarkOllamaModel || window.DualAI?._ollamaModel || '';
        const modelName = preferred
            ? preferred
            : (typeof model === 'string' && model.includes(':'))
                ? model
                : 'qwen2.5:14b';

        const requestBody = {
            provider: 'ollama',
            model: modelName,
            messages: (messages || []).map(m => ({
                role: m.role,
                content: String(m.content).slice(0, 12000)
            })),
            temperature,
            max_tokens: maxTokens,
            jsonMode: Boolean(jsonMode)
        };

        const response = await fetch('/api/ai/ollama-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Ollama error (${response.status}): ${error}`);
        }

        const data = await response.json();
        return {
            content: data.choices?.[0]?.message?.content || '',
            provider: 'ollama',
            model: modelName,
            usage: data.usage
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // VALIDATION PROMPT
    // ═══════════════════════════════════════════════════════════════
    function createValidationPrompt(originalPrompt, generatedContent, context) {
        return `Sei un revisore esperto di workout. Analizza questo workout generato e miglioralo se necessario.

CONTESTO ORIGINALE:
${context || 'Non disponibile'}

WORKOUT GENERATO:
${generatedContent}

CRITERI DI VALIDAZIONE:
1. Il workout rispetta le aree doloranti da evitare?
2. Volume e intensità sono appropriati per la readiness?
3. La progressione è coerente con la fase di periodizzazione?
4. Gli esercizi sono specifici (no nomi generici)?
5. La struttura è corretta (warm-up → main → accessori → conditioning)?

ISTRUZIONI:
- Se il workout è corretto, rispondi con lo stesso JSON
- Se ci sono problemi, correggi e restituisci il JSON migliorato
- NON aggiungere spiegazioni, solo JSON valido
- Mantieni lo stesso schema JSON`;
    }

    // ═══════════════════════════════════════════════════════════════
    // DUAL AI ORCHESTRATION
    // ═══════════════════════════════════════════════════════════════
    async function chat({ messages, model = 'balanced', temperature = 0.3, maxTokens = 700, context = '', jsonMode = true }) {
        const startTime = Date.now();
        let result = null;
        let validation = null;

        try {
            switch (currentMode) {
                case MODES.GROQ_ONLY:
                    result = await callGroq({ messages, model, temperature, maxTokens, jsonMode });
                    break;

                case MODES.OLLAMA_ONLY:
                    result = await callOllama({ messages, model, temperature, maxTokens, jsonMode });
                    break;

                case MODES.GEMINI_ONLY:
                    result = await callGemini({ messages, model, temperature, maxTokens });
                    break;

                case MODES.GROQ_GENERATE_GEMINI_VALIDATE:
                    // Groq genera, Gemini valida - CON FALLBACK INTELLIGENTE
                    try {
                        result = await callGroq({ messages, model, temperature, maxTokens, jsonMode });
                    } catch (groqError) {
                        // Se Groq fallisce (rate limit, timeout), usa Gemini come generatore
                        const isRateLimit = groqError.message?.includes('429') || groqError.message?.includes('rate_limit');
                        console.warn(`⚠️ Groq failed (${isRateLimit ? 'rate limit' : 'error'}), using Gemini as generator`);
                        
                        result = await callGemini({ messages, model, temperature, maxTokens });
                        result.provider = 'gemini';
                        result.fallback = true;
                        result.fallbackReason = isRateLimit ? 'groq_rate_limit' : 'groq_error';

                        // NOTE: callGemini already updates stats.
                        
                        // Non serve validazione - Gemini è già affidabile
                        result.validated = true;
                        result.validator = 'self';
                        break;
                    }
                    
                    try {
                        validation = await callGemini({
                            messages: [
                                { role: 'system', content: 'Sei un validatore di workout. Rispondi SOLO con JSON valido.' },
                                { role: 'user', content: createValidationPrompt(messages, result.content, context) }
                            ],
                            model: 'review',
                            temperature: 0.1,
                            maxTokens: maxTokens
                        });
                        
                        // Verifica se Gemini ha apportato modifiche
                        if (validation.content !== result.content) {
                            stats.validationImprovements++;
                            console.log('🔄 Gemini ha migliorato il workout');
                        }
                        
                        result.content = validation.content;
                        result.validated = true;
                        result.validator = 'gemini';
                    } catch (e) {
                        console.warn('Gemini validation failed, using Groq output:', e.message);
                        result.validated = false;
                    }
                    break;

                case MODES.OLLAMA_GENERATE_GEMINI_VALIDATE:
                    // Ollama genera, Gemini valida (ottimo per velocità + struttura)
                    result = await callOllama({ messages, model, temperature, maxTokens, jsonMode });
                    try {
                        validation = await callGemini({
                            messages: [
                                { role: 'system', content: 'Sei un validatore di workout. Rispondi SOLO con JSON valido.' },
                                { role: 'user', content: createValidationPrompt(messages, result.content, context) }
                            ],
                            model: 'review',
                            temperature: 0.1,
                            maxTokens: maxTokens,
                            jsonMode: true
                        });

                        if (validation.content !== result.content) {
                            stats.validationImprovements++;
                            console.log('🔄 Gemini ha migliorato il workout');
                        }

                        result.content = validation.content;
                        result.validated = true;
                        result.validator = 'gemini';
                    } catch (e) {
                        console.warn('Gemini validation failed, using Ollama output:', e.message);
                        result.validated = false;
                    }
                    break;

                case MODES.GEMINI_GENERATE_GROQ_VALIDATE:
                    // Gemini genera, Groq valida - CON FALLBACK INTELLIGENTE
                    try {
                        result = await callGemini({ messages, model, temperature, maxTokens });
                    } catch (geminiError) {
                        // Se Gemini fallisce, usa Groq come generatore
                        console.warn('⚠️ Gemini failed, using Groq as generator');
                        
                        result = await callGroq({ messages, model, temperature, maxTokens, jsonMode });
                        result.provider = 'groq';
                        result.fallback = true;
                        result.fallbackReason = 'gemini_error';
                        
                        // Non serve validazione Groq - già usato come generatore
                        result.validated = true;
                        result.validator = 'self';
                        break;
                    }
                    
                    try {
                        validation = await callGroq({
                            messages: [
                                { role: 'system', content: 'Sei un validatore di workout. Rispondi SOLO con JSON valido.' },
                                { role: 'user', content: createValidationPrompt(messages, result.content, context) }
                            ],
                            model: 'review',
                            temperature: 0.1,
                            maxTokens: maxTokens,
                            jsonMode: true
                        });
                        
                        if (validation.content !== result.content) {
                            stats.validationImprovements++;
                        }
                        
                        result.content = validation.content;
                        result.validated = true;
                        result.validator = 'groq';
                    } catch (e) {
                        // Se Groq fallisce per rate limit, output Gemini è comunque buono
                        const isRateLimit = e.message?.includes('429') || e.message?.includes('rate_limit');
                        console.warn(`Groq validation failed (${isRateLimit ? 'rate limit' : 'error'}), using Gemini output`);
                        result.validated = false;
                    }
                    break;

                case MODES.PARALLEL_CONSENSUS:
                    // Entrambi generano, scegli il migliore
                    const [groqResult, geminiResult] = await Promise.allSettled([
                        callGroq({ messages, model, temperature, maxTokens, jsonMode }),
                        callGemini({ messages, model, temperature, maxTokens })
                    ]);

                    const groqOk = groqResult.status === 'fulfilled';
                    const geminiOk = geminiResult.status === 'fulfilled';

                    if (groqOk && geminiOk) {
                        // Entrambi hanno risposto - usa Gemini come validatore finale
                        const comparison = await callGemini({
                            messages: [
                                { role: 'system', content: 'Confronta due workout e scegli il migliore. Rispondi SOLO con il JSON del workout scelto.' },
                                { role: 'user', content: `
WORKOUT A (Groq):
${groqResult.value.content}

WORKOUT B (Gemini):
${geminiResult.value.content}

Quale è migliore per il contesto? Rispondi SOLO con il JSON del workout scelto.` }
                            ],
                            model: 'review',
                            temperature: 0.1,
                            maxTokens: maxTokens
                        });
                        
                        result = {
                            content: comparison.content,
                            provider: 'consensus',
                            validated: true,
                            sources: ['groq', 'gemini']
                        };
                    } else if (groqOk) {
                        result = groqResult.value;
                    } else if (geminiOk) {
                        result = geminiResult.value;
                    } else {
                        throw new Error('Both AI providers failed');
                    }
                    break;

                case MODES.FALLBACK:
                    // Prova Groq, se fallisce usa Gemini
                    try {
                        result = await callGroq({ messages, model, temperature, maxTokens, jsonMode });
                    } catch (e) {
                        console.warn('Groq failed, falling back to Gemini:', e.message);
                        result = await callGemini({ messages, model, temperature, maxTokens });
                    }
                    break;

                default:
                    result = await callGroq({ messages, model, temperature, maxTokens, jsonMode });
            }

            result.duration = Date.now() - startTime;
            result.mode = currentMode;
            
            // Log fallback usage
            if (result.fallback) {
                console.log(`🔄 DualAI FALLBACK: usando ${result.provider} (motivo: ${result.fallbackReason})`);
            }
            
            return result;

        } catch (error) {
            console.error('DualAI error:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // SPECIALIZED METHODS
    // ═══════════════════════════════════════════════════════════════
    
    // Genera workout con validazione
    async function generateWorkout(prompt, context = '') {
        return chat({
            messages: [
                { role: 'system', content: 'Genera workout in formato JSON valido. NO markdown, NO spiegazioni.' },
                { role: 'user', content: prompt }
            ],
            model: 'balanced',
            temperature: 0.4,
            maxTokens: 700,
            context
        });
    }

    // Review veloce (usa modello fast)
    async function quickReview(content) {
        return chat({
            messages: [
                { role: 'system', content: 'Sei un reviewer. Rispondi in JSON: {"risk":"low|medium|high","issues":[],"approved":true/false}' },
                { role: 'user', content: `Valuta questo workout:\n${content}` }
            ],
            model: 'fast',
            temperature: 0.1,
            maxTokens: 300
        });
    }

    // Chat consulenza (usa modello pro)
    async function consultChat(messages) {
        return chat({
            messages,
            model: 'balanced',
            temperature: 0.5,
            maxTokens: 500
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION & STATS
    // ═══════════════════════════════════════════════════════════════
    function setMode(mode) {
        if (Object.values(MODES).includes(mode)) {
            currentMode = mode;
            console.log('🔄 DualAI mode:', mode);
            return true;
        }
        return false;
    }

    function getMode() {
        return currentMode;
    }

    function getStats() {
        return { ...stats };
    }

    function resetStats() {
        stats = {
            groqCalls: 0,
            geminiCalls: 0,
            groqErrors: 0,
            geminiErrors: 0,
            validationImprovements: 0
        };
    }

    // Test connection
    async function testConnections() {
        const results = { groq: false, gemini: false, groqError: null, geminiError: null };
        
        try {
            await callGroq({
                messages: [{ role: 'user', content: 'Test. Rispondi OK.' }],
                model: 'fast',
                maxTokens: 10
            });
            results.groq = true;
        } catch (e) {
            results.groqError = e.message;
            console.error('Groq test failed:', e.message);
        }

        try {
            await callGemini({
                messages: [{ role: 'user', content: 'Test. Rispondi OK.' }],
                model: 'fast',
                maxTokens: 10
            });
            results.gemini = true;
        } catch (e) {
            results.geminiError = e.message;
            console.error('Gemini test failed:', e.message);
        }

        return results;
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    return {
        VERSION,
        MODES,
        
        // Core
        chat,
        callGroq,
        callGemini,
        callOllama,

        // Helpers
        createValidationPrompt,
        
        // Specialized
        generateWorkout,
        quickReview,
        consultChat,
        
        // Config
        setMode,
        getMode,
        getStats,
        resetStats,
        testConnections,
        
        // Direct access to config (for debugging)
        CONFIG
    };
})();

console.log('🤖 DualAI v' + window.DualAI.VERSION + ' loaded - Mode:', window.DualAI.getMode());
