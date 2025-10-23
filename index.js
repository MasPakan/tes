const { Client, RichPresence } = require('discord.js-selfbot-v13');
const https = require('https');
const fs = require('fs');
const path = require('path');
const DiscordSelfbotCLI = require('./cli');

// Configuration will be loaded from CLI
let config = {
    token: '',
    webhookUrl: '',
    prefix: '!',
    enableRPC: true,
    username: 'Unknown User',
    applicationId: "1396351851410227292"
};

// Load configuration from ihannsy.json
function loadConfig() {
    try {
        const configFile = path.join(__dirname, 'ihannsy.json');
        if (fs.existsSync(configFile)) {
            const data = fs.readFileSync(configFile, 'utf8');
            const ihannsyConfig = JSON.parse(data);
            return ihannsyConfig;
        }
    } catch (error) {
        console.error('❌ Error loading configuration:', error.message);
    }
    return null;
}

// Initialize client
const client = new Client({
    checkUpdate: false,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

// Auto post storage
const autoPosts = new Map();
let postIndex = 1;
let postCount = 0;

// Utility functions
function formatDateTime() {
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

// Autopost webhook log function
function sendAutopostWebhookLog(action, channel, message = null, error = null, delay = null, uptime = null, postCount = null) {
    if (!config.webhookUrl || config.webhookUrl === 'YOUR_WEBHOOK_URL_HERE') {
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
                        value: `<@${client.user.id}>`,
                        inline: true
                    },
                    {
                        name: "Channel Post",
                        value: channel ? `<#${channel.id}>` : "N/A"
                    },
                    {
                        name: "Delay per Message",
                        value: delay ? `${delay} minutes` : "N/A"
                    },
                    {
                        name: "Uptime App",
                        value: uptime || "N/A"
                    },
                    {
                        name: "Post Counter",
                        value: postCount ? postCount.toString() : "N/A"
                    },
                    {
                        name: "Status",
                        value: error ? `❌ Error: ${error}` : "✅ Success"
                    }
                ],
                footer: {
                    text: `𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀.\nWe Grow Because You Believe.\nHonest From the Start, Always Safe.\n${formatDateTime()}`
                },
                image: {
                    url: "https://cdn.discordapp.com/attachments/1407966960498642965/1410705503692132503/Proyek_Baru_129_F60CEC6.gif?ex=68f92e61&is=68f7dce1&hm=ca4d13875c6725e7c303fcc377a2f45aab0a3e1e0fe8bf9b950705a20f161c0e&"
                },
                thumbnail: {
                    url: "https://cdn.discordapp.com/attachments/1407966960498642965/1430088592851472435/imqualtz_musicaldown.com_1760959133.jpg?ex=68f92a0a&is=68f7d88a&hm=cd2087dce3b2eea6d76d609cd9384f27d41d77476f5ef05506025c0c135aed5f&"
                }
            }],
            username: `𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀 𝘼𝙐𝙏𝙊𝙋𝙊𝙎𝙏 - ${client.user.username}`,
            avatar_url: client.user.avatarURL(),
            attachments: []
        };

        sendWebhookRequest(webhookData);
    } catch (error) {
        console.error('Error sending autopost webhook log:', error.message);
    }
}

// Activity webhook log function
function sendActivityWebhookLog(activity, error = null) {
    if (!config.webhookUrl || config.webhookUrl === 'YOUR_WEBHOOK_URL_HERE') {
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
                        value: `<@${client.user.id}>`
                    },
                    {
                        name: "Activity",
                        value: error ? `❌ Error: ${error}` : activity
                    }
                ],
                footer: {
                    text: `𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀.\n${formatDateTime()}`
                },
                image: {
                    url: "https://cdn.discordapp.com/attachments/1407966960498642965/1410705503692132503/Proyek_Baru_129_F60CEC6.gif?ex=68f92e61&is=68f7dce1&hm=ca4d13875c6725e7c303fcc377a2f45aab0a3e1e0fe8bf9b950705a20f161c0e&"
                },
                thumbnail: {
                    url: "https://cdn.discordapp.com/attachments/1407966960498642965/1430088592851472435/imqualtz_musicaldown.com_1760959133.jpg?ex=68f92a0a&is=68f7d88a&hm=cd2087dce3b2eea6d76d609cd9384f27d41d77476f5ef05506025c0c135aed5f&"
                }
            }],
            username: `𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀 𝘼𝙐𝙏𝙊𝙋𝙊𝙎𝙏 - ${client.user.username}`,
            avatar_url: client.user.avatarURL(),
            attachments: []
        };

        sendWebhookRequest(webhookData);
    } catch (error) {
        console.error('Error sending activity webhook log:', error.message);
    }
}

// Generic webhook request function
function sendWebhookRequest(webhookData) {
    const postData = JSON.stringify(webhookData);

    const url = new URL(config.webhookUrl);
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

// Auto post function with error handling
async function startAutoPost(index, message, delay, channelId, attachments = []) {
    try {
        const channel = client.channels.cache.get(channelId);
        if (!channel) {
            console.error(`❌ Channel ${channelId} not found`);
            sendActivityWebhookLog("Auto Post Start Failed", `Channel ${channelId} not found`);
            return;
        }

        const postData = {
            message,
            delay: delay * 1000, // Convert to milliseconds (delay is already in seconds)
            channelId,
            attachments,
            intervalId: null,
            isRunning: true
        };

        const postInterval = async () => {
            try {
                const messageOptions = { content: message };
                
                if (attachments.length > 0) {
                    messageOptions.files = attachments.map(att => ({
                        attachment: att.url,
                        name: att.name
                    }));
                }

                await channel.send(messageOptions);
                console.log(`[${index}] Posted to ${channel.name} (${channelId})`);
                sendAutopostWebhookLog("Auto Post Executed", channel, message, null, delay, null, postCount);
            } catch (error) {
                console.error(`❌ [${index}] Error posting to ${channel.name}:`, error.message);
                console.error('Stack:', error.stack);
                sendAutopostWebhookLog("Auto Post Error", channel, message, error.message, delay, null, postCount);
                
                // If it's a permission error, stop the auto post
                if (error.code === 50013 || error.message.includes('permission')) {
                    console.log(`[${index}] Stopping auto post due to permission error`);
                    stopAutoPost(index);
                }
            }
        };

        // Start the interval
        postData.intervalId = setInterval(postInterval, postData.delay);
        autoPosts.set(index, postData);

        const delayMinutes = Math.round(delay / 60);
        console.log(`[${index}] Auto post started in ${channel.name} with ${delayMinutes} minute(s) delay`);
        sendAutopostWebhookLog("Auto Post Started", channel, message, null, delay, null, 0);
    } catch (error) {
        console.error(`❌ Error starting auto post [${index}]:`, error);
        console.error('Stack:', error.stack);
        sendActivityWebhookLog("Auto Post Start Error", error.message);
    }
}

// Stop auto post function with error handling
function stopAutoPost(index) {
    try {
        if (index === 'all') {
            autoPosts.forEach((postData, idx) => {
                try {
                    if (postData.intervalId) {
                        clearInterval(postData.intervalId);
                        postData.isRunning = false;
                        console.log(`[${idx}] Auto post stopped`);
                    }
                } catch (error) {
                    console.error(`❌ Error stopping auto post [${idx}]:`, error.message);
                }
            });
            autoPosts.clear();
            console.log('✅ All auto posts stopped');
            return;
        }

        const postData = autoPosts.get(index);
        if (postData) {
            try {
                if (postData.intervalId) {
                    clearInterval(postData.intervalId);
                }
                postData.isRunning = false;
                autoPosts.delete(index);
                console.log(`[${index}] Auto post stopped`);
            } catch (error) {
                console.error(`❌ Error stopping auto post [${index}]:`, error.message);
            }
        } else {
            console.log(`[${index}] Auto post not found`);
        }
    } catch (error) {
        console.error('❌ Error in stopAutoPost function:', error);
        console.error('Stack:', error.stack);
    }
}

// Command handler with error handling
client.on('messageCreate', async (message) => {
    try {
        if (message.author.id !== client.user.id) return;

        const args = message.content.trim().split(/\s+/);
        const command = args[0].toLowerCase();
        
        // Check if message starts with configured prefix
        if (!command.startsWith(config.prefix)) return;
        
        // Remove prefix from command
        const actualCommand = command.substring(config.prefix.length);

        // Wrap command execution in try-catch
        await executeCommand(message, actualCommand, args);
    } catch (error) {
        console.error('❌ Error in message handler:', error);
        console.error('Stack:', error.stack);
        
        // Log to webhook if available
        if (config.webhookUrl) {
            sendActivityWebhookLog("Message Handler Error", error.message);
        }
        
        // Try to send error message to user
        try {
            if (message && message.edit) {
                await message.edit(`❌ An error occurred: ${error.message}`);
            }
        } catch (editError) {
            console.error('❌ Failed to send error message:', editError.message);
        }
    }
});

// Command execution function
async function executeCommand(message, actualCommand, args) {
    try {
        switch (actualCommand) {
            case 'post':
                if (args.length < 4) {
                    await message.edit(`Usage: ${config.prefix}post <index> <message> <delay_minutes> <channel_id>\n\n**Note:** Attach files to your command message to include them in auto posts!`);
                    return;
                }

                const index = parseInt(args[1]);
                const postMessage = args[2];
                const delayMinutes = parseInt(args[3]);
                const channelId = args[4];

                if (isNaN(index) || isNaN(delayMinutes)) {
                    await message.edit('Index and delay must be numbers');
                    return;
                }

                if (delayMinutes < 1) {
                    await message.edit('Minimum delay is 1 minute');
                    return;
                }

                const delay = delayMinutes * 60; // Convert minutes to seconds

                // Process attachments from the message
                const attachments = [];
                if (message.attachments && message.attachments.size > 0) {
                    message.attachments.forEach(attachment => {
                        attachments.push({
                            url: attachment.url,
                            name: attachment.name,
                            size: attachment.size,
                            contentType: attachment.contentType
                        });
                    });
                    console.log(`[${index}] Found ${attachments.length} attachment(s) to include in auto post`);
                }

                await startAutoPost(index, postMessage, delay, channelId, attachments);
                const attachmentInfo = attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : '';
                await message.edit(`✅ Auto post [${index}] started in <#${channelId}> with ${delayMinutes} minute(s) delay${attachmentInfo}`);
                break;

            case 'index':
                if (autoPosts.size === 0) {
                    await message.edit('No active auto posts');
                    return;
                }

                let indexList = '**Active Auto Posts:**\n';
                autoPosts.forEach((postData, idx) => {
                    const channel = client.channels.cache.get(postData.channelId);
                    const channelName = channel ? channel.name : 'Unknown';
                    const delayMinutes = Math.round(postData.delay / 60000);
                    indexList += `[${idx}] ${channelName} (${postData.channelId}) - ${delayMinutes} minute(s) delay - ${postData.isRunning ? '🟢 Running' : '🔴 Stopped'}\n`;
                });

                await message.edit(indexList);
                break;

            case 'stop':
                if (args.length === 1) {
                    stopAutoPost('all');
                    await message.edit('🛑 All auto posts stopped');
                } else {
                    const stopIndex = parseInt(args[1]);
                    if (isNaN(stopIndex)) {
                        await message.edit('Index must be a number');
                        return;
                    }
                    stopAutoPost(stopIndex);
                    await message.edit(`🛑 Auto post [${stopIndex}] stopped`);
                }
                break;

            case 'ping':
                const latency = client.ws.ping;
                const apiLatency = Date.now() - message.createdTimestamp;
                await message.edit(`🏓 **Pong!**\nBot Latency: ${latency}ms\nAPI Latency: ${apiLatency}ms`);
                break;

            case 'help':
                const helpEmbed = {
                    title: "🤖 **PAKAN STORE AUTOPOST BOT**",
                    description: "Selfbot automation untuk auto posting dengan fitur lengkap",
                    color: 0x00FF00,
                    fields: [
                        {
                            name: "📝 **Auto Post Commands**",
                            value: `\`${config.prefix}post <index> <message> <delay_minutes> <channel_id>\`\nStart auto posting dengan delay custom (dalam menit)\n**Attach files to your command message to include them!**`,
                            inline: false
                        },
                        {
                            name: "📋 **Management Commands**",
                            value: `\`${config.prefix}index\` - List semua autopost aktif\n\`${config.prefix}stop <index>\` - Hentikan autopost spesifik\n\`${config.prefix}stop\` - Hentikan semua autopost\n\`${config.prefix}ping\` - Cek latency bot\n\`${config.prefix}help\` - Tampilkan manual ini`,
                            inline: false
                        },
                        {
                            name: "⚙️ **Parameters**",
                            value: "• `index`: Nomor unik untuk identifikasi autopost\n• `message`: Pesan yang akan di-post\n• `delay_minutes`: Delay dalam menit (min 1 menit)\n• `channel_id`: ID channel target\n• `attachments`: **Attach files to your command message!**",
                            inline: false
                        },
                        {
                            name: "🔧 **Features**",
                            value: "• Multi channel posting\n• Custom delay per channel\n• **Easy file attachment** (just attach to command!)\n• Webhook logging\n• Rich Presence\n• Error handling",
                            inline: false
                        }
                    ],
                    footer: {
                        text: "𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀 - We Grow Because You Believe"
                    },
                    timestamp: new Date().toISOString()
                };

                await message.edit({ embeds: [helpEmbed] });
                break;

            default:
                // Ignore other messages
                break;
        }
    } catch (error) {
        console.error('❌ Command execution error:', error);
        console.error('Stack:', error.stack);
        
        // Log to webhook if available
        if (config.webhookUrl) {
            sendActivityWebhookLog("Command Error", error.message);
        }
        
        try {
            await message.edit(`❌ Command error: ${error.message}`);
        } catch (editError) {
            console.error('❌ Failed to edit message:', editError.message);
        }
    }
}

// Set up Rich Presence with error handling
function setupRichPresence() {
    if (!config.enableRPC) {
        console.log('ℹ️  Rich Presence disabled in configuration');
        return;
    }

    try {
        const rpc = new RichPresence(client)
            .setApplicationId(config.applicationId)
            .setType("WATCHING")
            .setName("Aurhel Alana")
            .setDetails("You, MyLove, Forever💕")
            .setState("Aurhelana - iHannsy")
            .setStartTimestamp(client.readyTimestamp)
            .setAssetsLargeImage("https://cdn.discordapp.com/attachments/1407966960498642965/1407967063657681037/Proyek_Baru_121_B8AF8E8.gif")
            .setAssetsLargeText("Bininya MasPakan🥰💕")
            .setAssetsSmallImage("https://cdn.discordapp.com/attachments/1407966960498642965/1407967063984574544/white.gif")
            .setAssetsSmallText("iHannsy - MasPakan")
            .addButton("Aurhelana", "https://www.instagram.com/saya.p4rhan")
            .addButton("iHannsy", "https://www.instagram.com/saya.p4rhan");

        client.user.setPresence({ activities: [rpc], status: "dnd" });
        console.log('✅ Rich Presence set successfully');
    } catch (error) {
        console.error('❌ Failed to set Rich Presence:', error.message);
        console.error('Stack:', error.stack);
        
        // Log to webhook if available
        if (config.webhookUrl) {
            sendActivityWebhookLog("Rich Presence Error", error.message);
        }
    }
}

// Event handlers
client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag} (${client.user.id})`);
    console.log(`👤 Account: ${config.username}`);
    console.log(`🔧 Prefix: ${config.prefix}`);
    console.log(`📊 Guilds: ${client.guilds.cache.size}`);
    console.log(`📺 Channels: ${client.channels.cache.size}`);
    console.log(`🌐 Webhook: ${config.webhookUrl ? 'Enabled' : 'Disabled'}`);
    console.log(`🎮 RPC: ${config.enableRPC ? 'Enabled' : 'Disabled'}`);
    
    setupRichPresence();
    sendActivityWebhookLog("Selfbot started successfully");
});

client.on('error', (error) => {
    console.error('❌ Discord Client Error:', error);
    console.error('Stack:', error.stack);
    
    // Log to webhook if available
    if (config.webhookUrl) {
        sendActivityWebhookLog("Discord Client Error", error.message);
    }
    
    // Don't exit immediately, try to reconnect
    console.log('🔄 Attempting to continue despite client error...');
});

client.on('warn', (info) => {
    console.warn('⚠️  Discord Client Warning:', info);
    
    // Log to webhook if available
    if (config.webhookUrl) {
        sendActivityWebhookLog("Discord Client Warning", String(info));
    }
});

client.on('disconnect', () => {
    console.log('🔌 Discord client disconnected');
    sendActivityWebhookLog("Discord client disconnected");
});

client.on('reconnecting', () => {
    console.log('🔄 Reconnecting to Discord...');
    sendActivityWebhookLog("Attempting to reconnect to Discord");
});

client.on('resume', () => {
    console.log('✅ Reconnected to Discord');
    sendActivityWebhookLog("Successfully reconnected to Discord");
});

// Error handling and cleanup
let isShuttingDown = false;

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    console.error('Promise:', promise);
    
    // Log to webhook if available
    if (config.webhookUrl) {
        sendActivityWebhookLog("Unhandled Promise Rejection", reason?.message || String(reason));
    }
    
    // Don't exit immediately, let the process continue
    console.log('⚠️  Process continuing despite unhandled rejection...');
});

// Uncaught Exception Handler
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    
    // Log to webhook if available
    if (config.webhookUrl) {
        sendActivityWebhookLog("Uncaught Exception", error.message);
    }
    
    // Cleanup before exit
    if (!isShuttingDown) {
        isShuttingDown = true;
        console.log('🛑 Emergency shutdown due to uncaught exception...');
        stopAutoPost('all');
        sendActivityWebhookLog("Bot crashed due to uncaught exception");
        
        // Give some time for cleanup
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    }
});

// Warning Handler
process.on('warning', (warning) => {
    console.warn('⚠️  Warning:', warning.name);
    console.warn('Message:', warning.message);
    console.warn('Stack:', warning.stack);
    
    // Log to webhook if available
    if (config.webhookUrl) {
        sendActivityWebhookLog("Process Warning", `${warning.name}: ${warning.message}`);
    }
});

// Graceful shutdown handlers
function gracefulShutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    
    console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
    
    try {
        // Stop all auto posts
        stopAutoPost('all');
        
        // Send shutdown log to webhook
        if (config.webhookUrl) {
            sendActivityWebhookLog(`Bot shutting down due to ${signal}`);
        }
        
        console.log('✅ Cleanup completed');
        
        // Give some time for webhook to send
        setTimeout(() => {
            process.exit(0);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Process exit handler
process.on('exit', (code) => {
    console.log(`📤 Process exiting with code: ${code}`);
    if (code !== 0) {
        console.log('❌ Process exited with error code');
    }
});

// Main function with error handling
async function main() {
    try {
        const cli = new DiscordSelfbotCLI();
        const result = await cli.start();
        
        if (result.action === 'start') {
            // Load configuration from CLI result
            config = { ...config, ...result.config };
            
            // Validate configuration
            if (!config.token) {
                console.error('❌ No token provided');
                process.exit(1);
            }
            
            // Start the bot with retry logic
            await startBotWithRetry();
        }
    } catch (error) {
        console.error('❌ Fatal error in main:', error);
        console.error('Stack:', error.stack);
        
        // Log to webhook if available
        if (config.webhookUrl) {
            sendActivityWebhookLog("Fatal Error", error.message);
        }
        
        console.log('🔄 Restarting in 5 seconds...');
        setTimeout(() => {
            main().catch(err => {
                console.error('❌ Failed to restart:', err.message);
                process.exit(1);
            });
        }, 5000);
    }
}

// Bot startup with retry logic
async function startBotWithRetry(maxRetries = 3) {
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            console.log(`🔄 Attempting to login (attempt ${retryCount + 1}/${maxRetries})...`);
            await client.login(config.token);
            return; // Success, exit the retry loop
        } catch (error) {
            retryCount++;
            console.error(`❌ Login attempt ${retryCount} failed:`, error.message);
            
            if (retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                console.log(`⏳ Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('❌ All login attempts failed');
                console.log('🔄 Returning to main menu...');
                setTimeout(() => main(), 2000);
            }
        }
    }
}

// Start the application with global error handling
main().catch(error => {
    console.error('❌ Unhandled error in main process:', error);
    console.error('Stack:', error.stack);
    
    // Log to webhook if available
    if (config.webhookUrl) {
        sendActivityWebhookLog("Unhandled Main Error", error.message);
    }
    
    console.log('🛑 Exiting due to unhandled error...');
    process.exit(1);
});