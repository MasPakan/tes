#!/usr/bin/env node

// Main entry point for Discord Selfbot Automation
const DiscordSelfbot = require('./src/bot');

// Start the bot
const bot = new DiscordSelfbot();
bot.start().catch(error => {
    console.error('❌ Error starting bot:', error.message);
    process.exit(1);
});