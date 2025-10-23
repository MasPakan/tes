// Test script to verify commands don't block each other
const CommandHandler = require('./src/commands/commands');

class MockClient {
    constructor() {
        this.user = { 
            send: (message) => {
                console.log(`📤 DM sent: ${message}`);
                return Promise.resolve();
            }
        };
        this.channels = { 
            cache: { 
                get: (id) => ({ 
                    send: (data) => {
                        console.log(`📤 Channel message sent: ${data.content}`);
                        return Promise.resolve();
                    }, 
                    name: 'test-channel',
                    id: id
                }) 
            } 
        };
    }
}

class MockWebhookLogger {
    sendActivityLog(type, message) {
        console.log(`📊 Activity Log: ${type} - ${message}`);
    }
    
    sendAutopostLog(type, channel, message, error, delay, uptime, count) {
        console.log(`📊 Autopost Log: ${type} - ${message}`);
    }
}

class MockLanguageManager {
    t(key, params = {}) {
        const translations = {
            'commands.autopost.started': `# AUTOPOST STARTED\n> - Index **${params.index}**\n> - Running in **<#${params.channel_id}>**\n> - Delay **${params.delay}** minute(s)\n> - Attachment(s) **${params.count}**`,
            'commands.autopost.list_empty': 'No auto posts running',
            'commands.autopost.stopped': `Auto post ${params.index} stopped`,
            'commands.ping.title': `# 🏓 PONG!\n> - Bot Latency: ${params.bot_latency}ms\n> - API Latency: ${params.api_latency}ms`,
            'commands.help.title': '# SELFBOT BY iHANNSY',
            'commands.help.features': '## 🔍FEATURES:',
            'commands.help.commands': '## 🔍Command List',
            'commands.help.contact': '## CONTACT'
        };
        return translations[key] || key;
    }
}

async function testCommands() {
    console.log('🧪 Testing Command Non-Blocking Execution...\n');
    
    const mockClient = new MockClient();
    const mockConfig = { prefix: '!' };
    const mockWebhookLogger = new MockWebhookLogger();
    const mockLanguageManager = new MockLanguageManager();
    const mockAutoPosts = new Map();
    
    const handler = new CommandHandler(mockClient, mockConfig, mockWebhookLogger, mockAutoPosts, mockLanguageManager);
    
    // Mock message objects
    const createMockMessage = (content, attachments = []) => ({
        content,
        attachments,
        author: { id: 'self' },
        reply: async (message) => {
            console.log(`💬 Reply: ${message}`);
            return Promise.resolve();
        }
    });
    
    console.log('1️⃣ Testing !post command (should not block)...');
    const postMessage = createMockMessage('!post 1 "Test message" 5 123456789');
    const startTime = Date.now();
    
    // Execute post command
    handler.executeCommand(postMessage);
    
    console.log('2️⃣ Testing !index command immediately after !post...');
    const indexMessage = createMockMessage('!index');
    handler.executeCommand(indexMessage);
    
    console.log('3️⃣ Testing !ping command immediately after !post...');
    const pingMessage = createMockMessage('!ping');
    handler.executeCommand(pingMessage);
    
    console.log('4️⃣ Testing !help command immediately after !post...');
    const helpMessage = createMockMessage('!help');
    handler.executeCommand(helpMessage);
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    console.log(`\n⏱️ Total execution time: ${executionTime}ms`);
    console.log('✅ If all commands executed quickly without waiting, the fix is working!');
    
    // Wait a bit to see if any async operations complete
    setTimeout(() => {
        console.log('\n🔍 Checking auto posts after 2 seconds...');
        console.log(`Auto posts running: ${mockAutoPosts.size}`);
        mockAutoPosts.forEach((autoPost, index) => {
            console.log(`- Index ${index}: ${autoPost.message} (${autoPost.delay}min)`);
        });
    }, 2000);
}

testCommands().catch(console.error);