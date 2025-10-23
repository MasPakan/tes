# Installation Guide

This guide will help you install and set up the Discord Selfbot Automation project.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Discord account (not bot account)
- Discord webhook URL (optional, for logging)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ihannsy/discord-selfbot-automation.git
cd discord-selfbot-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Bot

Copy the example configuration:

```bash
cp examples/config-example.json config/ihannsy.json
```

Edit `config/ihannsy.json` with your Discord token and webhook URL.

### 4. Run the Bot

```bash
npm start
```

## Alternative Installation Methods

### Using Yarn

```bash
yarn install
yarn start
```

### Using pnpm

```bash
pnpm install
pnpm start
```

## Configuration

The bot uses an interactive CLI for configuration. When you first run the bot, it will guide you through:

1. Entering your Discord user token
2. Setting up webhook logging (optional)
3. Configuring command prefix
4. Enabling Rich Presence

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Run `npm install` to install dependencies

2. **"Invalid token" errors**
   - Make sure you're using a user token, not a bot token
   - Check that the token is correct and not expired

3. **"Webhook URL invalid" errors**
   - Make sure the webhook URL is a valid Discord webhook
   - Check that the webhook hasn't been deleted

### Getting Help

- Check the [README.md](../README.md) for general information
- Check the [CHANGELOG.md](../CHANGELOG.md) for recent changes
- Open an issue on GitHub if you encounter bugs

## Security Notes

- Never share your Discord token with anyone
- Don't commit your `config/ihannsy.json` file to version control
- Use webhooks only on trusted servers
- Be aware that using selfbots violates Discord's Terms of Service

## Updating

To update the bot to the latest version:

```bash
npm run update
```

This will check for updates and guide you through the update process.