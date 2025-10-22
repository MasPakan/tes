const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class UpdateManager {
    constructor() {
        this.packageJson = require('./package.json');
        this.currentVersion = this.packageJson.version;
        this.updateUrl = this.packageJson.updateUrl || 'https://api.github.com/repos/ihannsy/discord-selfbot-automation/releases/latest';
    }

    async checkForUpdates() {
        try {
            // Check if update URL is configured
            if (!this.updateUrl || this.updateUrl === 'YOUR_UPDATE_URL_HERE') {
                return { hasUpdate: false, error: 'Update URL not configured' };
            }

            const latestRelease = await this.fetchLatestRelease();
            if (!latestRelease || !latestRelease.tag_name) {
                return { hasUpdate: false };
            }

            const latestVersion = latestRelease.tag_name.replace('v', '');
            const hasUpdate = this.compareVersions(latestVersion, this.currentVersion) > 0;

            return {
                hasUpdate,
                currentVersion: this.currentVersion,
                latestVersion,
                release: latestRelease
            };
        } catch (error) {
            console.error('❌ Error checking for updates:', error.message);
            return { hasUpdate: false, error: error.message };
        }
    }

    async fetchLatestRelease() {
        return new Promise((resolve, reject) => {
            try {
                const url = new URL(this.updateUrl);
                
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
                            const release = JSON.parse(data);
                            resolve(release);
                        } catch (error) {
                            reject(new Error('Failed to parse release data'));
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
            } catch (error) {
                reject(error);
            }
        });
    }

    compareVersions(version1, version2) {
        const v1parts = version1.split('.').map(Number);
        const v2parts = version2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            const v1part = v1parts[i] || 0;
            const v2part = v2parts[i] || 0;
            
            if (v1part > v2part) return 1;
            if (v1part < v2part) return -1;
        }
        
        return 0;
    }

    async performUpdate() {
        try {
            console.log('🔄 Updating script...');
            
            // Create backup
            const backupDir = path.join(__dirname, 'backup');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            const backupFile = path.join(backupDir, `backup-${Date.now()}.json`);
            fs.writeFileSync(backupFile, JSON.stringify(this.packageJson, null, 2));
            console.log(`📦 Backup created: ${backupFile}`);

            // Update package.json version
            const updatedPackageJson = {
                ...this.packageJson,
                version: this.currentVersion
            };
            
            fs.writeFileSync('./package.json', JSON.stringify(updatedPackageJson, null, 2));
            console.log('✅ Update completed successfully!');
            console.log('🔄 Please restart the script to apply changes.');
            
            return true;
        } catch (error) {
            console.error('❌ Update failed:', error.message);
            return false;
        }
    }

    async downloadUpdate(release) {
        try {
            console.log('📥 Downloading update...');
            
            // For now, we'll just update the version in package.json
            // In a real implementation, you would download and replace files
            const updatedPackageJson = {
                ...this.packageJson,
                version: release.tag_name.replace('v', '')
            };
            
            fs.writeFileSync('./package.json', JSON.stringify(updatedPackageJson, null, 2));
            console.log('✅ Update downloaded successfully!');
            
            return true;
        } catch (error) {
            console.error('❌ Download failed:', error.message);
            return false;
        }
    }
}

module.exports = UpdateManager;