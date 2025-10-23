const fs = require('fs');
const path = require('path');

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.locales = {};
        this.loadLanguages();
    }

    loadLanguages() {
        const localesDir = path.join(__dirname, '../locales');
        const languageFiles = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));
        
        for (const file of languageFiles) {
            const language = file.replace('.json', '');
            try {
                const content = fs.readFileSync(path.join(localesDir, file), 'utf8');
                this.locales[language] = JSON.parse(content);
            } catch (error) {
                console.error(`❌ Error loading language file ${file}:`, error.message);
            }
        }
    }

    setLanguage(language) {
        if (this.locales[language]) {
            this.currentLanguage = language;
            return true;
        }
        return false;
    }

    getLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return Object.keys(this.locales);
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.locales[this.currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English if key not found in current language
                value = this.locales['en'];
                for (const k of keys) {
                    if (value && typeof value === 'object' && k in value) {
                        value = value[k];
                    } else {
                        return key; // Return key if not found anywhere
                    }
                }
                break;
            }
        }

        if (typeof value === 'string') {
            // Replace parameters in the string
            return this.replaceParams(value, params);
        }
        
        return value || key;
    }

    replaceParams(text, params) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    // Helper method to get nested object value
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    // Method to add new language at runtime
    addLanguage(language, translations) {
        this.locales[language] = translations;
    }

    // Method to get all translations for a specific key across all languages
    getAllTranslations(key) {
        const result = {};
        for (const lang of Object.keys(this.locales)) {
            const value = this.getNestedValue(this.locales[lang], key);
            if (value) {
                result[lang] = value;
            }
        }
        return result;
    }

    // Method to validate if all required keys exist in a language
    validateLanguage(language) {
        if (!this.locales[language]) {
            return { valid: false, missing: ['Language not found'] };
        }

        const requiredKeys = this.getAllRequiredKeys();
        const missing = [];
        
        for (const key of requiredKeys) {
            if (!this.getNestedValue(this.locales[language], key)) {
                missing.push(key);
            }
        }

        return {
            valid: missing.length === 0,
            missing
        };
    }

    // Get all required keys from English (reference language)
    getAllRequiredKeys() {
        const keys = [];
        const traverse = (obj, prefix = '') => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverse(obj[key], prefix ? `${prefix}.${key}` : key);
                } else {
                    keys.push(prefix ? `${prefix}.${key}` : key);
                }
            }
        };
        
        if (this.locales['en']) {
            traverse(this.locales['en']);
        }
        
        return keys;
    }
}

module.exports = LanguageManager;