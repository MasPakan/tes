# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-15

### Added
- [x] **Multi-Language Support** - Complete English and Indonesian language support
- [x] **Language Manager** - Dynamic language switching and parameter interpolation
- [x] **Advanced Error Recovery** - Exponential backoff with circuit breaker pattern
- [x] **Discord-Specific Error Strategies** - Network, rate limit, auth, and permission error handling
- [x] **Event-Driven Recovery** - Recovery system with comprehensive event logging
- [x] **Language Files** - Complete translation files for all user-facing content
- [x] **Runtime Language Switching** - Change language without restarting
- [x] **Jitter Implementation** - Prevents thundering herd problem in retry logic
- [x] **Recovery Action System** - Wait, retry, reconnect, refresh token, clear cache actions
- [x] **Circuit Breaker Pattern** - Prevents spam retries on repeated failures
- [x] **Localized CLI** - All CLI messages in selected language
- [x] **Localized Commands** - All bot command responses in selected language
- [x] **Localized Webhooks** - Webhook content in selected language
- [x] **Language Validation** - Validate language completeness and missing keys
- [x] **Modular Architecture** - Complete restructuring into organized modules
- [x] **Configuration Manager** - Centralized configuration management
- [x] **Error Recovery Manager** - Centralized error handling and recovery
- [x] **Language Manager** - Centralized language management
- [x] **Project Structure Documentation** - Comprehensive project structure guide
- [x] **Installation Guide** - Detailed installation and setup documentation
- [x] **API Documentation** - Complete API reference documentation
- [x] **Example Configurations** - Example configuration files and guides

### Changed
- [x] **CLI Language Selection** - Added language selection during account setup
- [x] **Error Handling** - Upgraded to advanced error recovery system
- [x] **Configuration Storage** - Added language preference to settings
- [x] **Module Structure** - Reorganized into `src/` directory with proper modules
- [x] **File Naming** - Renamed all `index.js` files to descriptive names
- [x] **Dependencies** - Updated to latest versions and removed unused packages
- [x] **Error Messages** - All error messages now support localization
- [x] **Command Outputs** - All command outputs now support localization
- [x] **Webhook Content** - Webhook content now supports localization
- [x] **CLI Interface** - Enhanced with language selection and localized messages
- [x] **Bot Initialization** - Enhanced with language loading and error recovery
- [x] **Update System** - Enhanced with localized update messages

### Fixed
- [x] **Module Import Errors** - Fixed all module import and export issues
- [x] **Language Loading** - Fixed language file loading and parsing
- [x] **Error Recovery** - Fixed error recovery initialization and event handling
- [x] **Configuration Paths** - Fixed all configuration file paths after restructuring
- [x] **CLI Language Integration** - Fixed language integration in CLI system
- [x] **Command Language Support** - Fixed language support in command handler
- [x] **Webhook Language Support** - Fixed language support in webhook logger
- [x] **RPC Language Support** - Fixed language support in RPC manager
- [x] **Update Language Support** - Fixed language support in update system
- [x] **Error Recovery Integration** - Fixed error recovery integration in all modules

### Technical Details

#### Multi-Language Support
- [x] **Language Files**: `src/locales/en.json` and `src/locales/id.json`
- [x] **Language Manager**: `src/utils/language.js` with parameter interpolation
- [x] **Dynamic Switching**: Runtime language switching without restart
- [x] **Fallback System**: Automatic fallback to English if key not found
- [x] **Parameter Interpolation**: Support for `{username}`, `{error}`, etc.
- [x] **Nested Keys**: Support for nested translation keys
- [x] **Validation**: Language completeness validation
- [x] **Runtime Addition**: Add new languages at runtime

#### Advanced Error Recovery
- [x] **Error Recovery Manager**: `src/utils/errorRecovery.js`
- [x] **Exponential Backoff**: 1s, 2s, 4s, 8s, 16s, 30s max with jitter
- [x] **Circuit Breaker**: CLOSED, OPEN, HALF_OPEN states
- [x] **Error Strategies**: Network, rate limit, auth, permission, connection refused
- [x] **Recovery Actions**: Wait, retry, reconnect, refresh token, clear cache, reset connection
- [x] **Event System**: Error, retry, recovery success/failure, circuit breaker events
- [x] **Discord Integration**: Discord-specific error handling strategies
- [x] **Graceful Degradation**: Fallback when recovery fails

#### Modular Architecture
- [x] **Main Entry**: `main.js` - Simple entry point
- [x] **Bot Logic**: `src/bot.js` - Main bot orchestration
- [x] **CLI System**: `src/cli/cli.js` - Interactive CLI
- [x] **Command Handler**: `src/commands/commands.js` - Command processing
- [x] **Webhook Logger**: `src/webhook/webhook.js` - Webhook logging
- [x] **Language Manager**: `src/utils/language.js` - Language management
- [x] **Error Recovery**: `src/utils/errorRecovery.js` - Error handling
- [x] **RPC Manager**: `src/utils/rpc.js` - Rich Presence
- [x] **Update System**: `src/utils/update.js` - Update management
- [x] **Config Manager**: `src/config/manager.js` - Configuration management

#### Language Support Details
- [x] **CLI Messages**: All CLI prompts and messages localized
- [x] **Command Responses**: All bot command responses localized
- [x] **Error Messages**: All error messages localized
- [x] **Webhook Content**: All webhook content localized
- [x] **RPC Messages**: All RPC setup messages localized
- [x] **Update Messages**: All update system messages localized
- [x] **Help Content**: All help content localized
- [x] **Status Messages**: All status messages localized

#### Error Recovery Details
- [x] **Network Errors**: ECONNRESET, ENOTFOUND, ETIMEDOUT handling
- [x] **Rate Limiting**: RATELIMIT error handling with backoff
- [x] **Authentication**: Token refresh and reconnection
- [x] **Permissions**: Permission error handling without retry
- [x] **Connection Refused**: Connection retry with reset
- [x] **Unknown Errors**: Generic error handling with fallback
- [x] **Circuit Breaker**: 5 failure threshold, 60s timeout
- [x] **Jitter**: 10% random jitter to prevent thundering herd

#### Configuration Updates
- [x] **Language Setting**: Added `language` field to settings
- [x] **Account Language**: Added `language` field to account configs
- [x] **Default Language**: English as default language
- [x] **Language Persistence**: Language preference saved to config
- [x] **Language Loading**: Language loaded from config on startup

#### Documentation Updates
- [x] **README.md**: Updated with multi-language and error recovery features
- [x] **PROJECT_STRUCTURE.md**: Complete project structure documentation
- [x] **INSTALLATION.md**: Detailed installation guide with language setup
- [x] **API.md**: Complete API documentation for all modules
- [x] **CHANGELOG.md**: This comprehensive changelog
- [x] **Examples**: Configuration examples and usage guides

### Dependencies
- [x] **discord.js-selfbot-v13**: `^3.7.1` - Updated to latest version
- [x] **inquirer**: `^9.2.12` - CLI interactive prompts
- [x] **chalk**: `^4.1.2` - Terminal colors and styling
- [x] **Node.js Built-in**: `https`, `fs`, `path`, `child_process`, `events`

### File Structure
- [x] **main.js**: Entry point
- [x] **src/bot.js**: Main bot logic
- [x] **src/cli/cli.js**: Interactive CLI
- [x] **src/commands/commands.js**: Command handler
- [x] **src/webhook/webhook.js**: Webhook logger
- [x] **src/utils/language.js**: Language manager
- [x] **src/utils/errorRecovery.js**: Error recovery system
- [x] **src/utils/rpc.js**: Rich Presence manager
- [x] **src/utils/update.js**: Update system
- [x] **src/config/manager.js**: Configuration manager
- [x] **src/locales/en.json**: English translations
- [x] **src/locales/id.json**: Indonesian translations
- [x] **config/ihannsy.json**: Configuration storage
- [x] **docs/**: Documentation directory
- [x] **examples/**: Example files directory

---

## [1.0.0] - 2024-01-01

### Added
- [x] **Discord Selfbot Automation Script** - Complete selfbot implementation using `discord.js-selfbot-v13`
- [x] **Auto Posting System** - Multi-channel posting with custom delay support
- [x] **Management Commands** - Complete command set for bot management
- [x] **Rich Presence (RPC)** - Custom activity status with specific format
- [x] **Webhook Logger** - Comprehensive logging system with specific JSON format
- [x] **Interactive CLI** - User-friendly command-line interface
- [x] **Multi-Account Management** - Support for multiple Discord accounts
- [x] **Configuration Storage** - JSON-based configuration system
- [x] **Auto Update System** - Repository-based update checking
- [x] **Error Handling** - Comprehensive error protection and logging
- [x] **File Attachment Support** - Easy attachment handling for auto posts
- [x] **ASCII Art Logo** - Beautiful CLI header with pixel art
- [x] **Modular Architecture** - Organized code structure with separate modules

### Changed
- [x] **CLI Interface** - Simplified menu system based on account availability
- [x] **Username Detection** - Automatic Discord API username fetching
- [x] **Webhook System** - Separated autopost and activity logging
- [x] **Date Formatting** - Updated to specific format: `Thursday, 23 October 2025 | 06.11.23`
- [x] **Command Outputs** - Updated all command responses to new format
- [x] **README Structure** - Cleaned up and reorganized documentation
- [x] **Configuration Management** - Moved from `.env` to `ihannsy.json`
- [x] **Update System** - Changed from GitHub releases to repository commits
- [x] **Message Handling** - Changed from `message.edit` to `message.reply`

### Fixed
- [x] **postCount Undefined Error** - Added proper postCount variable initialization
- [x] **Inquirer Import Error** - Fixed `inquirer.prompt is not a function` error
- [x] **Update Check Error** - Fixed `Cannot read properties of undefined` error
- [x] **Debug Module Error** - Added missing `debug` dependency
- [x] **Webhook Error Handling** - Added try-catch protection for webhook requests
- [x] **Account Loading** - Fixed CLI loading settings as accounts
- [x] **Token Validation** - Improved Discord API token validation
- [x] **Memory Leaks** - Fixed interval clearing and cleanup on shutdown

### Technical Details

#### Auto Posting System
- [x] **Command Format**: `!post <index> <message> <delay_minutes> <channel_id>`
- [x] **Multi-Channel Support**: Post to multiple channels simultaneously
- [x] **Custom Delay**: Per-channel delay configuration in minutes
- [x] **Attachment Support**: Direct file attachment to command messages
- [x] **Error Handling**: Robust error handling with automatic cleanup

#### Management Commands
- [x] **!index**: List all active auto posts with details
- [x] **!stop <index>**: Stop specific auto post by index
- [x] **!stop**: Stop all auto posts
- [x] **!ping**: Check bot and API latency
- [x] **!help**: Detailed usage manual with embed

#### Rich Presence (RPC)
- [x] **Application ID**: `1396351851410227292`
- [x] **Activity Type**: `WATCHING`
- [x] **Custom Details**: `You, MyLove, Forever💕`
- [x] **Custom State**: `Aurhelana - iHannsy`
- [x] **Custom Assets**: Large and small images with text
- [x] **Custom Buttons**: Instagram and GitHub links
- [x] **Status**: `Do Not Disturb`

#### Webhook Logging System
- [x] **Autopost Logs**: Detailed logging for auto post activities
- [x] **Activity Logs**: General bot activity logging
- [x] **Separate Formats**: Different webhook formats for different log types
- [x] **Error Tracking**: Comprehensive error logging and monitoring
- [x] **Status Monitoring**: Real-time status updates

#### Interactive CLI Features
- [x] **Welcome Screen**: ASCII art logo with update checking
- [x] **Account Management**: Create, configure, and remove accounts
- [x] **Configuration Wizard**: Step-by-step setup process
- [x] **Multi-Account Support**: Switch between multiple Discord accounts
- [x] **Settings Persistence**: Save configurations to `ihannsy.json`
- [x] **Auto Update**: Repository-based update checking

#### Error Handling & Stability
- [x] **Unhandled Rejection Handler**: Catch and log unhandled promise rejections
- [x] **Uncaught Exception Handler**: Catch and log uncaught exceptions
- [x] **Warning Handler**: Handle deprecation warnings
- [x] **Graceful Shutdown**: Clean exit with proper cleanup
- [x] **Connection Handling**: Auto retry on connection errors
- [x] **File Validation**: Validate attachment files
- [x] **Webhook Protection**: Prevent webhook errors from crashing bot
- [x] **Retry Logic**: Exponential backoff for login retries

#### Dependencies
- [x] **discord.js-selfbot-v13**: `^3.0.1` - Main selfbot library
- [x] **inquirer**: `^9.2.12` - CLI interactive prompts
- [x] **chalk**: `^4.1.2` - Terminal colors and styling
- [x] **debug**: `^4.3.4` - Debug logging
- [x] **Node.js Built-in**: `https`, `fs`, `path`, `child_process`

#### File Structure
- [x] **index.js**: Main bot script
- [x] **cli.js**: Interactive CLI system
- [x] **repo-update.js**: Repository update system
- [x] **package.json**: Dependencies and scripts
- [x] **ihannsy.json**: Configuration storage (auto-created)
- [x] **README.md**: Comprehensive documentation
- [x] **CHANGELOG.md**: This changelog file

#### Command Output Formats
- [x] **!post Output**: 
  ```
  # AUTOPOST STARTED
  > - Index **1**
  > - Running in **<#123456789>**'s
  > - Delay **5** minute(s)
  > - Attachment(s) **2**
  ```

- [x] **!help Output**:
  ```
  # SELFBOT BY iHANNSY
  ## 🔍FEATURES:
  > - Auto Send Post
  > - Independent WebHook Log For Auto Posting And System
  > - RPC or Activity Profile
  > - Prefix Command Selfbot (Only Selfbot Can Access)
  ```

- [x] **!ping Output**:
  ```
  # 🏓 PONG!
  > - Bot Latency: 45ms
  > - API Latency: 123ms
  ```

- [x] **!index Output**:
  ```
  # AUTO POST LIST
  > - **1:** [Ch: <#123456789> - D: 5 A: 2]
  > - **2:** [Ch: <#987654321> - D: 30 A: 0]
  ```

#### Webhook Log Formats
- [x] **Autopost Webhook**: Detailed fields for auto post activities
- [x] **Activity Webhook**: Simplified fields for general activities
- [x] **Custom Images**: Specific GIF and thumbnail URLs
- [x] **Footer Format**: PAKAN STORE branding with formatted date/time
- [x] **Field Structure**: Organized fields for different log types

#### Configuration System
- [x] **ihannsy.json Structure**:
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

### Security
- [x] **Token Protection**: Secure token storage and handling
- [x] **Input Validation**: Comprehensive input validation
- [x] **Error Sanitization**: Safe error message handling
- [x] **Webhook Security**: Secure webhook request handling

### Performance
- [x] **Memory Management**: Proper cleanup and garbage collection
- [x] **Interval Management**: Efficient interval clearing
- [x] **Connection Pooling**: Optimized connection handling
- [x] **Error Recovery**: Fast error recovery and retry mechanisms

### Documentation
- [x] **README.md**: Comprehensive project documentation
- [x] **CHANGELOG.md**: Detailed change log
- [x] **Code Comments**: Inline code documentation
- [x] **Usage Examples**: Clear usage examples and tutorials

---

## [Unreleased]

### Planned Features
- [ ] **Modular Architecture**: Complete modular restructuring
- [ ] **Plugin System**: Extensible plugin architecture
- [ ] **Database Support**: SQLite/MySQL database integration
- [ ] **Web Dashboard**: Web-based management interface
- [ ] **API Endpoints**: REST API for external integrations
- [ ] **Advanced Logging**: Structured logging with levels
- [ ] **Performance Monitoring**: Real-time performance metrics
- [ ] **Auto Backup**: Automatic configuration backup
- [ ] **Multi-Language Support**: Internationalization support
- [ ] **Advanced Error Recovery**: Smart error recovery algorithms

### Known Issues
- [ ] **Memory Usage**: Monitor and optimize memory usage
- [ ] **Rate Limiting**: Implement Discord rate limiting
- [ ] **Connection Stability**: Improve connection stability
- [ ] **Error Reporting**: Enhanced error reporting system

---

## Version History

- **v1.0.0** (2024-01-01): Initial release with full feature set
- **v0.9.0** (2024-01-01): Beta version with core features
- **v0.8.0** (2024-01-01): Alpha version with basic functionality
- **v0.7.0** (2024-01-01): Development version with CLI
- **v0.6.0** (2024-01-01): Development version with webhooks
- **v0.5.0** (2024-01-01): Development version with auto posting
- **v0.4.0** (2024-01-01): Development version with RPC
- **v0.3.0** (2024-01-01): Development version with commands
- **v0.2.0** (2024-01-01): Development version with basic bot
- **v0.1.0** (2024-01-01): Initial development version

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀** - We Grow Because You Believe

*Honest From the Start, Always Safe*