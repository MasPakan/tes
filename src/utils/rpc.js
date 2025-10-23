const { RichPresence } = require('discord.js-selfbot-v13');

class RPCManager {
    constructor(client, config, languageManager) {
        this.client = client;
        this.config = config;
        this.languageManager = languageManager;
    }

    t(key, params = {}) {
        return this.languageManager ? this.languageManager.t(key, params) : key;
    }

    // Setup Rich Presence
    setupRichPresence() {
        if (!this.config.enableRPC) {
            console.log(this.t('rpc.disabled'));
            return;
        }

        try {
            const rpc = new RichPresence(this.client)
                .setApplicationId("1396351851410227292")
                .setType("WATCHING")
                .setName("Aurhel Alana")
                .setDetails("Aurhel Alana")
                .setState("You,My Love,Forever💞")
                .setStartTimestamp(this.client.readyTimestamp)
                .setAssetsLargeImage("1407967063657681037")
                .setAssetsLargeText("Bininya MasPakan🥰💕")
                .setAssetsSmallImage("1407967063984574544")
                .setAssetsSmallText("iHannsy - MasPakan")
                .addButton("Github", "https://www.github.com/namakuhans")
                .addButton("Instagram", "https://www.instagram.com/saya.p4rhan");

            this.client.user.setPresence({ 
                activities: [rpc], 
                status: "dnd" 
            });

            console.log(this.t('rpc.enabled'));
        } catch (error) {
            console.error(this.t('rpc.error', { error: error.message }));
        }
    }

    // Update RPC configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Enable/disable RPC
    setEnabled(enabled) {
        this.config.enableRPC = enabled;
        if (enabled) {
            this.setupRichPresence();
        } else {
            this.client.user.setPresence({ activities: [], status: 'online' });
        }
    }
}

module.exports = RPCManager;
