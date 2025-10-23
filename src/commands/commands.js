class CommandHandler {
    constructor(client, config, webhookLogger, autoPosts, languageManager) {
        this.client = client;
        this.config = config;
        this.webhookLogger = webhookLogger;
        this.autoPosts = autoPosts;
        this.languageManager = languageManager;
        this.postIndex = 1;
        this.postCount = 0;
    }

    t(key, params = {}) {
        return this.languageManager.t(key, params);
    }

    // Safe message sending with error handling
    async safeSendMessage(message) {
        try {
            await this.client.user.send(message);
        } catch (error) {
            switch (error.code) {
                case 50007: // Cannot send messages to this user
                    console.log(this.t('errors.dm_disabled'));
                    console.log(this.t('errors.dm_fallback', { message }));
                    break;
                case 50013: // Missing permissions
                    console.log(this.t('errors.missing_permissions'));
                    console.log(this.t('errors.dm_fallback', { message }));
                    break;
                case 50001: // Missing access
                    console.log(this.t('errors.missing_access'));
                    console.log(this.t('errors.dm_fallback', { message }));
                    break;
                default:
                    console.error(this.t('errors.message_send_failed', { error: error.message }));
                    console.log(this.t('errors.dm_fallback', { message }));
            }
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

    // Start auto posting
    async startAutoPost(index, message, delay, channelId, attachments = []) {
        try {
            const channel = this.client.channels.cache.get(channelId);
            if (!channel) {
                await this.safeSendMessage(`Channel ${channelId} not found`);
                this.webhookLogger.sendActivityLog("Auto Post Start Failed", `Channel ${channelId} not found`);
                return;
            }

            // Send first message immediately
            try {
                const postData = {
                    content: message,
                    files: attachments.map(att => ({
                        attachment: att.url,
                        name: att.name
                    }))
                };

                await channel.send(postData);
                this.postCount++;
                const autoPost = this.autoPosts.get(index);
                const uptime = autoPost ? Date.now() - autoPost.startTime : null;
                this.webhookLogger.sendAutopostLog("Auto Post Executed", channel, message, null, delay, uptime, this.postCount);
            } catch (error) {
                console.error(`Error sending first message to ${channel.name}:`, error.message);
                const autoPost = this.autoPosts.get(index);
                const uptime = autoPost ? Date.now() - autoPost.startTime : null;
                this.webhookLogger.sendAutopostLog("Auto Post Error", channel, message, error.message, delay, uptime, this.postCount);
                
                // Stop auto post if permission error
                if (error.code === 50013) {
                    await this.safeSendMessage(`Auto post ${index} stopped due to permission error in ${channel.name}`);
                    return;
                }
            }

            // Set up interval for subsequent messages
            const intervalId = setInterval(async () => {
                try {
                    const postData = {
                        content: message,
                        files: attachments.map(att => ({
                            attachment: att.url,
                            name: att.name
                        }))
                    };

                    await channel.send(postData);
                    this.postCount++;
                    const autoPost = this.autoPosts.get(index);
                    const uptime = autoPost ? Date.now() - autoPost.startTime : null;
                    this.webhookLogger.sendAutopostLog("Auto Post Executed", channel, message, null, delay, uptime, this.postCount);
                } catch (error) {
                    console.error(`Error posting to ${channel.name}:`, error.message);
                    const autoPost = this.autoPosts.get(index);
                    const uptime = autoPost ? Date.now() - autoPost.startTime : null;
                    this.webhookLogger.sendAutopostLog("Auto Post Error", channel, message, error.message, delay, uptime, this.postCount);
                    
                    // Stop auto post if permission error
                    if (error.code === 50013) {
                        clearInterval(intervalId);
                        this.autoPosts.delete(index);
                        await this.safeSendMessage(`Auto post ${index} stopped due to permission error in ${channel.name}`);
                    }
                }
            }, delay * 60 * 1000); // Convert minutes to milliseconds

            this.autoPosts.set(index, {
                intervalId,
                channel,
                message,
                delay,
                attachments,
                startTime: Date.now()
            });

            await this.safeSendMessage(this.t('commands.autopost.started', {
                index,
                channel_id: channelId,
                delay,
                count: attachments.length
            }));
            this.webhookLogger.sendAutopostLog("Auto Post Started", channel, message, null, delay, 0, 0);
        } catch (error) {
            console.error('Error starting auto post:', error.message);
            this.webhookLogger.sendActivityLog("Auto Post Start Error", error.message);
        }
    }

    // Stop auto posting
    stopAutoPost(index) {
        if (index) {
            const autoPost = this.autoPosts.get(index);
            if (autoPost) {
                clearInterval(autoPost.intervalId);
                this.autoPosts.delete(index);
                return this.t('commands.autopost.stopped', { index });
            }
            return this.t('commands.autopost.not_found', { index });
        } else {
            // Stop all auto posts
            let stoppedCount = 0;
            this.autoPosts.forEach((autoPost, key) => {
                try {
                    clearInterval(autoPost.intervalId);
                    this.autoPosts.delete(key);
                    stoppedCount++;
                } catch (error) {
                    console.error(`Error stopping auto post ${key}:`, error.message);
                }
            });
            return this.t('commands.autopost.stopped_all');
        }
    }

    // Get auto post list
    getAutoPostList() {
        if (this.autoPosts.size === 0) {
            return this.t('commands.autopost.list_empty');
        }

        let list = this.t('commands.autopost.list_empty').split('\n')[0] + '\n';
        this.autoPosts.forEach((autoPost, index) => {
            list += this.t('commands.autopost.list_item', {
                index,
                channel_id: autoPost.channel.id,
                delay: autoPost.delay,
                count: autoPost.attachments.length
            }) + '\n';
        });

        return list;
    }

    // Get ping information
    async getPingInfo() {
        const botLatency = this.client.ws.ping;
        const apiLatency = await this.client.ws.ping;
        
        return this.t('commands.ping.title', {
            bot_latency: botLatency,
            api_latency: apiLatency
        });
    }

    // Get help information
    getHelpInfo() {
        return `${this.t('commands.help.title')}
${this.t('commands.help.features')}

${this.t('commands.help.commands')}
${this.t('commands.help.contact')}`;
    }

    // Handle command execution
    async executeCommand(message) {
        try {
            if (!message.content.startsWith(this.config.prefix)) return;

            const args = message.content.slice(this.config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            switch (command) {
                case 'post':
                    if (args.length < 4) {
                        await message.reply(`Usage: ${this.config.prefix}post <index> <message> <delay_minutes> <channel_id>\n\n**Note:** Attach files to your command message to include them in auto posts!`);
                        return;
                    }

                    const [index, ...messageParts] = args;
                    const delay = parseInt(args[args.length - 2]);
                    const channelId = args[args.length - 1];
                    const messageText = messageParts.slice(0, -2).join(' ');

                    if (isNaN(delay) || delay < 1) {
                        await message.reply('Delay must be a number greater than 0');
                        return;
                    }

                    if (this.autoPosts.has(index)) {
                        await message.reply(`Auto post ${index} already exists`);
                        return;
                    }

                    // Extract attachments from the message
                    const attachments = message.attachments.map(att => ({
                        url: att.url,
                        name: att.name
                    }));

                    await this.startAutoPost(index, messageText, delay, channelId, attachments);
                    break;

                case 'index':
                    await message.reply(this.getAutoPostList());
                    break;

                case 'stop':
                    const stopIndex = args[0];
                    const result = this.stopAutoPost(stopIndex);
                    await message.reply(result);
                    break;

                case 'ping':
                    const pingInfo = await this.getPingInfo();
                    await message.reply(pingInfo);
                    break;

                case 'help':
                    await message.reply(this.getHelpInfo());
                    break;

                default:
                    await message.reply(`Unknown command. Use ${this.config.prefix}help for available commands.`);
            }
        } catch (error) {
            console.error('Command execution error:', error.message);
            this.webhookLogger.sendActivityLog("Command Error", error.message);
        }
    }
}

module.exports = CommandHandler;