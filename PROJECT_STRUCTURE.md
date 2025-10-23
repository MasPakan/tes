# Project Structure

This document describes the modular structure of the Discord Selfbot Automation project.

## Directory Structure

```
/workspace/
├── main.js                    # Main entry point
├── package.json               # Dependencies and scripts
├── ihannsy.json              # Configuration storage (auto-created)
├── README.md                 # Project documentation
├── CHANGELOG.md              # Change log
├── PROJECT_STRUCTURE.md      # This file
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
│   └── utils/               # Utility modules
│       ├── update.js       # Repository update system
│       └── rpc.js          # Rich Presence management
├── lib/                      # Library files (if needed)
├── docs/                     # Documentation files
├── examples/                 # Example configurations
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
  - Initialize Discord client
  - Setup event handlers
  - Manage bot lifecycle
  - Handle global error handlers
  - Coordinate between modules

### Feature Modules

#### `src/cli/cli.js`
- **Purpose**: Interactive command-line interface
- **Dependencies**: `inquirer`, `chalk`, `src/utils/update.js`
- **Functions**:
  - Welcome screen with ASCII art
  - Account management (create, configure, remove)
  - Configuration wizard
  - Update checking

#### `src/commands/commands.js`
- **Purpose**: Bot command handling and execution
- **Dependencies**: `src/webhook/webhook.js`
- **Functions**:
  - Command parsing and execution
  - Auto post management
  - Help system
  - Ping functionality

#### `src/webhook/webhook.js`
- **Purpose**: Webhook logging system
- **Dependencies**: `https` (Node.js built-in)
- **Functions**:
  - Autopost webhook logging
  - Activity webhook logging
  - Date/time formatting
  - Webhook request handling

#### `src/config/manager.js`
- **Purpose**: Configuration management
- **Dependencies**: `fs`, `path` (Node.js built-in)
- **Functions**:
  - Load/save configuration
  - Account management
  - Settings management
  - Default configuration

### Utility Modules

#### `src/utils/update.js`
- **Purpose**: Repository update system
- **Dependencies**: `https`, `fs`, `path`, `chalk`, `inquirer`
- **Functions**:
  - Check for repository updates
  - Download and apply updates
  - Update prompt handling
  - Backup creation

#### `src/utils/rpc.js`
- **Purpose**: Rich Presence management
- **Dependencies**: `discord.js-selfbot-v13`
- **Functions**:
  - Setup Rich Presence
  - Update RPC configuration
  - Enable/disable RPC

## Configuration Files

### `ihannsy.json`
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
    │   └── src/utils/update.js
    ├── src/commands/commands.js
    │   └── src/webhook/webhook.js
    ├── src/webhook/webhook.js
    ├── src/config/manager.js
    └── src/utils/rpc.js
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