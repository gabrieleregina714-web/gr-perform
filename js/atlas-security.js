/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 ATLAS SECURITY v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Security utilities for ATLAS Training System:
 * - Input validation & sanitization
 * - Rate limiting
 * - CSRF protection
 * - Data encryption
 * - Audit logging
 * - Permission management
 */

window.ATLASSecurity = {
    
    VERSION: '1.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INPUT VALIDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    validators: {
        /**
         * Validate email format
         */
        email(value) {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(value);
        },
        
        /**
         * Validate phone number
         */
        phone(value) {
            const cleaned = value.replace(/\D/g, '');
            return cleaned.length >= 10 && cleaned.length <= 15;
        },
        
        /**
         * Validate numeric range
         */
        numericRange(value, min, max) {
            const num = parseFloat(value);
            return !isNaN(num) && num >= min && num <= max;
        },
        
        /**
         * Validate weight (kg)
         */
        weight(value) {
            return this.numericRange(value, 20, 300);
        },
        
        /**
         * Validate height (cm)
         */
        height(value) {
            return this.numericRange(value, 100, 250);
        },
        
        /**
         * Validate age
         */
        age(value) {
            return this.numericRange(value, 10, 120);
        },
        
        /**
         * Validate heart rate
         */
        heartRate(value) {
            return this.numericRange(value, 30, 220);
        },
        
        /**
         * Validate percentage
         */
        percentage(value) {
            return this.numericRange(value, 0, 100);
        },
        
        /**
         * Validate workout intensity
         */
        intensity(value) {
            return this.numericRange(value, 0, 120); // Allow >100 for perceived
        },
        
        /**
         * Validate sets/reps
         */
        setsReps(value) {
            return this.numericRange(value, 1, 100);
        },
        
        /**
         * Validate load (kg)
         */
        load(value) {
            return this.numericRange(value, 0, 1000);
        },
        
        /**
         * Validate UUID
         */
        uuid(value) {
            const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return pattern.test(value);
        },
        
        /**
         * Validate date string
         */
        date(value) {
            const d = new Date(value);
            return !isNaN(d.getTime());
        }
    },
    
    /**
     * Validate an object against a schema
     */
    validateObject(obj, schema) {
        const errors = [];
        
        for (const [field, rules] of Object.entries(schema)) {
            const value = obj[field];
            
            // Required check
            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push({ field, message: `${field} is required` });
                continue;
            }
            
            if (value === undefined || value === null) continue;
            
            // Type check
            if (rules.type === 'number' && typeof value !== 'number') {
                errors.push({ field, message: `${field} must be a number` });
            }
            
            if (rules.type === 'string' && typeof value !== 'string') {
                errors.push({ field, message: `${field} must be a string` });
            }
            
            // Min/max
            if (rules.min !== undefined && value < rules.min) {
                errors.push({ field, message: `${field} must be at least ${rules.min}` });
            }
            
            if (rules.max !== undefined && value > rules.max) {
                errors.push({ field, message: `${field} must be at most ${rules.max}` });
            }
            
            // Pattern
            if (rules.pattern && !rules.pattern.test(value)) {
                errors.push({ field, message: `${field} format is invalid` });
            }
            
            // Custom validator
            if (rules.validator && !rules.validator(value)) {
                errors.push({ field, message: rules.validatorMessage || `${field} is invalid` });
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SANITIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Sanitize HTML to prevent XSS
     */
    sanitizeHTML(str) {
        if (typeof str !== 'string') return str;
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        
        return str.replace(/[&<>"'/]/g, char => map[char]);
    },
    
    /**
     * Sanitize for SQL (basic - use prepared statements!)
     */
    sanitizeSQL(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/['";\\]/g, '');
    },
    
    /**
     * Strip HTML tags
     */
    stripTags(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/<[^>]*>/g, '');
    },
    
    /**
     * Sanitize filename
     */
    sanitizeFilename(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[^a-zA-Z0-9.-_]/g, '_').substring(0, 255);
    },
    
    /**
     * Deep sanitize an object
     */
    sanitizeObject(obj) {
        if (obj === null || obj === undefined) return obj;
        
        if (typeof obj === 'string') {
            return this.sanitizeHTML(obj);
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }
        
        if (typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[this.sanitizeHTML(key)] = this.sanitizeObject(value);
            }
            return sanitized;
        }
        
        return obj;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RATE LIMITING
    // ═══════════════════════════════════════════════════════════════════════════
    
    rateLimits: new Map(),
    
    /**
     * Check if action is rate limited
     */
    checkRateLimit(action, limit = 10, windowMs = 60000) {
        const key = action;
        const now = Date.now();
        
        if (!this.rateLimits.has(key)) {
            this.rateLimits.set(key, { count: 1, windowStart: now });
            return { allowed: true, remaining: limit - 1 };
        }
        
        const data = this.rateLimits.get(key);
        
        // Reset if window expired
        if (now - data.windowStart > windowMs) {
            this.rateLimits.set(key, { count: 1, windowStart: now });
            return { allowed: true, remaining: limit - 1 };
        }
        
        // Check limit
        if (data.count >= limit) {
            const retryAfter = Math.ceil((data.windowStart + windowMs - now) / 1000);
            return { allowed: false, remaining: 0, retryAfter };
        }
        
        // Increment
        data.count++;
        return { allowed: true, remaining: limit - data.count };
    },
    
    /**
     * Reset rate limit for action
     */
    resetRateLimit(action) {
        this.rateLimits.delete(action);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CSRF PROTECTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate CSRF token
     */
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        
        // Store with timestamp
        sessionStorage.setItem('csrf_token', JSON.stringify({
            token,
            created: Date.now()
        }));
        
        return token;
    },
    
    /**
     * Validate CSRF token
     */
    validateCSRFToken(token, maxAgeMs = 3600000) {
        try {
            const stored = JSON.parse(sessionStorage.getItem('csrf_token'));
            
            if (!stored) return false;
            if (stored.token !== token) return false;
            if (Date.now() - stored.created > maxAgeMs) return false;
            
            return true;
        } catch {
            return false;
        }
    },
    
    /**
     * Get current CSRF token or generate new one
     */
    getCSRFToken() {
        try {
            const stored = JSON.parse(sessionStorage.getItem('csrf_token'));
            if (stored && Date.now() - stored.created < 3600000) {
                return stored.token;
            }
        } catch {}
        
        return this.generateCSRFToken();
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ENCRYPTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Encrypt data with AES-GCM
     */
    async encrypt(data, key) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        
        // Generate IV
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        // Import key
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(key.padEnd(32, '0').slice(0, 32)),
            'AES-GCM',
            false,
            ['encrypt']
        );
        
        // Encrypt
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            dataBuffer
        );
        
        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        
        // Convert to base64
        return btoa(String.fromCharCode(...combined));
    },
    
    /**
     * Decrypt data with AES-GCM
     */
    async decrypt(encryptedData, key) {
        const encoder = new TextEncoder();
        
        // Decode base64
        const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        
        // Extract IV and data
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        
        // Import key
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(key.padEnd(32, '0').slice(0, 32)),
            'AES-GCM',
            false,
            ['decrypt']
        );
        
        // Decrypt
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            data
        );
        
        // Decode and parse
        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decrypted));
    },
    
    /**
     * Hash a value with SHA-256
     */
    async hash(value) {
        const encoder = new TextEncoder();
        const data = encoder.encode(value);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AUDIT LOGGING
    // ═══════════════════════════════════════════════════════════════════════════
    
    auditLog: [],
    maxAuditEntries: 1000,
    
    /**
     * Log an audit event
     */
    audit(action, details = {}, userId = null) {
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            userId: userId || this.getCurrentUserId(),
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.auditLog.push(entry);
        
        // Trim if too long
        if (this.auditLog.length > this.maxAuditEntries) {
            this.auditLog = this.auditLog.slice(-this.maxAuditEntries);
        }
        
        // Also log to console in dev
        if (window.ATLAS_DEBUG) {
            console.log('[AUDIT]', entry);
        }
        
        // Could also send to server
        this.sendAuditToServer(entry);
        
        return entry;
    },
    
    /**
     * Get current user ID from session
     */
    getCurrentUserId() {
        try {
            return JSON.parse(localStorage.getItem('gr_athlete_profile'))?.id || 
                   sessionStorage.getItem('userId') || 
                   'anonymous';
        } catch {
            return 'anonymous';
        }
    },
    
    /**
     * Send audit entry to server
     */
    async sendAuditToServer(entry) {
        if (!window.ATLAS_AUDIT_ENDPOINT) return;
        
        try {
            await fetch(window.ATLAS_AUDIT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
        } catch (e) {
            // Silent fail - audit shouldn't break app
        }
    },
    
    /**
     * Get audit log
     */
    getAuditLog(filter = {}) {
        let log = [...this.auditLog];
        
        if (filter.action) {
            log = log.filter(e => e.action === filter.action);
        }
        
        if (filter.userId) {
            log = log.filter(e => e.userId === filter.userId);
        }
        
        if (filter.since) {
            const since = new Date(filter.since);
            log = log.filter(e => new Date(e.timestamp) >= since);
        }
        
        return log;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PERMISSIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    permissions: {
        athlete: ['view_own_data', 'edit_own_profile', 'log_workouts', 'view_programs'],
        coach: ['view_own_data', 'edit_own_profile', 'log_workouts', 'view_programs', 
                'view_athlete_data', 'edit_athlete_programs', 'create_programs', 'view_analytics'],
        admin: ['*']  // All permissions
    },
    
    /**
     * Check if user has permission
     */
    hasPermission(permission, userRole = 'athlete') {
        const rolePermissions = this.permissions[userRole] || [];
        
        if (rolePermissions.includes('*')) return true;
        if (rolePermissions.includes(permission)) return true;
        
        return false;
    },
    
    /**
     * Require permission (throws if not met)
     */
    requirePermission(permission, userRole = 'athlete') {
        if (!this.hasPermission(permission, userRole)) {
            this.audit('permission_denied', { permission, userRole });
            throw new Error(`Permission denied: ${permission}`);
        }
    },
    
    /**
     * Check data ownership
     */
    isOwner(resourceOwnerId, currentUserId) {
        return resourceOwnerId === currentUserId;
    },
    
    /**
     * Enforce ownership or admin
     */
    requireOwnership(resourceOwnerId, currentUserId, userRole) {
        if (userRole === 'admin') return true;
        if (this.isOwner(resourceOwnerId, currentUserId)) return true;
        
        this.audit('ownership_violation', { resourceOwnerId, currentUserId });
        throw new Error('Access denied: Not resource owner');
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// SECURE FETCH WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

window.ATLASSecureFetch = async function(url, options = {}) {
    // Add CSRF token
    const headers = options.headers || {};
    headers['X-CSRF-Token'] = ATLASSecurity.getCSRFToken();
    
    // Check rate limit
    const rateCheck = ATLASSecurity.checkRateLimit(`fetch:${url}`, 30, 60000);
    if (!rateCheck.allowed) {
        throw new Error(`Rate limited. Retry after ${rateCheck.retryAfter}s`);
    }
    
    // Sanitize body if present
    if (options.body && typeof options.body === 'object') {
        options.body = JSON.stringify(ATLASSecurity.sanitizeObject(options.body));
        headers['Content-Type'] = 'application/json';
    }
    
    // Audit the request
    ATLASSecurity.audit('api_request', { url, method: options.method || 'GET' });
    
    const response = await fetch(url, { ...options, headers });
    
    // Audit response
    ATLASSecurity.audit('api_response', { url, status: response.status });
    
    return response;
};

console.log('🔒 ATLAS Security v1.0 loaded!');
console.log('   → ATLASSecurity.validators.*');
console.log('   → ATLASSecurity.sanitizeHTML(str)');
console.log('   → ATLASSecurity.checkRateLimit(action)');
console.log('   → ATLASSecurity.encrypt/decrypt(data, key)');
console.log('   → ATLASSecurity.audit(action, details)');
console.log('   → ATLASSecurity.hasPermission(permission, role)');
