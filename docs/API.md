# API Documentation

This document describes the API and module structure of the Discord Selfbot Automation project.

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
- `initializeClient(config)` - Initialize Discord client
- `setupEventHandlers()` - Setup event listeners
- `shutdown(signal)` - Graceful shutdown

### CLI Module (`src/cli/cli.js`)

Interactive command-line interface.

#### `DiscordSelfbotCLI`

```javascript
const DiscordSelfbotCLI = require('./src/cli/cli');
const cli = new DiscordSelfbotCLI();
```

**Methods:**
- `start()` - Start the CLI
- `showMainMenu()` - Show main menu
- `showAccountMenu(username, account)` - Show account menu
- `showNewAccountFlow(existingUsername)` - New account wizard

### Commands Module (`src/commands/commands.js`)

Bot command handling system.

#### `CommandHandler`

```javascript
const CommandHandler = require('./src/commands/commands');
const handler = new CommandHandler(client, config, webhookLogger, autoPosts);
```

**Methods:**
- `executeCommand(message)` - Execute bot commands
- `startAutoPost(index, message, delay, channelId, attachments)` - Start auto posting
- `stopAutoPost(index)` - Stop auto posting
- `getAutoPostList()` - Get active auto posts
- `getPingInfo()` - Get ping information
- `getHelpInfo()` - Get help information

### Webhook Module (`src/webhook/webhook.js`)

Webhook logging system.

#### `WebhookLogger`

```javascript
const WebhookLogger = require('./src/webhook/webhook');
const logger = new WebhookLogger(config);
```

**Methods:**
- `sendAutopostLog(action, channel, message, error, delay, uptime, postCount)` - Send autopost log
- `sendActivityLog(activity, error)` - Send activity log
- `sendWebhookRequest(webhookData)` - Send webhook request
- `updateConfig(newConfig)` - Update logger config

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
- `showUpdatePrompt()` - Show update prompt

#### RPC Manager (`src/utils/rpc.js`)

```javascript
const RPCManager = require('./src/utils/rpc');
const rpc = new RPCManager(client, config);
```

**Methods:**
- `setupRichPresence()` - Setup Rich Presence
- `updateRPCConfig(newConfig)` - Update RPC config

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
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastUsed": "2024-01-01T00:00:00.000Z"
    }
  },
  "settings": {
    "defaultPrefix": "!",
    "defaultRPC": true,
    "defaultWebhook": false
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

All modules include comprehensive error handling:

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