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
            }
        } catch (error) {
            console.error('❌ Error loading configuration:', error.message);
        }
        return this.getDefaultConfig();
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

    saveConfig() {
        try {
            // Ensure the config directory exists
            const configDir = path.dirname(this.configFile);
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            
            fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('❌ Error saving configuration:', error.message);
        }
    }

    getAccounts() {
        return this.config.accounts || {};
    }

    saveAccounts(accounts) {
        this.config.accounts = accounts;
        this.saveConfig();
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
        this.config.settings = { ...this.config.settings, ...newSettings };
        this.saveConfig();
    }
}

module.exports = ConfigManager;