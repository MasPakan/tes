const inquirer = require('inquirer').default;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const https = require('https');
const RepositoryUpdateManager = require('../utils/update');
const LanguageManager = require('../utils/language');

class DiscordSelfbotCLI {
    constructor() {
        this.configFile = path.join(process.cwd(), 'config/ihannsy.json');
        this.updateManager = new RepositoryUpdateManager();
        this.languageManager = new LanguageManager();
        this.loadLanguageSettings();
    }

    loadLanguageSettings() {
        try {
            // Ensure config file exists before trying to read it
            this.ensureConfigFile();
            
            const data = fs.readFileSync(this.configFile, 'utf8');
            const config = JSON.parse(data);
            const language = config.settings?.language || 'en';
            this.languageManager.setLanguage(language);
        } catch (error) {
            console.error('❌ Error loading language settings:', error.message);
        }
    }

    t(key, params = {}) {
        return this.languageManager.t(key, params);
    }

    async showWelcome() {
        console.clear();
        console.log(chalk.cyan.bold(this.t('cli.welcome.ascii_art')));
        console.log(chalk.yellow(this.t('cli.welcome.warning')));
        console.log('');
        
        // Check for updates
        await this.checkForUpdates();
    }

    async checkForUpdates() {
        try {
            await this.updateManager.showUpdatePrompt();
        } catch (error) {
            console.log(chalk.yellow(this.t('cli.updates.error')));
            console.log('');
        }
    }

    ensureConfigFile() {
        if (!fs.existsSync(this.configFile)) {
            // Ensure the config directory exists
            const configDir = path.dirname(this.configFile);
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            
            const defaultConfig = {
                accounts: {},
                settings: {
                    defaultPrefix: "!",
                    defaultRPC: true,
                    defaultWebhook: false,
                    language: "en"
                }
            };
            fs.writeFileSync(this.configFile, JSON.stringify(defaultConfig, null, 2));
        }
    }

    loadAccounts() {
        try {
            // Ensure config file exists before trying to read it
            this.ensureConfigFile();
            
            const data = fs.readFileSync(this.configFile, 'utf8');
            const config = JSON.parse(data);
            return config.accounts || {};
        } catch (error) {
            console.error('❌ Error loading accounts:', error.message);
            return {};
        }
    }

    saveAccounts(accounts) {
        try {
            // Ensure config file exists before trying to save
            this.ensureConfigFile();
            
            const data = fs.readFileSync(this.configFile, 'utf8');
            const config = JSON.parse(data);
            config.accounts = accounts;
            fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('❌ Error saving accounts:', error.message);
        }
    }

    async showMainMenu() {
        const accounts = this.loadAccounts();
        const accountList = Object.keys(accounts);

        let choices;
        if (accountList.length === 0) {
            // No accounts saved - only show new account and quit
            choices = [
                { name: `${chalk.blue('➕')} ${this.t('cli.menu.main.new_account')}`, value: 'new' },
                { name: `${chalk.red('❌')} ${this.t('cli.menu.main.quit')}`, value: 'quit' }
            ];
        } else {
            // Accounts available - show accounts, new account, and quit
            choices = [
                ...accountList.map(username => ({
                    name: `${chalk.green('👤')} ${this.t('cli.menu.main.account', { username })}`,
                    value: username
                })),
                { name: `${chalk.blue('➕')} ${this.t('cli.menu.main.new_account')}`, value: 'new' },
                { name: `${chalk.red('❌')} ${this.t('cli.menu.main.quit')}`, value: 'quit' }
            ];
        }

        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: this.t('cli.menu.main.title'),
            choices,
            pageSize: 10
        }]);

        if (action === 'quit') {
            console.log(chalk.yellow(this.t('cli.goodbye')));
            process.exit(0);
        }

        if (action === 'new') {
            return await this.showNewAccountFlow();
        }

        return await this.showAccountMenu(action, accounts[action]);
    }

    async showAccountMenu(username, account) {
        const choices = [
            { name: `${chalk.green('🚀')} ${this.t('cli.menu.account.start_bot')}`, value: 'start' },
            { name: `${chalk.blue('⚙️')} ${this.t('cli.menu.account.new_config')}`, value: 'config' },
            { name: `${chalk.red('🗑️')} ${this.t('cli.menu.account.remove_account')}`, value: 'remove' },
            { name: `${chalk.gray('⬅️')} ${this.t('cli.menu.account.back')}`, value: 'back' }
        ];

        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: this.t('cli.menu.account.title', { username: chalk.cyan(username) }),
            choices
        }]);

        switch (action) {
            case 'start':
                return { action: 'start', config: account };
            case 'config':
                return await this.showNewAccountFlow(username);
            case 'remove':
                return await this.removeAccount(username);
            case 'back':
                return await this.showMainMenu();
        }
    }

    async removeAccount(username) {
        const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: this.t('cli.remove_account.confirm', { username }),
            default: false
        }]);

        if (confirm) {
            const accounts = this.loadAccounts();
            delete accounts[username];
            this.saveAccounts(accounts);
            console.log(chalk.red(this.t('cli.remove_account.success', { username })));
        }

        return await this.showMainMenu();
    }

    async showNewAccountFlow(existingUsername = null) {
        console.log(chalk.cyan(`\n${this.t('cli.account_flow.title')}\n`));

        // Step 1: Get token
        let token = '';
        if (existingUsername) {
            const accounts = this.loadAccounts();
            token = accounts[existingUsername]?.token || '';
        }

        if (!token) {
            const { userToken } = await inquirer.prompt([{
                type: 'password',
                name: 'userToken',
                message: this.t('cli.account_flow.token_prompt'),
                validate: (input) => {
                    if (!input || input.length < 50) {
                        return this.t('cli.account_flow.token_validation');
                    }
                    return true;
                }
            }]);
            token = userToken;
        }

        // Step 2: Webhook configuration
        const { enableWebhook } = await inquirer.prompt([{
            type: 'confirm',
            name: 'enableWebhook',
            message: this.t('cli.account_flow.webhook_prompt'),
            default: false
        }]);

        let webhookUrl = '';
        if (enableWebhook) {
            const { webhook } = await inquirer.prompt([{
                type: 'input',
                name: 'webhook',
                message: this.t('cli.account_flow.webhook_url_prompt'),
                validate: (input) => {
                    if (!input || !input.includes('discord.com/api/webhooks/')) {
                        return this.t('cli.account_flow.webhook_validation');
                    }
                    return true;
                }
            }]);
            webhookUrl = webhook;
        }

        // Step 3: Get prefix
        const { prefix } = await inquirer.prompt([{
            type: 'input',
            name: 'prefix',
            message: this.t('cli.account_flow.prefix_prompt'),
            default: '!',
            validate: (input) => {
                if (!input || input.length > 5) {
                    return this.t('cli.account_flow.prefix_validation');
                }
                return true;
            }
        }]);

        // Step 4: RPC configuration
        const { enableRPC } = await inquirer.prompt([{
            type: 'confirm',
            name: 'enableRPC',
            message: this.t('cli.account_flow.rpc_prompt'),
            default: true
        }]);

        // Step 5: Language selection
        const { language } = await inquirer.prompt([{
            type: 'list',
            name: 'language',
            message: 'Select language / Pilih bahasa:',
            choices: [
                { name: '🇺🇸 English', value: 'en' },
                { name: '🇮🇩 Indonesia', value: 'id' }
            ],
            default: this.languageManager.getLanguage()
        }]);

        // Update language
        this.languageManager.setLanguage(language);

        // Step 6: Get username from Discord API
        let username = existingUsername || 'Unknown User';
        
        // Try to get username from Discord API
        try {
            const userData = await this.fetchDiscordUser(token);
            if (userData) {
                username = userData.username || userData.global_name || userData.display_name || 'Unknown User';
                console.log(chalk.green(this.t('cli.account_flow.username_detected', { username })));
            } else {
                console.log(chalk.yellow(this.t('cli.account_flow.username_fallback')));
            }
        } catch (error) {
            console.log(chalk.yellow(this.t('cli.account_flow.username_fallback')));
        }

        // Save configuration
        const accounts = this.loadAccounts();
        accounts[username] = {
            token,
            webhookUrl,
            prefix,
            enableRPC,
            username,
            language,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };
        this.saveAccounts(accounts);

        // Update settings
        this.updateLanguageSetting(language);

        console.log(chalk.green(`\n${this.t('cli.account_flow.success', { username })}\n`));
        console.log(chalk.blue(`${this.t('cli.account_flow.config_saved')}\n`));

        return { action: 'start', config: accounts[username] };
    }

    updateLanguageSetting(language) {
        try {
            // Ensure config file exists before trying to update
            this.ensureConfigFile();
            
            const data = fs.readFileSync(this.configFile, 'utf8');
            const config = JSON.parse(data);
            if (!config.settings) config.settings = {};
            config.settings.language = language;
            fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('❌ Error updating language setting:', error.message);
        }
    }

    async fetchDiscordUser(token) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'discord.com',
                port: 443,
                path: '/api/v9/users/@me',
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode === 200) {
                            const userData = JSON.parse(data);
                            resolve(userData);
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        resolve(null);
                    }
                });
            });

            req.on('error', (error) => {
                resolve(null);
            });

            req.setTimeout(10000, () => {
                req.destroy();
                resolve(null);
            });

            req.end();
        });
    }

    async start() {
        // Ensure config file exists before starting
        this.ensureConfigFile();
        
        await this.showWelcome();
        return await this.showMainMenu();
    }
}

module.exports = DiscordSelfbotCLI;