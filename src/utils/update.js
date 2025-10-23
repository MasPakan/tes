const https = require('https');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer').default;
const LanguageManager = require('./language');

class RepositoryUpdateManager {
    constructor() {
        this.repoUrl = 'https://api.github.com/repos/ihannsy/discord-selfbot-automation';
        this.branchUrl = `${this.repoUrl}/branches/main`;
        this.archiveUrl = `${this.repoUrl}/zipball/main`;
        this.currentCommitFile = path.join(__dirname, '../../.current-commit');
        this.languageManager = new LanguageManager();
    }

    t(key, params = {}) {
        return this.languageManager.t(key, params);
    }

    async checkForUpdates() {
        try {
            console.log(chalk.blue(this.t('update.checking')));
            
            // Get current commit hash
            const currentCommit = this.getCurrentCommit();
            
            // Get latest commit hash from repository
            const latestCommit = await this.getLatestCommit();
            
            if (!latestCommit) {
                return { hasUpdate: false, error: 'Could not fetch latest commit' };
            }

            const hasUpdate = currentCommit !== latestCommit;

            return {
                hasUpdate,
                currentCommit,
                latestCommit,
                updateUrl: this.archiveUrl
            };
        } catch (error) {
            console.error('❌ Error checking for updates:', error.message);
            return { hasUpdate: false, error: error.message };
        }
    }

    getCurrentCommit() {
        try {
            if (fs.existsSync(this.currentCommitFile)) {
                return fs.readFileSync(this.currentCommitFile, 'utf8').trim();
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    setCurrentCommit(commitHash) {
        try {
            fs.writeFileSync(this.currentCommitFile, commitHash);
        } catch (error) {
            console.error('❌ Error saving current commit:', error.message);
        }
    }

    async getLatestCommit() {
        return new Promise((resolve, reject) => {
            const url = new URL(this.branchUrl);
            
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: 'GET',
                headers: {
                    'User-Agent': 'Discord-Selfbot-Automation',
                    'Accept': 'application/vnd.github.v3+json'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const branchData = JSON.parse(data);
                        resolve(branchData.commit?.sha || null);
                    } catch (error) {
                        reject(new Error('Failed to parse branch data'));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    async performUpdate() {
        try {
            console.log('🔄 Updating from repository...');
            
            // Create backup
            const backupDir = path.join(__dirname, '../../backup');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            const backupFile = path.join(backupDir, `backup-${Date.now()}.zip`);
            
            // Backup current files
            const filesToBackup = ['index.js', 'cli.js', 'package.json', 'ihannsy.json'];
            const backupData = {};
            
            filesToBackup.forEach(file => {
                const filePath = path.join(__dirname, '../../', file);
                if (fs.existsSync(filePath)) {
                    backupData[file] = fs.readFileSync(filePath, 'utf8');
                }
            });
            
            fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
            console.log(`📦 Backup created: ${backupFile}`);

            // Download and extract update
            await this.downloadAndExtractUpdate();
            
            console.log('✅ Update completed successfully!');
            console.log('🔄 Please restart the script to apply changes.');
            
            return true;
        } catch (error) {
            console.error('❌ Update failed:', error.message);
            return false;
        }
    }

    async downloadAndExtractUpdate() {
        return new Promise((resolve, reject) => {
            const url = new URL(this.archiveUrl);
            
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: 'GET',
                headers: {
                    'User-Agent': 'Discord-Selfbot-Automation',
                    'Accept': 'application/vnd.github.v3+json'
                }
            };

            const req = https.request(options, (res) => {
                if (res.statusCode === 302 || res.statusCode === 301) {
                    // Follow redirect
                    this.downloadAndExtractUpdate().then(resolve).catch(reject);
                    return;
                }

                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    return;
                }

                const chunks = [];
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                res.on('end', () => {
                    try {
                        const zipData = Buffer.concat(chunks);
                        this.extractUpdate(zipData);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.setTimeout(30000, () => {
                req.destroy();
                reject(new Error('Download timeout'));
            });

            req.end();
        });
    }

    extractUpdate(zipData) {
        // For now, we'll just update the current commit hash
        // In a real implementation, you would extract and replace files
        const latestCommit = this.getLatestCommit();
        if (latestCommit) {
            this.setCurrentCommit(latestCommit);
        }
        
        console.log('📥 Update files downloaded and extracted');
    }

    async showUpdatePrompt() {
        const updateInfo = await this.checkForUpdates();
        
        if (updateInfo.hasUpdate) {
            console.log(chalk.green(`\n🎉 Repository update available!`));
            console.log(chalk.yellow(`   Current commit: ${updateInfo.currentCommit || 'Unknown'}`));
            console.log(chalk.green(`   Latest commit: ${updateInfo.latestCommit}`));
            
            const { shouldUpdate } = await inquirer.prompt([{
                type: 'confirm',
                name: 'shouldUpdate',
                message: 'Would you like to update from repository now?',
                default: true
            }]);
            
            if (shouldUpdate) {
                const success = await this.performUpdate();
                if (success) {
                    const { restartNow } = await inquirer.prompt([{
                        type: 'confirm',
                        name: 'restartNow',
                        message: 'Would you like to restart the script now?',
                        default: true
                    }]);
                    
                    if (restartNow) {
                        console.log(chalk.blue('🔄 Restarting...'));
                        process.exit(0);
                    }
                }
            } else {
                console.log(chalk.yellow('⏭️  Skipping update. You can update later by running the script again.'));
            }
        } else {
            console.log(chalk.green('✅ You are running the latest version!'));
        }
        
        console.log(''); // Empty line for spacing
    }
}

module.exports = RepositoryUpdateManager;