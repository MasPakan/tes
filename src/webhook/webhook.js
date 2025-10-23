const https = require('https');

class WebhookLogger {
    constructor(config) {
        this.config = config;
        this.languageManager = config.languageManager;
    }

    t(key, params = {}) {
        return this.languageManager ? this.languageManager.t(key, params) : key;
    }

    // Format date time in specific format: Thursday, 23 October 2025 | 06.11.23
    formatDateTime() {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayName = days[now.getDay()];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        return `${dayName}, ${day} ${month} ${year} | ${hours}.${minutes}.${seconds}`;
    }

    // Send autopost webhook log
    sendAutopostLog(action, channel, message = null, error = null, delay = null, uptime = null, postCount = null) {
        if (!this.config.webhookUrl || this.config.webhookUrl === 'YOUR_WEBHOOK_URL_HERE') {
            console.log('Webhook URL not configured, skipping webhook log');
            return;
        }

        try {
            const webhookData = {
                content: null,
                embeds: [{
                    title: "**AUTOPOST** - **PAKAN STORE** - **AD & PROMOTE**",
                    description: "Webhook Log Autopostin': This feature right here make integration with third-party systems easy, 'cause it hand over the automatic post log payload. That's the real key for checkin' system health and trackin' the history.",
                    color: null,
                    fields: [
                        {
                            name: this.t('webhook.autopost.fields.client_user'),
                            value: `<@${this.config.clientId}>`,
                            inline: true
                        },
                        {
                            name: this.t('webhook.autopost.fields.channel_post'),
                            value: channel ? `<#${channel.id}>` : "N/A"
                        },
                        {
                            name: this.t('webhook.autopost.fields.delay_per_message'),
                            value: delay ? `${delay} minutes` : "N/A"
                        },
                        {
                            name: this.t('webhook.autopost.fields.uptime_app'),
                            value: uptime || "N/A"
                        },
                        {
                            name: this.t('webhook.autopost.fields.post_counter'),
                            value: postCount ? postCount.toString() : "N/A"
                        },
                        {
                            name: this.t('webhook.autopost.fields.status'),
                            value: error ? `❌ Error: ${error}` : "✅ Success"
                        }
                    ],
                    footer: {
                        text: this.t('webhook.autopost.footer', { datetime: this.formatDateTime() })
                    },
                    image: {
                        url: "https://cdn.discordapp.com/attachments/1407966960498642965/1410705503692132503/Proyek_Baru_129_F60CEC6.gif?ex=68f92e61&is=68f7dce1&hm=ca4d13875c6725e7c303fcc377a2f45aab0a3e1e0fe8bf9b950705a20f161c0e&"
                    },
                    thumbnail: {
                        url: "https://cdn.discordapp.com/attachments/1407966960498642965/1430088592851472435/imqualtz_musicaldown.com_1760959133.jpg?ex=68f92a0a&is=68f7d88a&hm=cd2087dce3b2eea6d76d609cd9384f27d41d77476f5ef05506025c0c135aed5f&"
                    }
                }],
                username: `𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀 𝘼𝙐𝙏𝙊𝙋𝙊𝙎𝙏 - ${this.config.username}`,
                avatar_url: this.config.avatarUrl,
                attachments: []
            };

            this.sendWebhookRequest(webhookData);
        } catch (error) {
            console.error('Error sending autopost webhook log:', error.message);
        }
    }

    // Send activity webhook log
    sendActivityLog(activity, error = null) {
        if (!this.config.webhookUrl || this.config.webhookUrl === 'YOUR_WEBHOOK_URL_HERE') {
            console.log('Webhook URL not configured, skipping webhook log');
            return;
        }

        try {
            const webhookData = {
                content: null,
                embeds: [{
                    title: "**AUTOPOST** - **PAKAN STORE** - **AD & PROMOTE**",
                    description: "Webhook Log Autopostin': This feature right here make integration with third-party systems easy, 'cause it hand over the automatic post log payload. That's the real key for checkin' system health and trackin' the history.",
                    color: null,
                    fields: [
                        {
                            name: "Client User",
                            value: `<@${this.config.clientId}>`
                        },
                        {
                            name: "Activity",
                            value: error ? `❌ Error: ${error}` : activity
                        }
                    ],
                    footer: {
                        text: `𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀.\n${this.formatDateTime()}`
                    },
                    image: {
                        url: "https://cdn.discordapp.com/attachments/1407966960498642965/1410705503692132503/Proyek_Baru_129_F60CEC6.gif?ex=68f92e61&is=68f7dce1&hm=ca4d13875c6725e7c303fcc377a2f45aab0a3e1e0fe8bf9b950705a20f161c0e&"
                    },
                    thumbnail: {
                        url: "https://cdn.discordapp.com/attachments/1407966960498642965/1430088592851472435/imqualtz_musicaldown.com_1760959133.jpg?ex=68f92a0a&is=68f7d88a&hm=cd2087dce3b2eea6d76d609cd9384f27d41d77476f5ef05506025c0c135aed5f&"
                    }
                }],
                username: `𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀 𝘼𝙐𝙏𝙊𝙋𝙊𝙎𝙏 - ${this.config.username}`,
                avatar_url: this.config.avatarUrl,
                attachments: []
            };

            this.sendWebhookRequest(webhookData);
        } catch (error) {
            console.error('Error sending activity webhook log:', error.message);
        }
    }

    // Generic webhook request function
    sendWebhookRequest(webhookData) {
        const postData = JSON.stringify(webhookData);

        const url = new URL(this.config.webhookUrl);
        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            console.log(`Webhook log sent: ${res.statusCode}`);
        });

        req.on('error', (error) => {
            console.error('Webhook error:', error.message);
        });

        req.write(postData);
        req.end();
    }

    // Update config (for when client info changes)
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

module.exports = WebhookLogger;