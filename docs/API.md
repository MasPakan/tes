# API Documentation

This document describes the API and module structure of the Discord Selfbot Automation project with multi-language support and advanced error recovery.

## Module API

### Bot Module (`src/bot.js`)

Main bot orchestration class.

#### `DiscordSelfbot`

```javascript
const DiscordSelfbot = require('./src/bot');
const bot = new DiscordSelfbot();
```

**Methods:**
- `start()` - Start the bot with CLI
- `initializeClient(config)` - Initialize Discord client with language support
- `setupEventHandlers()` - Setup event listeners with error recovery
- `setupErrorRecovery()` - Setup advanced error recovery system
- `shutdown(signal)` - Graceful shutdown
- `t(key, params)` - Translation helper method

### CLI Module (`src/cli/cli.js`)

Interactive command-line interface.

#### `DiscordSelfbotCLI`

```javascript
const DiscordSelfbotCLI = require('./src/cli/cli');
const cli = new DiscordSelfbotCLI();
```

**Methods:**
- `start()` - Start the CLI
- `showMainMenu()` - Show main menu with language support
- `showAccountMenu(username, account)` - Show account menu
- `showNewAccountFlow(existingUsername)` - New account wizard with language selection
- `loadLanguageSettings()` - Load language from configuration
- `updateLanguageSetting(language)` - Update language setting
- `t(key, params)` - Translation helper method

### Commands Module (`src/commands/commands.js`)

Bot command handling system.

#### `CommandHandler`

```javascript
const CommandHandler = require('./src/commands/commands');
const handler = new CommandHandler(client, config, webhookLogger, autoPosts, languageManager);
```

**Methods:**
- `executeCommand(message)` - Execute bot commands with localized responses
- `startAutoPost(index, message, delay, channelId, attachments)` - Start auto posting
- `stopAutoPost(index)` - Stop auto posting
- `getAutoPostList()` - Get active auto posts with localized output
- `getPingInfo()` - Get ping information with localized output
- `getHelpInfo()` - Get help information with localized output
- `t(key, params)` - Translation helper method

### Webhook Module (`src/webhook/webhook.js`)

Webhook logging system.

#### `WebhookLogger`

```javascript
const WebhookLogger = require('./src/webhook/webhook');
const logger = new WebhookLogger(config);
```

**Methods:**
- `sendAutopostLog(action, channel, message, error, delay, uptime, postCount)` - Send localized autopost log
- `sendActivityLog(activity, error)` - Send localized activity log
- `sendWebhookRequest(webhookData)` - Send webhook request
- `updateConfig(newConfig)` - Update logger config
- `t(key, params)` - Translation helper method

### Config Module (`src/config/manager.js`)

Configuration management system.

#### `ConfigManager`

```javascript
const ConfigManager = require('./src/config/manager');
const config = new ConfigManager();
```

**Methods:**
- `loadConfig()` - Load configuration
- `saveConfig()` - Save configuration
- `getAccounts()` - Get all accounts
- `saveAccount(username, accountData)` - Save account
- `removeAccount(username)` - Remove account
- `getSettings()` - Get settings

### Language Module (`src/utils/language.js`)

Language management system with multi-language support.

#### `LanguageManager`

```javascript
const LanguageManager = require('./src/utils/language');
const lang = new LanguageManager();
```

**Methods:**
- `setLanguage(language)` - Set current language
- `getLanguage()` - Get current language
- `getAvailableLanguages()` - Get available languages
- `t(key, params)` - Translate key with parameters
- `replaceParams(text, params)` - Replace parameters in text
- `addLanguage(language, translations)` - Add new language at runtime
- `getAllTranslations(key)` - Get all translations for a key
- `validateLanguage(language)` - Validate language completeness

### Error Recovery Module (`src/utils/errorRecovery.js`)

Advanced error recovery system with exponential backoff and circuit breaker.

#### `ErrorRecoveryManager`

```javascript
const ErrorRecoveryManager = require('./src/utils/errorRecovery');
const recovery = new ErrorRecoveryManager(options);
```

**Methods:**
- `handleError(error, context)` - Handle error with recovery
- `registerStrategy(errorType, strategy)` - Register recovery strategy
- `isCircuitOpen()` - Check if circuit breaker is open
- `recordFailure()` - Record failure for circuit breaker
- `resetCircuitBreaker()` - Reset circuit breaker
- `reset()` - Reset recovery state
- `getStatus()` - Get recovery status
- `setupDiscordStrategies()` - Setup Discord-specific strategies

**Events:**
- `error` - Error occurred
- `retry` - Retry attempt
- `recoverySuccess` - Recovery successful
- `recoveryFailed` - Recovery failed
- `circuitBreakerOpen` - Circuit breaker opened

### Utils Module (`src/utils/`)

Utility modules for various functions.

#### Update Manager (`src/utils/update.js`)

```javascript
const RepositoryUpdateManager = require('./src/utils/update');
const updater = new RepositoryUpdateManager();
```

**Methods:**
- `checkForUpdates()` - Check for updates
- `performUpdate()` - Perform update
- `showUpdatePrompt()` - Show localized update prompt
- `t(key, params)` - Translation helper method

#### RPC Manager (`src/utils/rpc.js`)

```javascript
const RPCManager = require('./src/utils/rpc');
const rpc = new RPCManager(client, config, languageManager);
```

**Methods:**
- `setupRichPresence()` - Setup Rich Presence with localized messages
- `updateRPCConfig(newConfig)` - Update RPC config
- `t(key, params)` - Translation helper method

## Command API

### Bot Commands

All commands start with the configured prefix (default: "!").

#### `!post <index> <message> <delay> <channel_id>`
Start auto posting to a channel.

**Parameters:**
- `index` - Unique identifier for this auto post
- `message` - Message content (can include attachments)
- `delay` - Delay between posts in minutes
- `channel_id` - Target channel ID

**Example:**
```
!post 1 Hello World! 5 123456789012345678
```

#### `!index`
List all active auto posts.

**Output:**
```
# AUTO POST LIST
> - **1:** [Ch: <#123456789012345678> - D: 5 A: 0]
```

#### `!stop [index]`
Stop auto posting.

**Parameters:**
- `index` - (Optional) Specific auto post to stop
- If no index provided, stops all auto posts

#### `!ping`
Get bot and API latency.

**Output:**
```
# 🏓 PONG!
> - Bot Latency: 45ms
> - API Latency: 120ms
```

#### `!help`
Show help information.

**Output:**
```
# SELFBOT BY iHANNSY
## 🔍FEATURES:
> - Auto Send Post
> - Independent WebHook Log For Auto Posting And System
> - RPC or Activity Profile
> - Prefix Command Selfbot (Only Selfbot Can Access)

## 🔍Command List
!post <index> <message w/wo attachment> <delay(minute)> <channels id>
!index                - To see auto post running list
!stop                  - To stop all auto post processes
!stop <index> - To stop the autopost process according to the index
!ping                  - To see the latency of the selfbot and API
```

## Event API

### Discord Events

The bot listens to the following Discord events:

- `messageCreate` - Handle incoming messages
- `ready` - Bot ready event
- `error` - Client errors
- `warn` - Client warnings
- `disconnect` - Bot disconnected
- `reconnecting` - Bot reconnecting
- `resume` - Bot reconnected

### Process Events

- `unhandledRejection` - Unhandled promise rejections
- `uncaughtException` - Uncaught exceptions
- `warning` - Process warnings
- `SIGINT` - Graceful shutdown (Ctrl+C)
- `SIGTERM` - Graceful shutdown

## Language API

### Language Support

The bot supports multiple languages with dynamic switching:

- 🇺🇸 **English** (default)
- 🇮🇩 **Indonesian** (Bahasa Indonesia)

### Language Files

Language files are located in `src/locales/`:
- `en.json` - English translations
- `id.json` - Indonesian translations

### Translation Keys

All user-facing content uses translation keys:

```javascript
// Example usage
this.t('cli.welcome.title') // "Discord Selfbot Automation"
this.t('commands.autopost.started', { index: 1, channel_id: '123456789' })
```

### Parameter Interpolation

Translation keys support parameter interpolation:

```javascript
// Translation file
{
  "welcome": {
    "message": "Welcome {username}! You have {count} messages."
  }
}

// Usage
this.t('welcome.message', { username: 'John', count: 5 })
// Result: "Welcome John! You have 5 messages."
```

## Error Recovery API

### Error Types

The error recovery system handles different error types:

- **NETWORK** - Connection errors (ECONNRESET, ENOTFOUND, ETIMEDOUT)
- **RATELIMIT** - Discord rate limiting
- **AUTH** - Authentication errors
- **PERMISSION** - Permission errors
- **NOT_FOUND** - 404 errors
- **CONNECTION_REFUSED** - Connection refused errors
- **UNKNOWN** - Generic errors

### Recovery Strategies

Each error type has a specific recovery strategy:

```javascript
// Network errors
{
  name: 'network_recovery',
  maxRetries: 3,
  backoff: true,
  actions: ['wait', 'retry', 'reconnect']
}

// Rate limit errors
{
  name: 'ratelimit_recovery',
  maxRetries: 2,
  backoff: true,
  actions: ['wait', 'retry']
}
```

### Circuit Breaker

The circuit breaker prevents spam retries:

- **CLOSED** - Normal operation
- **OPEN** - Circuit open, no retries
- **HALF_OPEN** - Testing if service is back

## Configuration API

### Configuration Structure

```javascript
{
  "accounts": {
    "username": {
      "token": "discord_user_token",
      "webhookUrl": "discord_webhook_url",
      "prefix": "!",
      "enableRPC": true,
      "username": "username",
      "language": "en",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastUsed": "2024-01-01T00:00:00.000Z"
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

### Configuration Methods

- `loadConfig()` - Load from file
- `saveConfig()` - Save to file
- `getAccount(username)` - Get specific account
- `saveAccount(username, data)` - Save account
- `removeAccount(username)` - Remove account

## Error Handling

All modules include comprehensive error handling with advanced recovery:

### Error Recovery Features

- **Exponential Backoff** - 1s, 2s, 4s, 8s, 16s, 30s max with jitter
- **Circuit Breaker** - Prevents spam retries on repeated failures
- **Discord-Specific Strategies** - Tailored error handling for Discord API
- **Event-Driven Recovery** - Comprehensive event logging and monitoring
- **Graceful Degradation** - Fallback when recovery fails
- **Jitter Implementation** - Prevents thundering herd problem

### Error Recovery Flow

1. **Error Detection** - Identify error type and context
2. **Strategy Selection** - Choose appropriate recovery strategy
3. **Circuit Check** - Check if circuit breaker allows retry
4. **Backoff Calculation** - Calculate delay with exponential backoff
5. **Recovery Actions** - Execute recovery actions (wait, retry, reconnect)
6. **Success/Failure** - Update circuit breaker based on result

### Error Events

```javascript
recovery.on('error', ({ error, context, retryCount }) => {
  console.log(`Error occurred: ${error.message}`);
});

recovery.on('retry', ({ error, retryCount, delay, strategy }) => {
  console.log(`Retrying in ${delay}ms using ${strategy}`);
});

recovery.on('recoverySuccess', ({ retryCount }) => {
  console.log(`Recovery successful after ${retryCount} attempts`);
});
```

### Traditional Error Handling

- Try-catch blocks for async operations
- Graceful degradation on errors
- Webhook logging for errors
- Automatic retry with exponential backoff
- Graceful shutdown on critical errors

## Security Considerations

- Never expose Discord tokens
- Use webhooks only on trusted servers
- Validate all user inputs
- Handle errors gracefully
- Log security events