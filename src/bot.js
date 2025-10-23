const { Client } = require('discord.js-selfbot-v13');
const DiscordSelfbotCLI = require('./cli/cli');
const WebhookLogger = require('./webhook/webhook');
const CommandHandler = require('./commands/commands');
const RPCManager = require('./utils/rpc');
const ConfigManager = require('./config/manager');

class DiscordSelfbot {
    constructor() {
        this.configManager = new ConfigManager();
        this.client = null;
        this.webhookLogger = null;
        this.commandHandler = null;
        this.rpcManager = null;
        this.autoPosts = new Map();
        this.isRunning = false;
    }

    // Initialize client
    initializeClient(config) {
        this.client = new Client({
            checkUpdate: false,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION']
        });

        // Initialize modules
        this.webhookLogger = new WebhookLogger({
            webhookUrl: config.webhookUrl,
            clientId: this.client.user?.id,
            username: config.username,
            avatarUrl: this.client.user?.avatarURL()
        });

        this.commandHandler = new CommandHandler(
            this.client, 
            config, 
            this.webhookLogger, 
            this.autoPosts
        );

        this.rpcManager = new RPCManager(this.client, config);

        this.setupEventHandlers();
    }

    // Setup event handlers
    setupEventHandlers() {
        // Message handler
        this.client.on('messageCreate', async (message) => {
            if (message.author.id !== this.client.user.id) return;
            await this.commandHandler.executeCommand(message);
        });

        // Client events
        this.client.on('error', (error) => {
            console.error('❌ Discord Client Error:', error.message);
            this.webhookLogger?.sendActivityLog("Discord Client Error", error.message);
        });

        this.client.on('warn', (info) => {
            console.warn('⚠️ Discord Client Warning:', info);
            this.webhookLogger?.sendActivityLog("Discord Client Warning", String(info));
        });

        this.client.on('disconnect', () => {
            console.log('🔌 Bot Disconnected');
            this.webhookLogger?.sendActivityLog("Discord client disconnected");
        });

        this.client.on('reconnecting', () => {
            console.log('🔄 Bot Reconnecting...');
            this.webhookLogger?.sendActivityLog("Attempting to reconnect to Discord");
        });

        this.client.on('resume', () => {
            console.log('✅ Bot Reconnected');
            this.webhookLogger?.sendActivityLog("Successfully reconnected to Discord");
        });

        // Ready event
        this.client.once('ready', () => {
            console.log(`✅ Logged in as ${this.client.user.tag}`);
            this.webhookLogger?.updateConfig({
                clientId: this.client.user.id,
                username: this.client.user.username,
                avatarUrl: this.client.user.avatarURL()
            });
            this.rpcManager?.setupRichPresence();
            this.webhookLogger?.sendActivityLog("Selfbot started successfully");
        });
    }

    // Setup global error handlers
    setupGlobalErrorHandlers() {
        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Promise Rejection:', reason);
            this.webhookLogger?.sendActivityLog("Unhandled Promise Rejection", reason?.message || String(reason));
        });

        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error.message);
            this.webhookLogger?.sendActivityLog("Uncaught Exception", error.message);
            console.log('🔄 Restarting in 5 seconds...');
            setTimeout(() => {
                process.exit(1);
            }, 5000);
        });

        process.on('warning', (warning) => {
            console.warn('⚠️ Process Warning:', warning.name, warning.message);
            this.webhookLogger?.sendActivityLog("Process Warning", `${warning.name}: ${warning.message}`);
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Received SIGINT, shutting down gracefully...');
            this.shutdown('SIGINT');
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
            this.shutdown('SIGTERM');
        });
    }

    // Shutdown gracefully
    async shutdown(signal) {
        try {
            console.log('🔄 Stopping auto posts...');
            this.autoPosts.forEach((autoPost, index) => {
                try {
                    clearInterval(autoPost.intervalId);
                } catch (error) {
                    console.error(`Error stopping auto post ${index}:`, error.message);
                }
            });

            if (this.webhookLogger) {
                this.webhookLogger.sendActivityLog(`Bot shutting down due to ${signal}`);
            }

            if (this.client) {
                this.client.destroy();
            }

            console.log('✅ Shutdown complete');
            process.exit(0);
        } catch (error) {
            console.error('❌ Error during shutdown:', error.message);
            process.exit(1);
        }
    }

    // Start bot with retry logic
    async startBotWithRetry(config, maxRetries = 3) {
        let retries = 0;
        
        while (retries < maxRetries) {
            try {
                await this.client.login(config.token);
                this.isRunning = true;
                return;
            } catch (error) {
                retries++;
                console.error(`❌ Login attempt ${retries} failed:`, error.message);
                
                if (retries < maxRetries) {
                    const delay = Math.pow(2, retries) * 1000; // Exponential backoff
                    console.log(`🔄 Retrying in ${delay/1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }

    // Main startup function
    async start() {
        try {
            // Setup global error handlers
            this.setupGlobalErrorHandlers();

            // Initialize CLI
            const cli = new DiscordSelfbotCLI();
            const result = await cli.start();

            if (result.action === 'start' && result.config) {
                const config = result.config;
                console.log(`\n🚀 Starting bot for ${config.username}...`);

                // Initialize client
                this.initializeClient(config);

                // Start bot with retry
                await this.startBotWithRetry(config);

                // Keep the process alive
                this.client.on('disconnect', () => {
                    console.log('🔄 Bot disconnected, restarting...');
                    setTimeout(() => {
                        this.startBotWithRetry(config);
                    }, 5000);
                });

            } else {
                console.log('❌ No configuration provided, exiting...');
                process.exit(0);
            }

        } catch (error) {
            console.error('❌ Fatal error in main:', error.message);
            console.error('Stack:', error.stack);
            this.webhookLogger?.sendActivityLog("Fatal Error", error.message);
            console.log('🔄 Restarting in 5 seconds...');
            setTimeout(() => {
                process.exit(1);
            }, 5000);
        }
    }
}

// Start the bot
if (require.main === module) {
    const bot = new DiscordSelfbot();
    bot.start().catch(error => {
        console.error('❌ Unhandled main error:', error.message);
        process.exit(1);
    });
}

module.exports = DiscordSelfbot;