# 🤖 Discord Selfbot Automation

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/MasPakan/tes)
[![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![Language](https://img.shields.io/badge/language-EN%20%7C%20ID-orange.svg)](https://github.com/MasPakan/tes)
[![Discord](https://img.shields.io/badge/discord-join-7289da.svg?logo=discord&logoColor=white)](https://discord.gg/8wM2tNhUdB)
[![Instagram](https://img.shields.io/badge/instagram-follow-e4405f.svg?logo=instagram&logoColor=white)](https://www.instagram.com/saya.p4rhan)

> **⚠️ WARNING**: Using selfbots violates Discord ToS. Use at your own risk!

## 🚀 Quick Start

```bash
git clone https://github.com/MasPakan/tes.git
cd tes
npm install
npm start
```

**That's it!** The interactive CLI will guide you through everything.

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🌍 **Multi-Language** | English & Indonesian support | ✅ |
| 🤖 **Auto Posting** | Multi-channel with custom delay | ✅ |
| 🎮 **Rich Presence** | Custom RPC with your style | ✅ |
| 📊 **Webhook Logs** | Detailed activity logging | ✅ |
| 🛡️ **Error Recovery** | Smart retry with circuit breaker | ✅ |
| 👥 **Multi-Account** | Manage multiple Discord accounts | ✅ |
| 🔄 **Auto Updates** | Check and update automatically | ✅ |

## 🎯 Commands

| Command | What it does | Example |
|---------|--------------|---------|
| `!post` | Start auto posting | `!post 1 "Hello!" 5 123456789` |
| `!index` | List active posts | `!index` |
| `!stop` | Stop posting | `!stop 1` or `!stop` |
| `!ping` | Check latency | `!ping` |
| `!help` | Show help | `!help` |

## 🌍 Language Support

Choose your language during setup:
- 🇺🇸 **English** (default)
- 🇮🇩 **Indonesian** (Bahasa Indonesia)

Switch languages anytime by reconfiguring your account.

## 🛠️ Configuration

The bot uses an **interactive CLI** - no manual file editing needed!

**First time?** Just run `npm start` and follow the wizard:
1. Choose language
2. Enter Discord token
3. Setup webhook (optional)
4. Configure prefix
5. Enable RPC (optional)
6. Start bot!

**Returning user?** Select your saved account and go!

## 📁 Project Structure

```
tes/
├── main.js                 # Entry point
├── src/
│   ├── bot.js             # Main bot logic
│   ├── cli/               # Interactive CLI
│   ├── commands/          # Bot commands
│   ├── webhook/           # Webhook logging
│   ├── utils/             # Utilities
│   │   ├── language.js    # Language manager
│   │   └── errorRecovery.js # Error recovery
│   └── locales/           # Language files
│       ├── en.json        # English
│       └── id.json        # Indonesian
└── config/ihannsy.json    # Auto-created config
```

## 🛡️ Error Recovery

The bot includes **advanced error recovery**:
- **Smart retry** with exponential backoff
- **Circuit breaker** prevents spam retries
- **Discord-specific** error handling
- **Auto-recovery** from connection issues

## 📊 Screenshots

### CLI Interface
```
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
███████████████████████████████▓████████████████████████████
██████████████████▓▓█████████▓░░▓███████████████████████████
████████████████▓▒▓▓▓▓████▓▒▒░ ░░▒▓██████▓░█████████████████
████████████████░▒▓▒▓▓██████▓▒ ▒▓██████▓▒░ ░▓███████████████
███████████████▒░▒▒▒▓▓███████▒░▓█████▓▒▒▓▓░▒▓███████████████
███████████████░▒▓▒▒▓▓███▓▓██▓▒███████▒▒▓█░██▓▓▓████████████
██████████████▓░▒▓▒▓▓▓██▓▒▒░░░░░▒▒▒▒▓▓▓▓▓█▓██▒▓▓████████████
██████████████▒░▓▒▒▒▓▓▓██▓██▒░░░     ░░░░░░▒▒▒▒▓▓████████████
██████████████▒▒▓▒▒▓▓▓▓█▓███▓▒▒░░░░░      ░░▓▓▓▓████████████
█████████████▓░▒▓▒▓▓▓▓▓▓▓█████▓▓▓▒▒▒░░░▒▓▓▓███▓▓████████████
█████████████▓▒▓▓▒▒▒▓▓▓▓███████████▓██████████▓▓████████████
█████████████▒▒▓▒▒░▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓█████████▓▓█▓▒████████████
█████████████░▒▓▒▓▓▓███████████████████████▓▓█▓▒████████████
█████████████▒▓█▓██████████████████████████▓██▓▓████████████
██████████████▓███████▓▓▓████████████████████▓▓▓████████████
███████████████████▒▓█░▒▒▓█████████████████▓▓▓██████████████
██████████████████▓░▓▓░░░▓███████████▓██▓███████████████████
██████████████████▓▓█▓▓▓▓███████████▓▓█▓▒███████████████████
████████████████████████████████▓▒▒▓▓▓█▓▓███████████████████
████████████████████████████████████████████████████████████

⚠️  Warning: Using selfbots violates Discord ToS. Use at your own risk!

🔍 Checking for updates...
✅ You are running the latest version!

? Select an account or action:
❯ ➕ New Account 
  ❌ Quit
```

### Bot Commands
```
!post 1 "Promo special! 🎉" 5 123456789012345678
# AUTOPOST STARTED
> - Index **1**
> - Running in **<#123456789012345678>**'s
> - Delay **5** minute(s)
> - Attachment(s) **2**

!index
# AUTO POST LIST
> - **1:** [Ch: <#123456789012345678> - D: 5 A: 2]
> - **2:** [Ch: <#987654321098765432> - D: 30 A: 0]

!ping
# 🏓 PONG!
> - Bot Latency: 45ms
> - API Latency: 123ms
```

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Bot won't login** | Check token (user token, not bot token) |
| **Auto post not working** | Check channel ID and permissions |
| **Webhook errors** | Check webhook URL validity |
| **Bot crashes** | Bot has auto-recovery, check console |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- **Discord**: [Join our server](https://discord.gg/8wM2tNhUdB)
- **Instagram**: [@saya.p4rhan](https://www.instagram.com/saya.p4rhan)
- **GitHub**: [Report issues](https://github.com/MasPakan/tes/issues)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀** - We Grow Because You Believe

*Honest From the Start, Always Safe*