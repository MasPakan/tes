const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.configFile = path.join(process.cwd(), 'config/ihannsy.json');
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            // Ensure config directory exists
            const configDir = path.dirname(this.configFile);
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }

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
                // File doesn't exist, create it with default config
                console.log('📁 Config file not found, creating default configuration...');
                const defaultConfig = this.getDefaultConfig();
                this.saveConfig(defaultConfig);
                return defaultConfig;
            }
        } catch (error) {
            console.error('❌ Error loading configuration:', error.message);
            // If there's an error, try to create a new config file
            try {
                const defaultConfig = this.getDefaultConfig();
                this.saveConfig(defaultConfig);
                return defaultConfig;
            } catch (saveError) {
                console.error('❌ Error creating default configuration:', saveError.message);
                return this.getDefaultConfig();
            }
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

    saveConfig(configToSave = null) {
        try {
            // Ensure the config directory exists
            const configDir = path.dirname(this.configFile);
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            
            const configData = configToSave || this.config;
            fs.writeFileSync(this.configFile, JSON.stringify(configData, null, 2));
            console.log('✅ Configuration saved successfully');
        } catch (error) {
            console.error('❌ Error saving configuration:', error.message);
            throw error; // Re-throw to allow calling code to handle
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
            throw error;
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
            throw error;
        }
    }
}

module.exports = ConfigManager;