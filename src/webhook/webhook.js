const https = require('https');

class WebhookLogger {
    constructor(config) {
        this.config = config;
        this.languageManager = config.languageManager;
        this.failureCount = 0;
        this.maxFailures = 5;
        this.disabled = false;
        this.lastFailureTime = 0;
        this.cooldownPeriod = 300000; // 5 minutes
    }

    t(key, params = {}) {
        return this.languageManager ? this.languageManager.t(key, params) : key;
    }

    // Check if webhook should be sent
    shouldSendWebhook() {
        // Check if webhook is globally disabled in settings
        if (this.config.settings && this.config.settings.defaultWebhook === false) {
            return false;
        }

        // Check if webhook URL is configured
        if (!this.config.webhookUrl || this.config.webhookUrl === 'YOUR_WEBHOOK_URL_HERE') {
            return false;
        }

        // Check if webhook is disabled due to too many failures
        if (this.disabled) {
            const timeSinceLastFailure = Date.now() - this.lastFailureTime;
            if (timeSinceLastFailure > this.cooldownPeriod) {
                console.log('🔄 Webhook cooldown period ended, re-enabling webhook logging');
                this.disabled = false;
                this.failureCount = 0;
            } else {
                return false;
            }
        }

        return true;
    }

    // Handle webhook failure
    handleWebhookFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.maxFailures) {
            this.disabled = true;
            console.error(`❌ Webhook disabled after ${this.failureCount} consecutive failures. Will retry in ${this.cooldownPeriod / 1000} seconds.`);
            console.log('💡 Tip: Check your webhook URL and internet connection. You can disable webhook logging in the config if needed.');
        } else {
            console.log(`⚠️ Webhook failure ${this.failureCount}/${this.maxFailures}. Will retry automatically.`);
        }
    }

    // Handle webhook success
    handleWebhookSuccess() {
        this.failureCount = 0;
        if (this.disabled) {
            console.log('✅ Webhook re-enabled after successful request');
            this.disabled = false;
        }
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

    // Format uptime in HH.MM.SS format
    formatUptime(uptime) {
        if (!uptime) return "N/A";
        
        const totalSeconds = Math.floor(uptime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
    }

    // Send autopost webhook log
    sendAutopostLog(action, channel, message = null, error = null, delay = null, uptime = null, postCount = null) {
        if (!this.shouldSendWebhook()) {
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
                            value: this.formatUptime(uptime)
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
        if (!this.shouldSendWebhook()) {
            return;
        }

        try {
            const webhookData = {
                content: null,
                embeds: [{
                    title: this.t('webhook.activity.title'),
                    description: this.t('webhook.activity.description'),
                    color: null,
                    fields: [
                        {
                            name: this.t('webhook.activity.fields.client_user'),
                            value: `<@${this.config.clientId}>`
                        },
                        {
                            name: this.t('webhook.activity.fields.activity'),
                            value: error ? `${this.t('common.error')}: ${error}` : activity
                        }
                    ],
                    footer: {
                        text: this.t('webhook.activity.footer', { datetime: this.formatDateTime() })
                    },
                    image: {
                        url: "https://cdn.discordapp.com/attachments/1407966960498642965/1410705503692132503/Proyek_Baru_129_F60CEC6.gif?ex=68f92e61&is=68f7dce1&hm=ca4d13875c6725e7c303fcc377a2f45aab0a3e1e0fe8bf9b950705a20f161c0e&"
                    },
                    thumbnail: {
                        url: "https://cdn.discordapp.com/attachments/1407966960498642965/1430088592851472435/imqualtz_musicaldown.com_1760959133.jpg?ex=68f92a0a&is=68f7d88a&hm=cd2087dce3b2eea6d76d609cd9384f27d41d77476f5ef05506025c0c135aed5f&"
                    }
                }],
                username: this.t('webhook.activity.username', { username: this.config.username }),
                avatar_url: this.config.avatarUrl,
                attachments: []
            };

            this.sendWebhookRequest(webhookData);
        } catch (error) {
            console.error('Error sending activity webhook log:', error.message);
        }
    }

    // Generic webhook request function with timeout and retry logic
    sendWebhookRequest(webhookData, retryCount = 0) {
        const maxRetries = 3;
        const timeout = 10000; // 10 seconds timeout
        
        if (retryCount >= maxRetries) {
            console.error('❌ Webhook failed after maximum retries, giving up');
            return;
        }

        const postData = JSON.stringify(webhookData);

        const url = new URL(this.config.webhookUrl);
        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Discord-Selfbot/1.0.0'
            },
            timeout: timeout
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ Webhook log sent successfully: ${res.statusCode}`);
                    this.handleWebhookSuccess();
                } else {
                    console.warn(`⚠️ Webhook returned status ${res.statusCode}: ${responseData}`);
                    if (res.statusCode >= 500 && retryCount < maxRetries) {
                        this.retryWebhookRequest(webhookData, retryCount);
                    } else {
                        this.handleWebhookFailure();
                    }
                }
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Webhook error (attempt ${retryCount + 1}):`, error.message);
            
            // Retry on connection errors
            if (this.shouldRetry(error) && retryCount < maxRetries) {
                this.retryWebhookRequest(webhookData, retryCount);
            } else {
                console.error('❌ Webhook request failed permanently');
                this.handleWebhookFailure();
            }
        });

        req.on('timeout', () => {
            console.error(`⏰ Webhook request timed out (attempt ${retryCount + 1})`);
            req.destroy();
            
            if (retryCount < maxRetries) {
                this.retryWebhookRequest(webhookData, retryCount);
            } else {
                this.handleWebhookFailure();
            }
        });

        // Set request timeout
        req.setTimeout(timeout);

        try {
            req.write(postData);
            req.end();
        } catch (error) {
            console.error('❌ Error writing to webhook request:', error.message);
            if (retryCount < maxRetries) {
                this.retryWebhookRequest(webhookData, retryCount);
            }
        }
    }

    // Determine if we should retry based on error type
    shouldRetry(error) {
        const retryableErrors = [
            'ECONNABORTED',
            'ECONNRESET',
            'ETIMEDOUT',
            'ENOTFOUND',
            'ECONNREFUSED',
            'EHOSTUNREACH'
        ];
        
        return retryableErrors.some(errorType => 
            error.code === errorType || error.message.includes(errorType)
        );
    }

    // Retry webhook request with exponential backoff
    retryWebhookRequest(webhookData, retryCount) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds
        console.log(`🔄 Retrying webhook request in ${delay}ms...`);
        
        setTimeout(() => {
            this.sendWebhookRequest(webhookData, retryCount + 1);
        }, delay);
    }

    // Update config (for when client info changes)
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Get webhook status
    getStatus() {
        return {
            enabled: !this.disabled,
            configured: !!(this.config.webhookUrl && this.config.webhookUrl !== 'YOUR_WEBHOOK_URL_HERE'),
            failureCount: this.failureCount,
            maxFailures: this.maxFailures,
            disabled: this.disabled,
            timeUntilRetry: this.disabled ? Math.max(0, this.cooldownPeriod - (Date.now() - this.lastFailureTime)) : 0
        };
    }

    // Reset webhook status (for manual recovery)
    resetStatus() {
        this.failureCount = 0;
        this.disabled = false;
        this.lastFailureTime = 0;
        console.log('✅ Webhook status reset');
    }

    // Test webhook connectivity
    async testWebhook() {
        if (!this.shouldSendWebhook()) {
            return false;
        }

        console.log('🔍 Testing webhook connectivity...');
        
        const testData = {
            content: "🧪 Webhook connectivity test",
            username: "Webhook Test",
            embeds: [{
                title: "Connection Test",
                description: "Testing webhook connectivity",
                color: 0x00ff00,
                timestamp: new Date().toISOString()
            }]
        };

        return new Promise((resolve) => {
            const postData = JSON.stringify(testData);
            const url = new URL(this.config.webhookUrl);
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    'User-Agent': 'Discord-Selfbot/1.0.0'
                },
                timeout: 5000
            };

            const req = https.request(options, (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Webhook test successful');
                    this.handleWebhookSuccess();
                    resolve(true);
                } else {
                    console.error(`❌ Webhook test failed: ${res.statusCode}`);
                    this.handleWebhookFailure();
                    resolve(false);
                }
            });

            req.on('error', (error) => {
                console.error('❌ Webhook test error:', error.message);
                this.handleWebhookFailure();
                resolve(false);
            });

            req.on('timeout', () => {
                console.error('⏰ Webhook test timed out');
                req.destroy();
                this.handleWebhookFailure();
                resolve(false);
            });

            req.setTimeout(5000);
            req.write(postData);
            req.end();
        });
    }
}

module.exports = WebhookLogger;