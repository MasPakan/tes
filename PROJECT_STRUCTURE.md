# Project Structure

This document describes the modular structure of the Discord Selfbot Automation project with multi-language support and advanced error recovery.

## Directory Structure

```
/workspace/
├── main.js                    # Main entry point
├── package.json               # Dependencies and scripts
├── .gitignore                 # Git ignore rules
├── .gitattributes             # Git attributes
├── README.md                 # Project documentation
├── CHANGELOG.md              # Change log
├── PROJECT_STRUCTURE.md      # This file
├── config/                   # Configuration directory
│   └── ihannsy.json         # Configuration storage (auto-created)
├── src/                      # Source code directory
│   ├── bot.js               # Main bot class and orchestration
│   ├── cli/                 # CLI module
│   │   └── cli.js          # Interactive CLI system
│   ├── commands/            # Command handling module
│   │   └── commands.js     # Bot command implementations
│   ├── webhook/             # Webhook logging module
│   │   └── webhook.js      # Webhook logging system
│   ├── config/              # Configuration module
│   │   └── manager.js      # Configuration management
│   ├── utils/               # Utility modules
│   │   ├── language.js     # Language management system
│   │   ├── errorRecovery.js # Advanced error recovery system
│   │   ├── update.js       # Repository update system
│   │   └── rpc.js          # Rich Presence management
│   └── locales/             # Language files
│       ├── en.json         # English translations
│       └── id.json         # Indonesian translations
├── docs/                     # Documentation files
│   ├── INSTALLATION.md      # Installation guide
│   └── API.md              # API documentation
├── examples/                 # Example configurations
│   ├── config-example.json  # Configuration example
│   └── README.md           # Examples guide
└── backup/                   # Backup files (auto-created)
```

## Module Descriptions

### Core Modules

#### `main.js`
- **Purpose**: Main entry point for the application
- **Dependencies**: `src/bot.js`
- **Function**: Simple entry point that requires the main bot module

#### `src/bot.js`
- **Purpose**: Main bot orchestration and lifecycle management
- **Dependencies**: All other modules
- **Functions**:
  - Initialize Discord client with language support
  - Setup event handlers with error recovery
  - Manage bot lifecycle
  - Handle global error handlers
  - Coordinate between modules
  - Setup advanced error recovery system

### Feature Modules

#### `src/cli/cli.js`
- **Purpose**: Interactive command-line interface
- **Dependencies**: `inquirer`, `chalk`, `src/utils/update.js`, `src/utils/language.js`
- **Functions**:
  - Welcome screen with ASCII art
  - Account management (create, configure, remove)
  - Configuration wizard with language selection
  - Update checking
  - Language selection and switching
  - Localized CLI messages

#### `src/commands/commands.js`
- **Purpose**: Bot command handling and execution
- **Dependencies**: `src/webhook/webhook.js`, `src/utils/language.js`
- **Functions**:
  - Command parsing and execution
  - Auto post management
  - Help system with localized content
  - Ping functionality
  - Localized command responses

#### `src/webhook/webhook.js`
- **Purpose**: Webhook logging system
- **Dependencies**: `https` (Node.js built-in), `src/utils/language.js`
- **Functions**:
  - Autopost webhook logging with localized content
  - Activity webhook logging with localized content
  - Date/time formatting
  - Webhook request handling
  - Localized webhook messages

#### `src/config/manager.js`
- **Purpose**: Configuration management
- **Dependencies**: `fs`, `path` (Node.js built-in)
- **Functions**:
  - Load/save configuration
  - Account management
  - Settings management
  - Default configuration

### Utility Modules

#### `src/utils/language.js`
- **Purpose**: Language management system
- **Dependencies**: `fs`, `path` (Node.js built-in)
- **Functions**:
  - Load language files
  - Dynamic language switching
  - Parameter interpolation
  - Language validation
  - Fallback to English
  - Runtime language addition

#### `src/utils/errorRecovery.js`
- **Purpose**: Advanced error recovery system
- **Dependencies**: `events` (Node.js built-in)
- **Functions**:
  - Exponential backoff with jitter
  - Circuit breaker pattern
  - Discord-specific error strategies
  - Event-driven recovery
  - Graceful degradation
  - Recovery action system

#### `src/utils/update.js`
- **Purpose**: Repository update system
- **Dependencies**: `https`, `fs`, `path`, `chalk`, `inquirer`, `src/utils/language.js`
- **Functions**:
  - Check for repository updates
  - Download and apply updates
  - Localized update prompt handling
  - Backup creation

#### `src/utils/rpc.js`
- **Purpose**: Rich Presence management
- **Dependencies**: `discord.js-selfbot-v13`, `src/utils/language.js`
- **Functions**:
  - Setup Rich Presence with localized messages
  - Update RPC configuration
  - Enable/disable RPC

## Configuration Files

### `config/ihannsy.json`
- **Purpose**: Main configuration storage
- **Structure**:
  ```json
  {
    "accounts": {
      "username": {
        "token": "...",
        "webhookUrl": "...",
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

### Language Files

#### `src/locales/en.json`
- **Purpose**: English translations
- **Structure**: Nested JSON with translation keys
- **Usage**: Fallback language and default translations

#### `src/locales/id.json`
- **Purpose**: Indonesian translations
- **Structure**: Nested JSON with translation keys
- **Usage**: Indonesian language support

## Scripts

### Package.json Scripts
- `npm start` - Start the bot (runs `main.js`)
- `npm run dev` - Development mode (same as start)
- `npm run update` - Check for updates
- `npm run cli` - Run CLI only
- `npm run bot` - Run bot directly

## Benefits of Modular Structure

### 1. **Maintainability**
- Each module has a single responsibility
- Easy to locate and modify specific functionality
- Clear separation of concerns

### 2. **Scalability**
- Easy to add new features as separate modules
- Modules can be developed independently
- Clear interfaces between modules

### 3. **Testing**
- Each module can be tested independently
- Mock dependencies easily
- Isolated unit testing

### 4. **Reusability**
- Modules can be reused in other projects
- Clear API boundaries
- Easy to extract modules

### 5. **Debugging**
- Easier to isolate issues to specific modules
- Clear error boundaries
- Better error reporting

## Module Dependencies

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

## Adding New Modules

To add a new module:

1. Create a new directory in `src/` if needed
2. Create the module file with a descriptive name
3. Export the main class/function
4. Import and use in `src/bot.js`
5. Update this documentation

## File Naming Convention

- **Modules**: Use descriptive names (e.g., `webhook.js`, `commands.js`)
- **Classes**: Use PascalCase (e.g., `DiscordSelfbot`, `WebhookLogger`)
- **Functions**: Use camelCase (e.g., `sendWebhookLog`, `executeCommand`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `DEFAULT_PREFIX`)

## Error Handling

Each module should handle its own errors and:
- Log errors appropriately
- Send webhook logs if configured
- Not crash the entire application
- Provide meaningful error messages

## Future Improvements

- Add TypeScript support
- Implement proper logging system
- Add unit tests for each module
- Create plugin system
- Add configuration validation
- Implement hot reloading for development