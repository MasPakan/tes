const { Client } = require('discord.js-selfbot-v13');
const DiscordSelfbotCLI = require('./cli/cli');
const WebhookLogger = require('./webhook/webhook');
const CommandHandler = require('./commands/commands');
const RPCManager = require('./utils/rpc');
const ConfigManager = require('./config/manager');
const LanguageManager = require('./utils/language');
const ErrorRecoveryManager = require('./utils/errorRecovery');

class DiscordSelfbot {
    constructor() {
        this.configManager = new ConfigManager();
        this.languageManager = new LanguageManager();
        this.errorRecovery = new ErrorRecoveryManager({
            maxRetries: 5,
            baseDelay: 1000,
            maxDelay: 30000,
            backoffMultiplier: 2,
            circuitThreshold: 5,
            circuitTimeout: 60000
        });
        this.client = null;
        this.webhookLogger = null;
        this.commandHandler = null;
        this.rpcManager = null;
        this.autoPosts = new Map();
        this.isRunning = false;
        this.setupErrorRecovery();
    }

    setupErrorRecovery() {
        this.errorRecovery.setupDiscordStrategies();
        
        this.errorRecovery.on('error', ({ error, context, retryCount }) => {
            console.error(`❌ Error (attempt ${retryCount}):`, error.message);
        });

        this.errorRecovery.on('retry', ({ error, retryCount, delay, strategy }) => {
            console.log(`🔄 Retrying in ${delay/1000}s using ${strategy} strategy...`);
        });

        this.errorRecovery.on('recoverySuccess', ({ retryCount }) => {
            console.log(`✅ Successfully recovered after ${retryCount} attempts`);
        });

        this.errorRecovery.on('recoveryFailed', ({ originalError, recoveryError, retryCount }) => {
            console.error(`❌ Recovery failed after ${retryCount} attempts:`, recoveryError.message);
        });

        this.errorRecovery.on('circuitBreakerOpen', ({ failures, threshold }) => {
            console.error(`🚨 Circuit breaker opened after ${failures} failures (threshold: ${threshold})`);
        });
    }

    t(key, params = {}) {
        return this.languageManager.t(key, params);
    }

    // Initialize client
    initializeClient(config) {
        // Set language from config
        if (config.language) {
            this.languageManager.setLanguage(config.language);
        }

        this.client = new Client({
            checkUpdate: false,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION']
        });

        // Initialize modules
        this.webhookLogger = new WebhookLogger({
            webhookUrl: config.webhookUrl,
            clientId: this.client.user?.id,
            username: config.username,
            avatarUrl: this.client.user?.avatarURL(),
            languageManager: this.languageManager
        });

        this.commandHandler = new CommandHandler(
            this.client, 
            config, 
            this.webhookLogger, 
            this.autoPosts,
            this.languageManager
        );

        this.rpcManager = new RPCManager(this.client, config, this.languageManager);

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
        this.client.on('error', async (error) => {
            console.error(this.t('bot.startup.logged_in', { username: this.client.user?.tag || 'Unknown' }));
            this.webhookLogger?.sendActivityLog(this.t('bot.startup.logged_in', { username: this.client.user?.tag || 'Unknown' }), error.message);
            
            // Try to recover from error
            try {
                await this.errorRecovery.handleError(error, { 
                    client: this.client, 
                    context: 'discord_client_error' 
                });
            } catch (recoveryError) {
                console.error(this.t('bot.recovery.recovery_failed', { error: recoveryError.message }));
            }
        });

        this.client.on('warn', (info) => {
            console.warn('⚠️ Discord Client Warning:', info);
            this.webhookLogger?.sendActivityLog("Discord Client Warning", String(info));
        });

        this.client.on('disconnect', () => {
            console.log(this.t('bot.startup.disconnected'));
            this.webhookLogger?.sendActivityLog(this.t('bot.startup.disconnected'));
        });

        this.client.on('reconnecting', () => {
            console.log(this.t('bot.startup.reconnecting'));
            this.webhookLogger?.sendActivityLog(this.t('bot.startup.reconnecting'));
        });

        this.client.on('resume', () => {
            console.log(this.t('bot.startup.reconnected'));
            this.webhookLogger?.sendActivityLog(this.t('bot.startup.reconnected'));
            // Refresh RPC on reconnection
            this.rpcManager?.refreshRPC().catch(error => {
                console.error('Error refreshing RPC:', error.message);
            });
        });

        // Ready event
        this.client.once('ready', () => {
            console.log(this.t('bot.startup.logged_in', { username: this.client.user.tag }));
            this.webhookLogger?.updateConfig({
                clientId: this.client.user.id,
                username: this.client.user.username,
                avatarUrl: this.client.user.avatarURL()
            });
            this.rpcManager?.setupRichPresence().catch(error => {
                console.error('Error setting up RPC:', error.message);
            });
            this.webhookLogger?.sendActivityLog("Selfbot started successfully");
        });
    }

    // Setup global error handlers
    setupGlobalErrorHandlers() {
        process.on('unhandledRejection', async (reason, promise) => {
            console.error('❌ Unhandled Promise Rejection:', reason);
            this.webhookLogger?.sendActivityLog("Unhandled Promise Rejection", reason?.message || String(reason));
            
            // Try to recover from unhandled rejection
            try {
                await this.errorRecovery.handleError(reason, { 
                    context: 'unhandled_rejection',
                    promise 
                });
            } catch (recoveryError) {
                console.error(this.t('bot.recovery.recovery_failed', { error: recoveryError.message }));
            }
        });

        process.on('uncaughtException', async (error) => {
            console.error('❌ Uncaught Exception:', error.message);
            this.webhookLogger?.sendActivityLog("Uncaught Exception", error.message);
            
            // Try to recover from uncaught exception
            try {
                await this.errorRecovery.handleError(error, { 
                    context: 'uncaught_exception' 
                });
                console.log(this.t('bot.recovery.recovery_success'));
            } catch (recoveryError) {
                console.error(this.t('bot.recovery.recovery_failed', { error: recoveryError.message }));
                console.log(this.t('bot.errors.restarting'));
                setTimeout(() => {
                    process.exit(1);
                }, 5000);
            }
        });

        process.on('warning', (warning) => {
            console.warn('⚠️ Process Warning:', warning.name, warning.message);
            this.webhookLogger?.sendActivityLog("Process Warning", `${warning.name}: ${warning.message}`);
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log(`\n${this.t('bot.errors.shutdown', { signal: 'SIGINT' })}`);
            this.shutdown('SIGINT');
        });

        process.on('SIGTERM', () => {
            console.log(`\n${this.t('bot.errors.shutdown', { signal: 'SIGTERM' })}`);
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

            // Stop RPC monitoring
            this.rpcManager?.stopMonitoring();

            if (this.client) {
                this.client.destroy();
            }

            console.log(this.t('bot.errors.shutdown_complete'));
            process.exit(0);
        } catch (error) {
            console.error(this.t('bot.errors.shutdown_error', { error: error.message }));
            process.exit(1);
        }
    }

    // Start bot with retry logic
    async startBotWithRetry(config, maxRetries = 3) {
        try {
            await this.errorRecovery.handleError(
                new Error('Starting bot'),
                { 
                    client: this.client, 
                    token: config.token,
                    context: 'bot_startup' 
                }
            );
            
            await this.client.login(config.token);
            this.isRunning = true;
            return;
        } catch (error) {
            console.error(this.t('bot.errors.login_failed', { 
                attempt: this.errorRecovery.retryCount, 
                error: error.message 
            }));
            
            if (this.errorRecovery.retryCount < maxRetries) {
                const delay = this.errorRecovery.calculateDelay();
                console.log(this.t('bot.errors.retrying', { delay: delay / 1000 }));
                await new Promise(resolve => setTimeout(resolve, delay));
                return await this.startBotWithRetry(config, maxRetries);
            } else {
                throw error;
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
                console.log(`\n${this.t('bot.startup.starting', { username: config.username })}`);

                // Initialize client
                this.initializeClient(config);

                // Start bot with retry
                await this.startBotWithRetry(config);

                // Keep the process alive
                this.client.on('disconnect', () => {
                    console.log(this.t('bot.recovery.auto_reconnect', { delay: 5 }));
                    // Stop RPC monitoring on disconnect
                    this.rpcManager?.stopMonitoring();
                    setTimeout(() => {
                        this.startBotWithRetry(config);
                    }, 5000);
                });

            } else {
                console.log(this.t('bot.errors.no_config'));
                process.exit(0);
            }

        } catch (error) {
            console.error(this.t('bot.errors.fatal', { error: error.message }));
            console.error('Stack:', error.stack);
            this.webhookLogger?.sendActivityLog("Fatal Error", error.message);
            console.log(this.t('bot.errors.restarting'));
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