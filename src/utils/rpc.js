const { RichPresence } = require('discord.js-selfbot-v13');

class RPCManager {
    constructor(client, config, languageManager) {
        this.client = client;
        this.config = config;
        this.languageManager = languageManager;
        this.isActive = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.retryDelay = 5000; // 5 seconds
        this.monitorInterval = null;
        this.lastActivityCheck = Date.now();
    }

    t(key, params = {}) {
        return this.languageManager ? this.languageManager.t(key, params) : key;
    }

    // Setup Rich Presence with retry mechanism
    async setupRichPresence(forceRetry = false) {
        if (!this.config.enableRPC) {
            console.log(this.t('rpc.disabled'));
            this.stopMonitoring();
            return;
        }

        // Don't retry if we're already at max retries and not forced
        if (this.retryCount >= this.maxRetries && !forceRetry) {
            console.error(this.t('rpc.max_retries_reached'));
            return;
        }

        try {
            // Validate client is ready
            if (!this.client || !this.client.user) {
                console.warn(this.t('rpc.client_not_ready'));
                this.scheduleRetry();
                return;
            }

            // Check if client is ready and has proper presence support
            if (!this.client.user.setPresence) {
                console.warn(this.t('rpc.client_not_ready'));
                this.scheduleRetry();
                return;
            }

            const rpc = new RichPresence(this.client)
                .setApplicationId("1412695779016966154")
                .setType("WATCHING")
                .setName("𝙞𝙃𝘼𝙉𝙉𝙎𝙔 𝙎𝘾𝙍𝙄𝙋𝙏")
                .setDetails("𝙎𝙀𝙇𝙁𝘽𝙊𝙏 𝙈𝙐𝙇𝙏𝙄-𝙁𝙀𝘼𝙏𝙐𝙍𝙀𝙎✨")
                .setState("Any issues? report on discussion")
                .setStartTimestamp(this.client.readyTimestamp)
                .setAssetsLargeImage("1430879785986293853")
                .setAssetsLargeText("iHannsy")
                .setAssetsSmallImage("https://cdn.discordapp.com/emojis/1410320378294833313.gif")
                .setAssetsSmallText("Verified")
                .addButton("Github", "https://www.github.com/namakuhans")
                .addButton("Instagram", "https://www.instagram.com/saya.p4rhan");

            // Set presence with error handling
            this.client.user.setPresence({ 
                activities: [rpc], 
                status: "dnd" 
            });

            // Reset retry count on success
            this.retryCount = 0;
            this.isActive = true;
            this.lastActivityCheck = Date.now();
            
            console.log(this.t('rpc.enabled'));
            
            // Start monitoring if not already started
            if (!this.monitorInterval) {
                this.startMonitoring();
            }
            
        } catch (error) {
            console.error(this.t('rpc.error', { error: error.message }));
            this.isActive = false;
            this.scheduleRetry();
        }
    }

    // Schedule retry with exponential backoff
    scheduleRetry() {
        if (this.retryCount >= this.maxRetries) {
            console.error(this.t('rpc.max_retries_reached'));
            return;
        }

        this.retryCount++;
        const delay = this.retryDelay * Math.pow(2, this.retryCount - 1); // Exponential backoff
        
        console.log(this.t('rpc.retrying', { 
            attempt: this.retryCount, 
            delay: Math.round(delay / 1000) 
        }));
        
        setTimeout(async () => {
            await this.setupRichPresence();
        }, delay);
    }

    // Start monitoring RPC status
    startMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }

        this.monitorInterval = setInterval(async () => {
            await this.checkRPCStatus();
        }, 30000); // Check every 30 seconds
    }

    // Stop monitoring RPC status
    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        this.isActive = false;
    }

    // Check if RPC is still active
    async checkRPCStatus() {
        try {
            if (!this.config.enableRPC || !this.client || !this.client.user) {
                return;
            }

            const currentActivities = this.client.user.presence?.activities || [];
            const hasRPC = currentActivities.some(activity => 
                activity.applicationId === "1412695779016966154"
            );

            if (!hasRPC && this.isActive) {
                console.warn(this.t('rpc.lost_connection'));
                this.isActive = false;
                await this.setupRichPresence();
            } else if (hasRPC && !this.isActive) {
                this.isActive = true;
                this.retryCount = 0;
            }
        } catch (error) {
            console.error('Error checking RPC status:', error.message);
        }
    }

    // Force refresh RPC
    async refreshRPC() {
        if (this.config.enableRPC) {
            console.log(this.t('rpc.refreshing'));
            await this.setupRichPresence(true);
        }
    }

    // Update RPC configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Refresh RPC if enabled
        if (this.config.enableRPC) {
            this.refreshRPC();
        }
    }

    // Enable/disable RPC
    async setEnabled(enabled) {
        this.config.enableRPC = enabled;
        if (enabled) {
            await this.setupRichPresence();
        } else {
            this.stopMonitoring();
            try {
                if (this.client && this.client.user && this.client.user.setPresence) {
                    this.client.user.setPresence({ activities: [], status: 'online' });
                }
            } catch (error) {
                console.error('Error disabling RPC:', error.message);
            }
        }
    }

    // Get RPC status
    getStatus() {
        return {
            enabled: this.config.enableRPC,
            active: this.isActive,
            retryCount: this.retryCount,
            maxRetries: this.maxRetries,
            monitoring: !!this.monitorInterval
        };
    }
}

module.exports = RPCManager;
