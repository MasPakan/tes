# Installation Guide

This guide will help you install and set up the Discord Selfbot Automation project with multi-language support and advanced error recovery.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Discord account (not bot account)
- Discord webhook URL (optional, for logging)
- Git (for cloning the repository)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/MasPakan/tes.git
cd tes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Bot

The bot uses an interactive CLI for configuration. No manual file editing required!

The configuration will be automatically created in `config/ihannsy.json` during the first run.

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

1. **Language Selection** - Choose between English and Indonesian
2. **Discord Token** - Enter your Discord user token
3. **Webhook Setup** - Enable/disable webhook logging (optional)
4. **Webhook URL** - Enter webhook URL if enabled
5. **Command Prefix** - Set custom command prefix (default: !)
6. **Rich Presence** - Enable/disable RPC (optional)
7. **Account Management** - Save and manage multiple accounts

### Language Support

The bot supports two languages:
- 🇺🇸 **English** (default)
- 🇮🇩 **Indonesian** (Bahasa Indonesia)

You can change the language during account setup or by reconfiguring an existing account.

### Multi-Account Management

The bot supports multiple Discord accounts:
- Create new accounts through the CLI
- Switch between saved accounts
- Reconfigure existing accounts
- Remove unused accounts
- All settings are saved automatically

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Run `npm install` to install dependencies
   - Make sure you're in the correct directory

2. **"Invalid token" errors**
   - Make sure you're using a user token, not a bot token
   - Check that the token is correct and not expired
   - The bot will automatically retry with error recovery

3. **"Webhook URL invalid" errors**
   - Make sure the webhook URL is a valid Discord webhook
   - Check that the webhook hasn't been deleted
   - Webhook errors won't crash the bot

4. **"Language not found" errors**
   - The bot will automatically fallback to English
   - Check that language files exist in `src/locales/`

5. **Connection errors**
   - The bot has advanced error recovery with automatic retry
   - Check your internet connection
   - The bot will use exponential backoff for retries

6. **Bot crashes or stops responding**
   - The bot has comprehensive error handling
   - Check the console for error messages
   - The bot will automatically restart on certain errors

### Getting Help

- Check the [README.md](../README.md) for general information
- Check the [CHANGELOG.md](../CHANGELOG.md) for recent changes
- Open an issue on GitHub if you encounter bugs

## Security Notes

- Never share your Discord token with anyone
- Don't commit your `config/ihannsy.json` file to version control
- Use webhooks only on trusted servers
- Be aware that using selfbots violates Discord's Terms of Service
- The bot includes advanced error recovery but use at your own risk
- Language files are safe to share as they contain no sensitive data

## Updating

To update the bot to the latest version:

```bash
npm run update
```

This will check for updates and guide you through the update process.

### Update Features

- **Automatic Update Checking** - The bot checks for updates on startup
- **Repository-based Updates** - Updates from the main branch, not releases
- **Backup System** - Automatic backup before updating
- **Language Support** - Update messages in your selected language
- **Error Recovery** - Update process includes error recovery