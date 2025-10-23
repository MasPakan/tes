class CommandHandler {
    constructor(client, config, webhookLogger, autoPosts) {
        this.client = client;
        this.config = config;
        this.webhookLogger = webhookLogger;
        this.autoPosts = autoPosts;
        this.postIndex = 1;
        this.postCount = 0;
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
                await this.client.user.send(`Channel ${channelId} not found`);
                this.webhookLogger.sendActivityLog("Auto Post Start Failed", `Channel ${channelId} not found`);
                return;
            }

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
                    this.webhookLogger.sendAutopostLog("Auto Post Executed", channel, message, null, delay, null, this.postCount);
                } catch (error) {
                    console.error(`Error posting to ${channel.name}:`, error.message);
                    this.webhookLogger.sendAutopostLog("Auto Post Error", channel, message, error.message, delay, null, this.postCount);
                    
                    // Stop auto post if permission error
                    if (error.code === 50013) {
                        clearInterval(intervalId);
                        this.autoPosts.delete(index);
                        await this.client.user.send(`Auto post ${index} stopped due to permission error in ${channel.name}`);
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

            await this.client.user.send(`# AUTOPOST STARTED\n> - Index **${index}**\n> - Running in **<#${channelId}>**'s\n> - Delay **${delay}** minute(s)\n> - Attachment(s) **${attachments.length}**`);
            this.webhookLogger.sendAutopostLog("Auto Post Started", channel, message, null, delay, null, 0);
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
                return `Auto post ${index} stopped`;
            }
            return `Auto post ${index} not found`;
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
            return `Stopped ${stoppedCount} auto posts`;
        }
    }

    // Get auto post list
    getAutoPostList() {
        if (this.autoPosts.size === 0) {
            return "# AUTO POST LIST\n> - **No Auto Post Running**";
        }

        let list = "# AUTO POST LIST\n";
        this.autoPosts.forEach((autoPost, index) => {
            list += `> - **${index}:** [Ch: <#${autoPost.channel.id}> - D: ${autoPost.delay} A: ${autoPost.attachments.length}]\n`;
        });

        return list;
    }

    // Get ping information
    async getPingInfo() {
        const botLatency = this.client.ws.ping;
        const apiLatency = await this.client.ws.ping;
        
        return `# 🏓 PONG!\n> - Bot Latency: ${botLatency}ms\n> - API Latency: ${apiLatency}ms`;
    }

    // Get help information
    getHelpInfo() {
        return `# SELFBOT BY iHANNSY
## 🔍FEATURES:
> - Auto Send Post
> - Independent WebHook Log For Auto Posting And System
> - RPC or Activity Profile
> - Prefix Command Selfbot (Only Selfbot Can Access)

## 🔍Command List
\`\`\`css
${this.config.prefix}post <index> <message w/wo attachment> <delay(minute)> <channels id>
${this.config.prefix}index                - To see auto post running list
${this.config.prefix}stop                  - To stop all auto post processes
${this.config.prefix}stop <index> - To stop the autopost process according to the index
${this.config.prefix}ping                  - To see the latency of the selfbot and API
\`\`\`
## CONTACT BELOW TO CONTRIBUTE
[.](https://instagram.com/saya.p4rhan) [.](https://github.com/MasPakan/tes.git) [.](https://discord.gg/8wM2tNhUdB)`;
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