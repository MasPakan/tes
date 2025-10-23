# 🏗️ Project Structure

Simple overview of the Discord Selfbot Automation project structure.

## 📁 Directory Tree

```
tes/
├── main.js                    # 🚀 Entry point
├── package.json               # 📦 Dependencies
├── .gitignore                 # 🚫 Git ignore
├── .gitattributes             # 📝 Git attributes
├── README.md                  # 📖 Main docs
├── CHANGELOG.md               # 📝 Version history
├── config/
│   └── ihannsy.json          # ⚙️ Auto-created config
└── src/                      # 📂 Source code
    ├── bot.js                # 🤖 Main bot logic
    ├── cli/
    │   └── cli.js            # 💻 Interactive CLI
    ├── commands/
    │   └── commands.js       # ⚡ Bot commands
    ├── webhook/
    │   └── webhook.js        # 📊 Webhook logging
    ├── config/
    │   └── manager.js        # ⚙️ Config management
    ├── utils/
    │   ├── language.js       # 🌍 Language system
    │   ├── errorRecovery.js  # 🛡️ Error recovery
    │   ├── update.js         # 🔄 Update system
    │   └── rpc.js            # 🎮 Rich Presence
    └── locales/
        ├── en.json           # 🇺🇸 English
        └── id.json           # 🇮🇩 Indonesian
```

## 🎯 Module Overview

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **main.js** | Entry point | Simple startup |
| **bot.js** | Main logic | Client management, orchestration |
| **cli.js** | User interface | Interactive menus, account management |
| **commands.js** | Bot commands | Auto posting, immediate execution, help system |
| **webhook.js** | Logging | Activity logs, uptime formatting, error tracking |
| **language.js** | Translations | Multi-language support |
| **errorRecovery.js** | Error handling | Circuit breaker, retry logic |
| **manager.js** | Configuration | Settings, account management |
| **update.js** | Updates | Auto-update system |
| **rpc.js** | Rich Presence | Custom activity status |

## 🔗 Module Dependencies

```
main.js
└── src/bot.js
    ├── src/cli/cli.js
    │   ├── src/utils/update.js
    │   └── src/utils/language.js
    ├── src/commands/commands.js
    │   ├── src/webhook/webhook.js
    │   └── src/utils/language.js
    ├── src/webhook/webhook.js
    │   └── src/utils/language.js
    ├── src/config/manager.js
    ├── src/utils/language.js
    ├── src/utils/errorRecovery.js
    ├── src/utils/rpc.js
    │   └── src/utils/language.js
    └── src/utils/update.js
        └── src/utils/language.js
```

## 📋 Configuration Files

### `config/ihannsy.json`
```json
{
  "accounts": {
    "username": {
      "token": "discord_token",
      "webhookUrl": "webhook_url",
      "prefix": "!",
      "enableRPC": true,
      "language": "en",
      "username": "username"
    }
  },
  "settings": {
    "language": "en"
  }
}
```

### Language Files
- **`src/locales/en.json`** - English translations
- **`src/locales/id.json`** - Indonesian translations

## 🚀 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Start** | `npm start` | Run the bot |
| **Update** | `npm run update` | Check for updates |

## ✨ Key Features

### 🌍 Multi-Language Support
- **Dynamic switching** - Change language without restart
- **Parameter interpolation** - `{username}`, `{error}`, etc.
- **Fallback system** - Auto-fallback to English
- **Validation** - Check language completeness

### 🛡️ Error Recovery
- **Exponential backoff** - 1s, 2s, 4s, 8s, 16s, 30s max
- **Circuit breaker** - Prevents spam retries
- **Discord strategies** - Network, rate limit, auth, permission
- **Event system** - Error, retry, recovery events

### 🎮 Bot Features
- **Auto posting** - Multi-channel with custom delay
- **Rich Presence** - Custom RPC with your style
- **Webhook logging** - Detailed activity logs
- **Multi-account** - Manage multiple Discord accounts
- **Interactive CLI** - User-friendly setup

## 🔧 Adding New Modules

1. **Create directory** in `src/` if needed
2. **Create module file** with descriptive name
3. **Export main class/function**
4. **Import in bot.js**
5. **Update documentation**

## 📝 File Naming

- **Modules**: `descriptiveName.js` (e.g., `webhook.js`)
- **Classes**: `PascalCase` (e.g., `DiscordSelfbot`)
- **Functions**: `camelCase` (e.g., `sendWebhookLog`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PREFIX`)

## 🎯 Benefits

| Benefit | Description |
|---------|-------------|
| **Maintainability** | Single responsibility per module |
| **Scalability** | Easy to add new features |
| **Testing** | Independent module testing |
| **Reusability** | Clear API boundaries |
| **Debugging** | Easy to isolate issues |

## 🔮 Future Improvements

- [ ] **TypeScript support** - Type safety
- [ ] **Plugin system** - Extensible architecture
- [ ] **Web dashboard** - Browser-based management
- [ ] **Database support** - Persistent storage
- [ ] **API endpoints** - REST API integration
- [ ] **Unit tests** - Comprehensive testing

---

**Need to modify something?** Check the module you want to change and follow the dependencies! 🚀