# Examples

This directory contains example configurations and usage examples for the Discord Selfbot Automation project.

## Files

### `config-example.json`
Example configuration file showing the structure of `ihannsy.json`. Copy this to `config/ihannsy.json` and modify with your actual values.

## Usage

1. Copy `config-example.json` to `config/ihannsy.json`
2. Replace placeholder values with your actual Discord token and webhook URL
3. Run the bot with `npm start`

## Configuration

- **token**: Your Discord user token (not bot token)
- **webhookUrl**: Discord webhook URL for logging (optional)
- **prefix**: Command prefix (default: "!")
- **enableRPC**: Enable Rich Presence (default: true)
- **username**: Your Discord username (auto-detected)

## Security Note

Never commit your actual `config/ihannsy.json` file to version control as it contains sensitive information like your Discord token.