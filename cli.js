const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const UpdateManager = require('./update');

class DiscordSelfbotCLI {
    constructor() {
        this.configFile = path.join(__dirname, 'ihannsy.json');
        this.updateManager = new UpdateManager();
        this.ensureConfigFile();
    }

    ensureConfigFile() {
        if (!fs.existsSync(this.configFile)) {
            const defaultConfig = {
                accounts: {},
                settings: {
                    defaultPrefix: '!',
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
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }

    saveAccounts(accounts) {
        fs.writeFileSync(this.configFile, JSON.stringify(accounts, null, 2));
    }

    async showWelcome() {
        console.clear();
        console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🤖 DISCORD SELFBOT AUTOMATION SCRIPT              ║
║                                                              ║
║                    𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀                            ║
║              We Grow Because You Believe                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
        `));
        console.log(chalk.yellow('⚠️  Warning: Using selfbots violates Discord ToS. Use at your own risk!\n'));
        
        // Check for updates
        await this.checkForUpdates();
    }

    async checkForUpdates() {
        try {
            console.log(chalk.blue('🔍 Checking for updates...'));
            const updateInfo = await this.updateManager.checkForUpdates();
            
            if (updateInfo.hasUpdate) {
                console.log(chalk.green(`\n🎉 Update available!`));
                console.log(chalk.yellow(`   Current version: ${updateInfo.currentVersion}`));
                console.log(chalk.green(`   Latest version: ${updateInfo.latestVersion}`));
                
                if (updateInfo.release) {
                    console.log(chalk.cyan(`   Release notes: ${updateInfo.release.body || 'No release notes available'}`));
                }
                
                const { shouldUpdate } = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'shouldUpdate',
                    message: 'Would you like to update now?',
                    default: true
                }]);
                
                if (shouldUpdate) {
                    await this.performUpdate(updateInfo);
                } else {
                    console.log(chalk.yellow('⏭️  Skipping update. You can update later by running the script again.'));
                }
            } else {
                console.log(chalk.green('✅ You are running the latest version!'));
            }
            
            console.log(''); // Empty line for spacing
        } catch (error) {
            console.log(chalk.yellow('⚠️  Could not check for updates. Continuing...'));
            console.log('');
        }
    }

    async performUpdate(updateInfo) {
        try {
            console.log(chalk.blue('🔄 Updating script...'));
            
            const success = await this.updateManager.performUpdate();
            
            if (success) {
                console.log(chalk.green('✅ Update completed successfully!'));
                console.log(chalk.yellow('🔄 Please restart the script to apply changes.'));
                
                const { restartNow } = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'restartNow',
                    message: 'Would you like to restart the script now?',
                    default: true
                }]);
                
                if (restartNow) {
                    console.log(chalk.blue('🔄 Restarting...'));
                    process.exit(0); // Exit to allow restart
                }
            } else {
                console.log(chalk.red('❌ Update failed. Please try again later.'));
            }
        } catch (error) {
            console.log(chalk.red('❌ Update error:', error.message));
        }
    }

    async showMainMenu() {
        const accounts = this.loadAccounts();
        const accountList = Object.keys(accounts);

        if (accountList.length === 0) {
            return await this.showNewAccountFlow();
        }

        const choices = [
            ...accountList.map(username => ({
                name: `${chalk.green('👤')} ${username}`,
                value: username
            })),
            { name: `${chalk.blue('➕')} New Account`, value: 'new' },
            { name: `${chalk.yellow('🔄')} Update Script`, value: 'update' },
            { name: `${chalk.red('❌')} Quit`, value: 'quit' }
        ];

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

        if (action === 'update') {
            return await this.showUpdateMenu();
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

        // Step 1: Token Input
        const { token } = await inquirer.prompt([{
            type: 'password',
            name: 'token',
            message: 'Enter your Discord user token:',
            mask: '*',
            validate: (input) => {
                if (!input || input.length < 50) {
                    return 'Please enter a valid Discord user token (minimum 50 characters)';
                }
                return true;
            }
        }]);

        // Step 2: Webhook Enable/Disable
        const { enableWebhook } = await inquirer.prompt([{
            type: 'confirm',
            name: 'enableWebhook',
            message: 'Enable webhook logging?',
            default: false
        }]);

        let webhookUrl = '';
        if (enableWebhook) {
            const { url } = await inquirer.prompt([{
                type: 'input',
                name: 'url',
                message: 'Enter webhook URL:',
                validate: (input) => {
                    if (!input || !input.includes('discord.com/api/webhooks/')) {
                        return 'Please enter a valid Discord webhook URL';
                    }
                    return true;
                }
            }]);
            webhookUrl = url;
        }

        // Step 3: Custom Prefix
        const { prefix } = await inquirer.prompt([{
            type: 'input',
            name: 'prefix',
            message: 'Enter command prefix (default: !):',
            default: '!',
            validate: (input) => {
                if (!input || input.length > 5) {
                    return 'Prefix must be 1-5 characters long';
                }
                return true;
            }
        }]);

        // Step 4: RPC Enable/Disable
        const { enableRPC } = await inquirer.prompt([{
            type: 'confirm',
            name: 'enableRPC',
            message: 'Enable Rich Presence (RPC)?',
            default: true
        }]);

        // Step 5: Get username from token (optional)
        let username = existingUsername || 'Unknown User';
        if (!existingUsername) {
            const { useUsername } = await inquirer.prompt([{
                type: 'confirm',
                name: 'useUsername',
                message: 'Would you like to set a custom username for this account?',
                default: false
            }]);

            if (useUsername) {
                const { customUsername } = await inquirer.prompt([{
                    type: 'input',
                    name: 'customUsername',
                    message: 'Enter username for this account:',
                    validate: (input) => {
                        if (!input || input.length < 2) {
                            return 'Username must be at least 2 characters long';
                        }
                        return true;
                    }
                }]);
                username = customUsername;
            }
        }

        // Save configuration
        const config = {
            token,
            webhookUrl,
            prefix,
            enableRPC,
            username,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };

        const accounts = this.loadAccounts();
        accounts[username] = config;
        this.saveAccounts(accounts);

        console.log(chalk.green(`\n✅ Configuration saved for account: ${username}`));
        console.log(chalk.cyan('📋 Configuration Summary:'));
        console.log(`   • Username: ${username}`);
        console.log(`   • Prefix: ${prefix}`);
        console.log(`   • Webhook: ${enableWebhook ? 'Enabled' : 'Disabled'}`);
        console.log(`   • RPC: ${enableRPC ? 'Enabled' : 'Disabled'}`);

        const { startNow } = await inquirer.prompt([{
            type: 'confirm',
            name: 'startNow',
            message: 'Would you like to start the bot now?',
            default: true
        }]);

        if (startNow) {
            return { action: 'start', config };
        } else {
            return await this.showMainMenu();
        }
    }

    async start() {
        await this.showWelcome();
        return await this.showMainMenu();
    }

    async showUpdateMenu() {
        const choices = [
            { name: `${chalk.blue('🔍')} Check for Updates`, value: 'check' },
            { name: `${chalk.green('⬆️')} Force Update`, value: 'force' },
            { name: `${chalk.gray('⬅️')} Back to Main Menu`, value: 'back' }
        ];

        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'Update Management:',
            choices
        }]);

        switch (action) {
            case 'check':
                await this.checkForUpdates();
                return await this.showMainMenu();
            case 'force':
                await this.performUpdate({ hasUpdate: true });
                return await this.showMainMenu();
            case 'back':
                return await this.showMainMenu();
        }
    }

    async showUpdateMenu() {
        const choices = [
            { name: `${chalk.blue('🔍')} Check for Updates`, value: 'check' },
            { name: `${chalk.green('⬆️')} Force Update`, value: 'force' },
            { name: `${chalk.gray('⬅️')} Back to Main Menu`, value: 'back' }
        ];

        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'Update Management:',
            choices
        }]);

        switch (action) {
            case 'check':
                await this.checkForUpdates();
                return await this.showMainMenu();
            case 'force':
                await this.performUpdate({ hasUpdate: true });
                return await this.showMainMenu();
            case 'back':
                return await this.showMainMenu();
        }
    }
}

module.exports = DiscordSelfbotCLI;