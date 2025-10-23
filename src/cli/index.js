const inquirer = require('inquirer').default;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const https = require('https');
const RepositoryUpdateManager = require('../utils/update');

class DiscordSelfbotCLI {
    constructor() {
        this.configFile = path.join(__dirname, '../../ihannsy.json');
        this.updateManager = new RepositoryUpdateManager();
    }

    async showWelcome() {
        console.clear();
        console.log(chalk.cyan.bold(`
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
███████████████████████████████▓████████████████████████████
██████████████████▓▓█████████▓░░▓███████████████████████████
████████████████▓▒▓▓▓▓████▓▒▒░ ░░▒▓██████▓░█████████████████
████████████████░▒▓▒▓▓██████▓▒ ▒▓██████▓▒░ ░▓███████████████
███████████████▒░▒▒▒▓▓███████▒░▓█████▓▒▒▓▓░▒▓███████████████
███████████████░▒▓▒▒▓▓███▓▓██▓▒███████▒▒▓█░██▓▓▓████████████
██████████████▓░▒▓▒▓▓▓██▓▒▒░░░░░▒▒▒▒▓▓▓▓▓█▓██▒▓▓████████████
██████████████▒░▓▒▒▒▓▓▓██▓██▒░░░     ░░░░░░▒▒▒▒▓▓████████████
██████████████▒▒▓▒▒▓▓▓▓█▓███▓▒▒░░░░░      ░░▓▓▓▓████████████
█████████████▓░▒▓▒▓▓▓▓▓▓▓█████▓▓▓▒▒▒░░░▒▓▓▓███▓▓████████████
█████████████▓▒▓▓▒▒▒▓▓▓▓███████████▓██████████▓▓████████████
█████████████▒▒▓▒▒░▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓█████████▓▓█▓▒████████████
█████████████░▒▓▒▓▓▓███████████████████████▓▓█▓▒████████████
█████████████▒▓█▓██████████████████████████▓██▓▓████████████
██████████████▓███████▓▓▓████████████████████▓▓▓████████████
███████████████████▒▓█░▒▒▓█████████████████▓▓▓██████████████
██████████████████▓░▓▓░░░▓███████████▓██▓███████████████████
██████████████████▓▓█▓▓▓▓███████████▓▓█▓▒███████████████████
████████████████████████████████▓▒▒▓▓▓█▓▓███████████████████
████████████████████████████████████████████████████████████
        `));
        console.log(chalk.yellow('⚠️  Warning: Using selfbots violates Discord ToS. Use at your own risk!\n'));
        
        // Check for updates
        await this.checkForUpdates();
    }

    async checkForUpdates() {
        try {
            await this.updateManager.showUpdatePrompt();
        } catch (error) {
            console.log(chalk.yellow('⚠️  Could not check for updates. Continuing...'));
            console.log('');
        }
    }

    ensureConfigFile() {
        if (!fs.existsSync(this.configFile)) {
            const defaultConfig = {
                accounts: {},
                settings: {
                    defaultPrefix: "!",
                    defaultRPC: true,
                    defaultWebhook: false
                }
            };
            fs.writeFileSync(this.configFile, JSON.stringify(defaultConfig, null, 2));
        }
    }

    loadAccounts() {
        try {
            const data = fs.readFileSync(this.configFile, 'utf8');
            const config = JSON.parse(data);
            return config.accounts || {};
        } catch (error) {
            return {};
        }
    }

    saveAccounts(accounts) {
        try {
            const data = fs.readFileSync(this.configFile, 'utf8');
            const config = JSON.parse(data);
            config.accounts = accounts;
            fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('Error saving accounts:', error.message);
        }
    }

    async showMainMenu() {
        const accounts = this.loadAccounts();
        const accountList = Object.keys(accounts);

        let choices;
        if (accountList.length === 0) {
            // No accounts saved - only show new account and quit
            choices = [
                { name: `${chalk.blue('➕')} New Account`, value: 'new' },
                { name: `${chalk.red('❌')} Quit`, value: 'quit' }
            ];
        } else {
            // Accounts available - show accounts, new account, and quit
            choices = [
                ...accountList.map(username => ({
                    name: `${chalk.green('👤')} ${username}`,
                    value: username
                })),
                { name: `${chalk.blue('➕')} New Account`, value: 'new' },
                { name: `${chalk.red('❌')} Quit`, value: 'quit' }
            ];
        }

        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'Select an account or action:',
            choices,
            pageSize: 10
        }]);

        if (action === 'quit') {
            console.log(chalk.yellow('👋 Goodbye!'));
            process.exit(0);
        }

        if (action === 'new') {
            return await this.showNewAccountFlow();
        }

        return await this.showAccountMenu(action, accounts[action]);
    }

    async showAccountMenu(username, account) {
        const choices = [
            { name: `${chalk.green('🚀')} Start Bot`, value: 'start' },
            { name: `${chalk.blue('⚙️')} New Config`, value: 'config' },
            { name: `${chalk.red('🗑️')} Remove Account`, value: 'remove' },
            { name: `${chalk.gray('⬅️')} Back to Main Menu`, value: 'back' }
        ];

        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: `Account: ${chalk.cyan(username)}\nWhat would you like to do?`,
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
            message: `Are you sure you want to remove account "${username}"?`,
            default: false
        }]);

        if (confirm) {
            const accounts = this.loadAccounts();
            delete accounts[username];
            this.saveAccounts(accounts);
            console.log(chalk.red(`✅ Account "${username}" removed successfully!`));
        }

        return await this.showMainMenu();
    }

    async showNewAccountFlow(existingUsername = null) {
        console.log(chalk.cyan('\n🔧 New Account Configuration\n'));

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
                message: 'Enter your Discord user token:',
                validate: (input) => {
                    if (!input || input.length < 50) {
                        return 'Please enter a valid Discord user token';
                    }
                    return true;
                }
            });
            token = userToken;
        }

        // Step 2: Webhook configuration
        const { enableWebhook } = await inquirer.prompt([{
            type: 'confirm',
            name: 'enableWebhook',
            message: 'Enable webhook logging?',
            default: false
        }]);

        let webhookUrl = '';
        if (enableWebhook) {
            const { webhook } = await inquirer.prompt([{
                type: 'input',
                name: 'webhook',
                message: 'Enter webhook URL:',
                validate: (input) => {
                    if (!input || !input.includes('discord.com/api/webhooks/')) {
                        return 'Please enter a valid Discord webhook URL';
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
            message: 'Enter command prefix:',
            default: '!',
            validate: (input) => {
                if (!input || input.length > 5) {
                    return 'Prefix must be 1-5 characters long';
                }
                return true;
            }
        }]);

        // Step 4: RPC configuration
        const { enableRPC } = await inquirer.prompt([{
            type: 'confirm',
            name: 'enableRPC',
            message: 'Enable Rich Presence (RPC)?',
            default: true
        }]);

        // Step 5: Get username from Discord API
        let username = existingUsername || 'Unknown User';
        
        // Try to get username from Discord API
        try {
            const userData = await this.fetchDiscordUser(token);
            if (userData) {
                username = userData.username || userData.global_name || userData.display_name || 'Unknown User';
                console.log(chalk.green(`✅ Detected username: ${username}`));
            } else {
                console.log(chalk.yellow('⚠️  Could not fetch username from Discord API, using default'));
            }
        } catch (error) {
            console.log(chalk.yellow('⚠️  Could not fetch username from Discord API, using default'));
        }

        // Save configuration
        const accounts = this.loadAccounts();
        accounts[username] = {
            token,
            webhookUrl,
            prefix,
            enableRPC,
            username,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };
        this.saveAccounts(accounts);

        console.log(chalk.green(`\n✅ Account "${username}" configured successfully!`));
        console.log(chalk.blue('🔧 Configuration saved to ihannsy.json\n'));

        return { action: 'start', config: accounts[username] };
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
        await this.showWelcome();
        return await this.showMainMenu();
    }
}

module.exports = DiscordSelfbotCLI;