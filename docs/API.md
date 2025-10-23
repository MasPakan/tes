# 📚 API Documentation

Quick reference for Discord Selfbot Automation modules and commands.

## 🏗️ Module Overview

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **Bot** | Main orchestration | Client management, error recovery |
| **CLI** | Interactive interface | Account management, language selection |
| **Commands** | Bot command handling | Auto posting, help system |
| **Webhook** | Logging system | Activity logs, error tracking |
| **Language** | Multi-language support | Translation, parameter interpolation |
| **Error Recovery** | Advanced error handling | Circuit breaker, exponential backoff |

## 🤖 Bot Commands

### Auto Posting
```bash
!post <index> <message> <delay_minutes> <channel_id>
```
**Example**: `!post 1 "Hello World!" 5 123456789012345678`

### Management
```bash
!index          # List active posts
!stop <index>   # Stop specific post
!stop           # Stop all posts
!ping           # Check latency
!help           # Show help
```

## 🏛️ Core Modules

### Bot Module (`src/bot.js`)
```javascript
const DiscordSelfbot = require('./src/bot');
const bot = new DiscordSelfbot();

// Methods
bot.start()                    // Start with CLI
bot.initializeClient(config)   // Setup Discord client
bot.setupErrorRecovery()       // Setup error recovery
bot.shutdown(signal)           // Graceful shutdown
```

### CLI Module (`src/cli/cli.js`)
```javascript
const DiscordSelfbotCLI = require('./src/cli/cli');
const cli = new DiscordSelfbotCLI();

// Methods
cli.start()                    // Start CLI
cli.showMainMenu()             // Show main menu
cli.showNewAccountFlow()       // New account wizard
cli.t(key, params)             // Translation helper
```

### Commands Module (`src/commands/commands.js`)
```javascript
const CommandHandler = require('./src/commands/commands');
const handler = new CommandHandler(client, config, webhookLogger, autoPosts, languageManager);

// Methods
handler.executeCommand(message)     // Execute commands
handler.startAutoPost(...)          // Start auto posting
handler.stopAutoPost(index)         // Stop auto posting
handler.t(key, params)              // Translation helper
```

## 🌍 Language System

### Language Manager (`src/utils/language.js`)
```javascript
const LanguageManager = require('./src/utils/language');
const lang = new LanguageManager();

// Methods
lang.setLanguage('en')              // Set language
lang.t('cli.welcome.title')         // Translate key
lang.t('welcome.message', {name: 'John'})  // With parameters
lang.getAvailableLanguages()        // Get supported languages
```

### Translation Keys
```javascript
// CLI messages
'cli.welcome.title'                 // "Discord Selfbot Automation"
'cli.menu.main.new_account'         // "➕ New Account"

// Bot commands
'commands.autopost.started'         // "AUTOPOST STARTED"
'commands.ping.title'               // "🏓 PONG!"

// Webhook logs
'webhook.autopost.title'            // "**AUTOPOST** - **PAKAN STORE**"
'webhook.activity.title'            // "**ACTIVITY** - **PAKAN STORE**"
```

## 🛡️ Error Recovery

### Error Recovery Manager (`src/utils/errorRecovery.js`)
```javascript
const ErrorRecoveryManager = require('./src/utils/errorRecovery');
const recovery = new ErrorRecoveryManager();

// Methods
recovery.handleError(error, context)    // Handle error
recovery.registerStrategy(type, strategy) // Register strategy
recovery.isCircuitOpen()                // Check circuit breaker
recovery.reset()                        // Reset state

// Events
recovery.on('error', (data) => {})      // Error occurred
recovery.on('retry', (data) => {})      // Retry attempt
recovery.on('recoverySuccess', (data) => {}) // Recovery successful
```

### Error Types
| Type | Description | Strategy |
|------|-------------|----------|
| **NETWORK** | Connection errors | Wait, retry, reconnect |
| **RATELIMIT** | Rate limiting | Wait, retry |
| **AUTH** | Authentication | Refresh token, reconnect |
| **PERMISSION** | Permission denied | No retry |
| **CONNECTION_REFUSED** | Connection refused | Reset connection |

## 📊 Webhook System

### Webhook Logger (`src/webhook/webhook.js`)
```javascript
const WebhookLogger = require('./src/webhook/webhook');
const logger = new WebhookLogger(config);

// Methods
logger.sendAutopostLog(action, channel, message, error, delay, uptime, postCount)
logger.sendActivityLog(activity, error)
logger.t(key, params)  // Translation helper
```

### Webhook Types
- **Autopost Logs** - Detailed auto posting information
- **Activity Logs** - General bot activities
- **Error Logs** - Error tracking and monitoring

## ⚙️ Configuration

### Configuration Structure
```json
{
  "accounts": {
    "username": {
      "token": "discord_user_token",
      "webhookUrl": "webhook_url",
      "prefix": "!",
      "enableRPC": true,
      "language": "en",
      "username": "username"
    }
  },
  "settings": {
    "defaultPrefix": "!",
    "defaultRPC": true,
    "defaultWebhook": false,
    "language": "en"
  }
}
```

### Config Manager (`src/config/manager.js`)
```javascript
const ConfigManager = require('./src/config/manager');
const config = new ConfigManager();

// Methods
config.loadConfig()              // Load from file
config.saveConfig()              // Save to file
config.getAccount(username)      // Get account
config.saveAccount(username, data) // Save account
config.removeAccount(username)   // Remove account
```

## 🔧 Utility Modules

### Update Manager (`src/utils/update.js`)
```javascript
const RepositoryUpdateManager = require('./src/utils/update');
const updater = new RepositoryUpdateManager();

// Methods
updater.checkForUpdates()        // Check for updates
updater.performUpdate()          // Perform update
updater.t(key, params)           // Translation helper
```

### RPC Manager (`src/utils/rpc.js`)
```javascript
const RPCManager = require('./src/utils/rpc');
const rpc = new RPCManager(client, config, languageManager);

// Methods
rpc.setupRichPresence()          // Setup RPC
rpc.updateRPCConfig(config)      // Update config
rpc.t(key, params)               // Translation helper
```

## 🎯 Event System

### Discord Events
- `messageCreate` - Handle messages
- `ready` - Bot ready
- `error` - Client errors
- `disconnect` - Bot disconnected
- `reconnecting` - Bot reconnecting

### Process Events
- `unhandledRejection` - Unhandled promise rejections
- `uncaughtException` - Uncaught exceptions
- `SIGINT` - Graceful shutdown (Ctrl+C)
- `SIGTERM` - Graceful shutdown

### Error Recovery Events
- `error` - Error occurred
- `retry` - Retry attempt
- `recoverySuccess` - Recovery successful
- `recoveryFailed` - Recovery failed
- `circuitBreakerOpen` - Circuit breaker opened

## 🔒 Security

- **Token Protection** - Secure token storage
- **Input Validation** - Validate all inputs
- **Error Sanitization** - Safe error messages
- **Webhook Security** - Secure webhook requests

## 📝 Examples

### Basic Usage
```javascript
const DiscordSelfbot = require('./src/bot');
const bot = new DiscordSelfbot();

// Start bot
bot.start();
```

### Custom Language
```javascript
const LanguageManager = require('./src/utils/language');
const lang = new LanguageManager();

// Set language
lang.setLanguage('id');

// Translate with parameters
const message = lang.t('welcome.message', {username: 'John'});
```

### Error Recovery
```javascript
const ErrorRecoveryManager = require('./src/utils/errorRecovery');
const recovery = new ErrorRecoveryManager();

// Handle error
recovery.handleError(error, {context: 'login'});

// Listen for events
recovery.on('recoverySuccess', (data) => {
  console.log('Recovery successful!');
});
```

---

**Need more details?** Check the source code or open an issue! 🚀