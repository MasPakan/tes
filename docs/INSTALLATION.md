# 🚀 Installation Guide

Quick setup guide for Discord Selfbot Automation.

## 📋 Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **Discord account** (user token, not bot)
- **Webhook URL** (optional, for logging)

## ⚡ Quick Install

```bash
# 1. Clone repository
git clone https://github.com/MasPakan/tes.git
cd tes

# 2. Install dependencies
npm install

# 3. Run bot
npm start
```

**That's it!** The interactive CLI will handle everything else.

## ⚡ What's New in v1.2.0

### 🚀 Immediate Post Execution
- Commands now send first message immediately
- No more waiting for delay to see results
- Better user experience and feedback

### ⏱️ Enhanced Uptime Display
- Real-time uptime in `HH.MM.SS` format
- Automatic calculation in webhook logs
- Better monitoring capabilities

### 🛡️ Improved Error Handling
- Graceful DM error handling
- Console fallback when DMs fail
- Better error recovery system

## 🎯 First Time Setup

When you run `npm start` for the first time:

1. **Choose Language** 🇺🇸 English or 🇮🇩 Indonesian
2. **Enter Token** - Your Discord user token
3. **Webhook Setup** - Enable/disable logging (optional)
4. **Set Prefix** - Command prefix (default: !)
5. **Rich Presence** - Enable/disable RPC (optional)
6. **Start Bot** - You're ready to go!

## 🔄 Returning Users

Just run `npm start` and select your saved account from the menu.

## 🌍 Language Support

| Language | Code | Status |
|----------|------|--------|
| 🇺🇸 English | `en` | ✅ Default |
| 🇮🇩 Indonesian | `id` | ✅ Available |

**Switch languages** anytime by reconfiguring your account.

## 🛠️ Configuration

The bot automatically creates `config/ihannsy.json` with your settings:

```json
{
  "accounts": {
    "your_username": {
      "token": "your_token",
      "webhookUrl": "webhook_url",
      "prefix": "!",
      "enableRPC": true,
      "language": "en"
    }
  },
  "settings": {
    "language": "en"
  }
}
```

## 🆘 Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| **"Cannot find module"** | Run `npm install` |
| **"Invalid token"** | Use user token, not bot token |
| **"Webhook invalid"** | Check webhook URL |
| **"Language not found"** | Bot falls back to English |
| **Connection errors** | Bot has auto-recovery |

## 🔧 Alternative Install Methods

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

## 🔄 Updating

```bash
npm run update
```

The bot checks for updates automatically on startup.

## 🔒 Security Notes

- ⚠️ **Never share** your Discord token
- ⚠️ **Don't commit** `config/ihannsy.json` to git
- ⚠️ **Use webhooks** only on trusted servers
- ⚠️ **Selfbots violate** Discord ToS - use at your own risk

## 📞 Need Help?

- **Discord**: [Join our server](https://discord.gg/8wM2tNhUdB)
- **Instagram**: [@saya.p4rhan](https://www.instagram.com/saya.p4rhan)
- **GitHub**: [Report issues](https://github.com/MasPakan/tes/issues)

---

**Ready to start?** Run `npm start` and follow the wizard! 🎉