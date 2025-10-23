# 🤖 Discord Selfbot Automation Script

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ihannsy/discord-selfbot-automation)
[![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Discord](https://img.shields.io/badge/discord-join-7289da.svg?logo=discord&logoColor=white)](https://discord.gg/8wM2tNhUdB)
[![Instagram](https://img.shields.io/badge/instagram-follow-e4405f.svg?logo=instagram&logoColor=white)](https://www.instagram.com/saya.p4rhan)
[![GitHub](https://img.shields.io/badge/github-star-black.svg?logo=github&logoColor=white)](https://github.com/MasPakan/tes.git)

**Script selfbot Discord dengan fitur lengkap menggunakan `discord.js-selfbot-v13`**

*Auto posting, Rich Presence, Webhook logging, Multi-language support, Advanced error recovery, dan Interactive CLI*

---

## ⚠️ **PENTING - BACA SEBELUM MENGGUNAKAN**

> **⚠️ PERINGATAN PENTING**
> 
> - Script ini menggunakan **user token**, bukan bot token
> - Penggunaan selfbot **melanggar Terms of Service Discord**
> - **Gunakan dengan risiko sendiri**
> - **Jangan gunakan di server yang tidak Anda miliki**
> - **Kami tidak bertanggung jawab atas konsekuensi penggunaan**

---

## 🚀 **Quick Start**

### **1. Clone Repository**
```bash
git clone https://github.com/MasPakan/tes.git
cd tes
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Run Script**
```bash
npm start
```

### **4. Follow Interactive CLI**
- **Auto update check** - Script otomatis cek update
- **Language selection** - Pilih bahasa (English/Indonesia)
- Input Discord user token
- Pilih enable/disable webhook
- Input webhook URL (jika enable)
- Set custom prefix (default: !)
- Pilih enable/disable RPC
- Start bot

---

## 📋 **Fitur Lengkap**

### 🖥️ **Interactive CLI System**
- **Multi-account management** - Simpan dan kelola multiple Discord accounts
- **Configuration wizard** - Setup mudah dengan panduan step-by-step
- **Account selection menu** - Pilih akun dari daftar yang tersimpan
- **Configuration management** - Update config tanpa menghapus akun
- **Auto update system** - Cek dan update script otomatis
- **Multi-language support** - English & Indonesia dengan switching dinamis

### 🤖 **Auto Posting System**
- **Command:** `{prefix}post <index> <message> <delay_minutes> <channel_id>`
- Multi channel posting
- Custom delay per channel (dalam menit)
- **Easy file attachment** (just attach files to your command message!)
- Error handling robust

### 🎮 **Rich Presence (Optional)**
- Custom RPC dengan format yang diminta
- Status "Do Not Disturb"
- Assets dan buttons custom
- **Dapat di-disable** melalui CLI

### 📊 **Webhook Logger (Optional)**
- Logging otomatis ke webhook
- Format sesuai spesifikasi
- Error tracking
- Status monitoring
- **Dapat di-disable** melalui CLI

### 🌍 **Multi-Language Support**
- **English & Indonesia** - Dukungan bahasa lengkap
- **Dynamic switching** - Ganti bahasa tanpa restart
- **Localized content** - Semua pesan dan output dalam bahasa pilihan
- **CLI language selection** - Pilih bahasa saat setup
- **Persistent settings** - Bahasa tersimpan di konfigurasi

### 🛡️ **Advanced Error Recovery**
- **Exponential backoff** - Retry otomatis dengan delay bertahap
- **Circuit breaker** - Mencegah spam retry pada error berulang
- **Discord-specific strategies** - Penanganan error khusus Discord
- **Event-driven recovery** - Recovery berbasis event
- **Graceful degradation** - Fallback yang elegan

---

## 🎯 **Management Commands**

| Command | Description | Example |
|---------|-------------|---------|
| `{prefix}post` | Start auto posting dengan delay custom | `!post 1 "Hello" 5 123456789` |
| `{prefix}index` | List semua autopost aktif | `!index` |
| `{prefix}stop <index>` | Hentikan autopost spesifik | `!stop 1` |
| `{prefix}stop` | Hentikan semua autopost | `!stop` |
| `{prefix}ping` | Cek latency bot & API | `!ping` |
| `{prefix}help` | Manual penggunaan detail | `!help` |

---

## 📖 **Cara Penggunaan**

### 🖥️ **CLI Interface**

**First Time Setup:**
1. Jalankan `npm start`
2. Pilih "New Account"
3. Input Discord user token
4. Pilih enable/disable webhook
5. Input webhook URL (jika enable)
6. Set custom prefix (default: !)
7. Pilih enable/disable RPC
8. **Pilih bahasa (English/Indonesia)**
9. Start bot

**Returning User:**
1. Jalankan `npm start`
2. Pilih akun dari daftar yang tersimpan
3. Pilih "Start Bot" atau "New Config"

### 🤖 **Bot Commands**

**Auto Posting:**
```bash
{prefix}post 1 "Promo special hari ini! 🎉" 5 123456789012345678
```
- `1` = Index autopost
- `"Promo special hari ini! 🎉"` = Pesan
- `5` = Delay 5 menit
- `123456789012345678` = Channel ID

**Dengan Attachment:**
```bash
{prefix}post 2 "Check this out!" 10 123456789012345678
[Attach files to this message - image.png, video.mp4, etc.]
```

**Management:**
```bash
{prefix}index          # Lihat semua autopost aktif (delay dalam menit)
{prefix}stop 1         # Hentikan autopost index 1
{prefix}stop           # Hentikan semua autopost
{prefix}ping           # Cek latency
{prefix}help           # Manual lengkap
```

---

## 🔧 **Konfigurasi**

### **CLI Configuration**
- **Interactive setup** - Tidak perlu edit file manual
- **Multi-account support** - Kelola multiple Discord accounts
- **Configuration persistence** - Settings tersimpan di `ihannsy.json`
- **Easy reconfiguration** - Update settings kapan saja
- **Auto update checking** - Cek update otomatis saat startup

### **File Attachments**
- **Cara mudah**: Attach files langsung ke pesan command `{prefix}post`
- File akan otomatis terdeteksi dan disertakan dalam auto post
- Support semua jenis file (gambar, video, dokumen, dll)
- Tidak perlu path file atau upload manual

### **Account Management**
- **Save accounts** - Token dan config tersimpan aman
- **Switch accounts** - Ganti akun dengan mudah
- **Remove accounts** - Hapus akun yang tidak digunakan
- **Reconfigure** - Update settings tanpa menghapus akun

---

## 📁 **Struktur File**

```
/workspace/
├── main.js                    # Entry point utama
├── package.json               # Dependencies & version info
├── .gitignore                 # Git ignore rules
├── .gitattributes             # Git attributes
├── config/
│   └── ihannsy.json          # Configuration storage (auto-created)
├── src/
│   ├── bot.js                # Main bot logic
│   ├── cli/
│   │   └── cli.js            # Interactive CLI system
│   ├── commands/
│   │   └── commands.js       # Command handler
│   ├── webhook/
│   │   └── webhook.js        # Webhook logger
│   ├── utils/
│   │   ├── language.js       # Language manager
│   │   ├── errorRecovery.js  # Error recovery system
│   │   ├── rpc.js            # Rich Presence manager
│   │   └── update.js         # Update system
│   ├── config/
│   │   └── manager.js        # Configuration manager
│   └── locales/
│       ├── en.json           # English translations
│       └── id.json           # Indonesian translations
├── docs/
│   ├── INSTALLATION.md       # Installation guide
│   └── API.md                # API documentation
├── examples/
│   ├── config-example.json   # Configuration example
│   └── README.md             # Examples guide
├── PROJECT_STRUCTURE.md      # Project structure guide
├── CHANGELOG.md              # Changelog
└── README.md                 # Dokumentasi utama
```

---

## ⚡ **Dependencies**

| Package | Version | Description |
|---------|---------|-------------|
| `discord.js-selfbot-v13` | ^3.7.1 | Library selfbot utama |
| `inquirer` | ^9.2.12 | CLI interactive prompts |
| `chalk` | ^4.1.2 | Terminal colors & styling |
| Node.js built-in | - | `https`, `fs`, `path`, `child_process`, `events` |

---

## 🛡️ **Error Handling & Stability**

### **Advanced Error Recovery System**
- **Exponential backoff** - Retry dengan delay bertahap (1s, 2s, 4s, 8s, 16s, 30s max)
- **Circuit breaker pattern** - Mencegah spam retry pada error berulang
- **Discord-specific strategies** - Penanganan error khusus Discord (network, rate limit, auth, permission)
- **Event-driven recovery** - Recovery berbasis event dengan logging detail
- **Graceful degradation** - Fallback yang elegan saat recovery gagal
- **Jitter implementation** - Menghindari thundering herd problem
- **Recovery action system** - Wait, retry, reconnect, refresh token, clear cache

### **Comprehensive Error Protection**
- **Unhandled rejection handler** - Tangani promise rejection yang tidak tertangkap
- **Uncaught exception handler** - Tangani error yang tidak tertangkap dengan recovery
- **Warning handler** - Tangani deprecation warnings
- **Error logging** - Logging ke webhook (jika enable) dengan detail recovery
- **Graceful shutdown** - Clean exit dengan cleanup
- **Connection handling** - Auto retry pada connection error dengan backoff
- **File validation** - Validasi attachment files
- **Auto post error handling** - Stop auto post jika ada permission error
- **Webhook error protection** - Webhook error tidak crash bot
- **Retry logic** - Retry login dengan exponential backoff dan circuit breaker

---

## 🆘 **Troubleshooting**

### **Common Issues & Solutions**

| Problem | Solution |
|---------|----------|
| **Bot tidak login** | Cek token user (bukan bot token), pastikan token valid dan tidak expired, bot akan otomatis retry |
| **Auto post tidak berjalan** | Cek channel ID valid, pastikan delay minimal 1 menit, cek permission di channel |
| **Webhook tidak terkirim** | Cek webhook URL valid, pastikan webhook aktif, cek network connection |
| **Bot crash atau error** | Bot memiliki comprehensive error handling, unhandled rejection akan di-log ke webhook |
| **Memory leak atau performance** | Bot otomatis cleanup saat shutdown, auto post interval di-clear dengan benar |

---

## 📊 **Screenshots**

### **CLI Interface**
```
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
███████████████████████████████▓████████████████████████████
██████████████████▓▓█████████▓░░▓███████████████████████████
████████████████▓▒▓▓▓▓████▓▒▒░ ░░▒▓██████▓░█████████████████
████████████████░▒▓▒▓▓██████▓▒ ▒▓██████▓▒░ ░▓███████████████
███████████████▒░▒▒▒▓▓███████▒░▓█████▓▒▒▓▓░▒▓███████████████
███████████████░▒▓▒▒▓▓███▓▓██▓▒███████▒▒▓█░██▓▓▓████████████
██████████████▓░▒▓▒▓▓▓██▓▒▒░░░░░▒▒▒▒▓▓▓▓▓█▓██▒▓▓████████████
██████████████▒░▓▒▒▒▓▓▓██▓██▒░░░     ░░░░░░▒▒▒▒▓▓████████████
██████████████▒▒▓▒▒▓▓▓▓█▓███▓▒▒░░░░░      ░░▓▓▓▓████████████
█████████████▓░▒▓▒▓▓▓▓▓▓▓█████▓▓▓▒▒▒░░░▒▓▓▓███▓▓████████████
█████████████▓▒▓▓▒▒▒▓▓▓▓███████████▓██████████▓▓████████████
█████████████▒▒▓▒▒░▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓█████████▓▓█▓▒████████████
█████████████░▒▓▒▓▓▓███████████████████████▓▓█▓▒████████████
█████████████▒▓█▓██████████████████████████▓██▓▓████████████
██████████████▓███████▓▓▓████████████████████▓▓▓████████████
███████████████████▒▓█░▒▒▓█████████████████▓▓▓██████████████
██████████████████▓░▓▓░░░▓███████████▓██▓███████████████████
██████████████████▓▓█▓▓▓▓███████████▓▓█▓▒███████████████████
████████████████████████████████▓▒▒▓▓▓█▓▓███████████████████
████████████████████████████████████████████████████████████

⚠️  Warning: Using selfbots violates Discord ToS. Use at your own risk!

🔍 Checking repository for updates...
✅ You are running the latest version!

? Select an account or action:
❯ ➕ New Account 
  ❌ Quit
```

### **Bot Commands**
```
!post 1 "Promo special! 🎉" 5 123456789012345678
# AUTOPOST STARTED
> - Index **1**
> - Running in **<#123456789012345678>**'s
> - Delay **5** minute(s)
> - Attachment(s) **2**

!index
# AUTO POST LIST
> - **1:** [Ch: <#123456789012345678> - D: 5 A: 2]
> - **2:** [Ch: <#987654321098765432> - D: 30 A: 0]

!ping
# 🏓 PONG!
> - Bot Latency: 45ms
> - API Latency: 123ms
```

---

## 🤝 **Contributing**

### **How to Contribute**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Bug Reports**
- Use GitHub Issues
- Provide detailed information
- Include error logs if possible

---

## 📞 **Support & Contact**

### **Get Help**
- **Discord Server**: [Join our Discord](https://discord.gg/8wM2tNhUdB)
- **Instagram**: [@saya.p4rhan](https://www.instagram.com/saya.p4rhan)
- **GitHub Issues**: [Report Issues](https://github.com/MasPakan/tes/issues)

### **Developer**
- **GitHub**: [@MasPakan](https://github.com/MasPakan)
- **Instagram**: [@saya.p4rhan](https://www.instagram.com/saya.p4rhan)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**⚠️ Disclaimer**: This software is for educational purposes only. Use at your own risk.

---

## 🌟 **Star this Repository**

If you found this project helpful, please give it a ⭐!

**𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀** - We Grow Because You Believe

*Honest From the Start, Always Safe*