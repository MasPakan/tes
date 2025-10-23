const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.configFile = path.join(process.cwd(), 'config/ihannsy.json');
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configFile)) {
                const data = fs.readFileSync(this.configFile, 'utf8');
                const config = JSON.parse(data);
                
                // Ensure language field exists in settings
                if (!config.settings) {
                    config.settings = {};
                }
                if (!config.settings.language) {
                    config.settings.language = "en";
                }
                
                return config;
            } else {
                // Config file doesn't exist, create it with default values
                console.log('📝 Config file not found, creating default configuration...');
                this.ensureConfigFile();
                return this.getDefaultConfig();
            }
        } catch (error) {
            console.error('❌ Error loading configuration:', error.message);
            // If there's an error loading, create a fresh config file
            this.ensureConfigFile();
            return this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            accounts: {},
            settings: {
                defaultPrefix: "!",
                defaultRPC: true,
                defaultWebhook: false,
                language: "en"
            }
        };
    }

    ensureConfigFile() {
        try {
            // Ensure the config directory exists
            const configDir = path.dirname(this.configFile);
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            
            // Create config file if it doesn't exist
            if (!fs.existsSync(this.configFile)) {
                const defaultConfig = this.getDefaultConfig();
                fs.writeFileSync(this.configFile, JSON.stringify(defaultConfig, null, 2));
                console.log('✅ Created default config file:', this.configFile);
            }
        } catch (error) {
            console.error('❌ Error creating config file:', error.message);
        }
    }

    saveConfig() {
        try {
            // Ensure the config file exists before saving
            this.ensureConfigFile();
            
            fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('❌ Error saving configuration:', error.message);
        }
    }

    getAccounts() {
        return this.config.accounts || {};
    }

    saveAccounts(accounts) {
        try {
            this.config.accounts = accounts;
            this.saveConfig();
        } catch (error) {
            console.error('❌ Error saving accounts:', error.message);
        }
    }

    getAccount(username) {
        return this.config.accounts[username] || null;
    }

    saveAccount(username, accountData) {
        if (!this.config.accounts) {
            this.config.accounts = {};
        }
        this.config.accounts[username] = {
            ...accountData,
            lastUsed: new Date().toISOString()
        };
        this.saveConfig();
    }

    removeAccount(username) {
        if (this.config.accounts && this.config.accounts[username]) {
            delete this.config.accounts[username];
            this.saveConfig();
            return true;
        }
        return false;
    }

    getSettings() {
        return this.config.settings || {};
    }

    updateSettings(newSettings) {
        try {
            this.config.settings = { ...this.config.settings, ...newSettings };
            this.saveConfig();
        } catch (error) {
            console.error('❌ Error updating settings:', error.message);
        }
    }
}

module.exports = ConfigManager;