# 📝 Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-10-23

### ✨ New Features
- [x] **Immediate Post Execution** - `!post` command now sends message immediately
- [x] **Uptime Formatting** - HH.MM.SS format for webhook logs
- [x] **Enhanced Error Handling** - Better DM error handling with fallback
- [x] **Reply System** - Commands now reply to original message

### 🔧 Improvements
- [x] **Auto Post Timing** - First message sent immediately, delay only for repeats
- [x] **Webhook Logs** - Activity logs now use localized language
- [x] **Uptime Display** - Real-time uptime calculation in webhook logs
- [x] **Message Delivery** - Improved message delivery with error recovery
- [x] **User Experience** - Better feedback for command execution

### 🐛 Fixes
- [x] **Config Directory** - Auto-creation of config directory
- [x] **DM Errors** - Fixed "Cannot send messages to this user" error
- [x] **Uptime Calculation** - Fixed uptime display in webhook logs
- [x] **Command Output** - Fixed missing output for `!post` command
- [x] **Language Integration** - Fixed webhook activity log localization

### 📊 Technical Details

#### Immediate Post Execution
- **Change**: `!post` now sends first message immediately
- **Implementation**: Separate immediate send before interval setup
- **Benefit**: Users see immediate results

#### Uptime Formatting
- **Format**: `HH.MM.SS` (hours.minutes.seconds)
- **Calculation**: `Date.now() - startTime`
- **Display**: Real-time in webhook logs

#### Enhanced Error Handling
- **DM Errors**: Graceful handling of blocked/disabled DMs
- **Fallback**: Console logging when DMs fail
- **Recovery**: Automatic retry with exponential backoff

---

## [1.1.0] - 2025-10-23

### ✨ New Features
- [x] **Multi-Language Support** - English & Indonesian with dynamic switching
- [x] **Advanced Error Recovery** - Smart retry with circuit breaker pattern
- [x] **Language Manager** - Centralized translation system
- [x] **Error Recovery Manager** - Exponential backoff with Discord-specific strategies
- [x] **Modular Architecture** - Complete code restructuring
- [x] **Interactive CLI** - Enhanced with language selection
- [x] **Localized Content** - All messages support multiple languages

### 🔧 Improvements
- [x] **CLI Experience** - Language selection during setup
- [x] **Error Handling** - Advanced recovery with event-driven system
- [x] **Configuration** - Added language preference to settings
- [x] **Documentation** - Comprehensive API and installation guides
- [x] **Code Organization** - Modular structure with clear separation

### 🐛 Fixes
- [x] **Module Imports** - Fixed all import/export issues
- [x] **Language Loading** - Fixed language file parsing
- [x] **Error Recovery** - Fixed initialization and event handling
- [x] **Configuration Paths** - Fixed paths after restructuring
- [x] **CLI Integration** - Fixed language integration in CLI

### 📊 Technical Details

#### Multi-Language System
- **Files**: `src/locales/en.json`, `src/locales/id.json`
- **Manager**: `src/utils/language.js` with parameter interpolation
- **Features**: Dynamic switching, fallback system, validation

#### Error Recovery System
- **Manager**: `src/utils/errorRecovery.js`
- **Features**: Exponential backoff, circuit breaker, Discord strategies
- **Events**: Error, retry, recovery success/failure, circuit breaker

#### Modular Structure
- **Main**: `main.js` - Simple entry point
- **Bot**: `src/bot.js` - Main orchestration
- **Modules**: CLI, commands, webhook, utils, config, locales
- **Dependencies**: Clear module hierarchy

---

## [1.0.0] - 2025-10-21

### ✨ Initial Release
- [x] **Discord Selfbot** - Complete selfbot implementation
- [x] **Auto Posting** - Multi-channel with custom delay
- [x] **Management Commands** - Full command set
- [x] **Rich Presence** - Custom RPC with specific format
- [x] **Webhook Logging** - Comprehensive logging system
- [x] **Interactive CLI** - User-friendly interface
- [x] **Multi-Account** - Multiple Discord accounts support
- [x] **Configuration** - JSON-based config system
- [x] **Auto Updates** - Repository-based update checking
- [x] **Error Handling** - Comprehensive error protection

---

## 🔮 Planned Features

- [ ] **Plugin System** - Extensible plugin architecture
- [ ] **Web Dashboard** - Web-based management interface
- [ ] **Database Support** - SQLite/MySQL integration
- [ ] **API Endpoints** - REST API for integrations
- [ ] **Performance Monitoring** - Real-time metrics
- [ ] **Auto Backup** - Automatic configuration backup

---

**𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀** - We Grow Because You Believe
