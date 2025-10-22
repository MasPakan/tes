<div align="center">

# 🤖 Discord Selfbot Automation Script

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ihannsy/discord-selfbot-automation)
[![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Discord](https://img.shields.io/badge/discord-join-7289da.svg?logo=discord&logoColor=white)](https://discord.gg/your-invite-link)
[![Instagram](https://img.shields.io/badge/instagram-follow-e4405f.svg?logo=instagram&logoColor=white)](https://www.instagram.com/saya.p4rhan)
[![GitHub](https://img.shields.io/badge/github-star-black.svg?logo=github&logoColor=white)](https://github.com/ihannsy/discord-selfbot-automation)

**Script selfbot Discord dengan fitur lengkap menggunakan `discord.js-selfbot-v13`**

*Auto posting, Rich Presence, Webhook logging, dan Interactive CLI*

---

## ⚠️ **PENTING - BACA SEBELUM MENGGUNAKAN**

> **⚠️ PERINGATAN PENTING**
> 
> - Script ini menggunakan **user token**, bukan bot token
> - Penggunaan selfbot **melanggar Terms of Service Discord**
> - **Gunakan dengan risiko sendiri**
> - **Jangan gunakan di server yang tidak Anda miliki**
> - **Kami tidak bertanggung jawab atas konsekuensi penggunaan**

</div>

---

## 🚀 **Quick Start**

<div align="center">

### **1. Clone Repository**
```bash
git clone https://github.com/ihannsy/discord-selfbot-automation.git
cd discord-selfbot-automation
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
- Input Discord user token
- Pilih enable/disable webhook
- Input webhook URL (jika enable)
- Set custom prefix (default: !)
- Pilih enable/disable RPC
- Start bot

</div>

---

## 📋 **Fitur Lengkap**

<table>
<tr>
<td width="50%" align="center">

### 🖥️ **Interactive CLI System**
- **Multi-account management** - Simpan dan kelola multiple Discord accounts
- **Configuration wizard** - Setup mudah dengan panduan step-by-step
- **Account selection menu** - Pilih akun dari daftar yang tersimpan
- **Configuration management** - Update config tanpa menghapus akun
- **Auto update system** - Cek dan update script otomatis

</td>
<td width="50%" align="center">

### 🤖 **Auto Posting System**
- **Command:** `{prefix}post <index> <message> <delay_minutes> <channel_id>`
- Multi channel posting
- Custom delay per channel (dalam menit)
- **Easy file attachment** (just attach files to your command message!)
- Error handling robust

</td>
</tr>
<tr>
<td width="50%" align="center">

### 🎮 **Rich Presence (Optional)**
- Custom RPC dengan format yang diminta
- Status "Do Not Disturb"
- Assets dan buttons custom
- **Dapat di-disable** melalui CLI

</td>
<td width="50%" align="center">

### 📊 **Webhook Logger (Optional)**
- Logging otomatis ke webhook
- Format sesuai spesifikasi
- Error tracking
- Status monitoring
- **Dapat di-disable** melalui CLI

</td>
</tr>
</table>

---

## 🎯 **Management Commands**

<div align="center">

| Command | Description | Example |
|---------|-------------|---------|
| `{prefix}post` | Start auto posting dengan delay custom | `!post 1 "Hello" 5 123456789` |
| `{prefix}index` | List semua autopost aktif | `!index` |
| `{prefix}stop <index>` | Hentikan autopost spesifik | `!stop 1` |
| `{prefix}stop` | Hentikan semua autopost | `!stop` |
| `{prefix}ping` | Cek latency bot & API | `!ping` |
| `{prefix}help` | Manual penggunaan detail | `!help` |

</div>

---

## 📖 **Cara Penggunaan**

<div align="center">

### 🖥️ **CLI Interface**

**First Time Setup:**
1. Jalankan `npm start`
2. Pilih "New Account"
3. Input Discord user token
4. Pilih enable/disable webhook
5. Input webhook URL (jika enable)
6. Set custom prefix (default: !)
7. Pilih enable/disable RPC
8. Start bot

**Returning User:**
1. Jalankan `npm start`
2. Pilih akun dari daftar yang tersimpan
3. Pilih "Start Bot" atau "New Config"

</div>

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

<div align="center">

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

</div>

---

## 📁 **Struktur File**

```
/workspace/
├── index.js           # Script utama
├── cli.js             # CLI interactive system
├── update.js          # Update management system
├── package.json       # Dependencies & version info
├── ihannsy.json       # Configuration storage (auto-created)
└── README.md          # Dokumentasi
```

---

## ⚡ **Dependencies**

<div align="center">

| Package | Version | Description |
|---------|---------|-------------|
| `discord.js-selfbot-v13` | ^3.0.1 | Library selfbot utama |
| `inquirer` | ^9.2.12 | CLI interactive prompts |
| `chalk` | ^4.1.2 | Terminal colors & styling |
| Node.js built-in | - | `https`, `fs`, `path`, `child_process` |

</div>

---

## 🛡️ **Error Handling & Stability**

<div align="center">

### **Comprehensive Error Protection**
- **Unhandled rejection handler** - Tangani promise rejection yang tidak tertangkap
- **Uncaught exception handler** - Tangani error yang tidak tertangkap
- **Warning handler** - Tangani deprecation warnings
- **Error logging** - Logging ke webhook (jika enable)
- **Graceful shutdown** - Clean exit dengan cleanup
- **Connection handling** - Auto retry pada connection error
- **File validation** - Validasi attachment files
- **Auto post error handling** - Stop auto post jika ada permission error
- **Webhook error protection** - Webhook error tidak crash bot
- **Retry logic** - Retry login dengan exponential backoff

</div>

---

## 🆘 **Troubleshooting**

<div align="center">

### **Common Issues & Solutions**

| Problem | Solution |
|---------|----------|
| **Bot tidak login** | Cek token user (bukan bot token), pastikan token valid dan tidak expired, bot akan otomatis retry |
| **Auto post tidak berjalan** | Cek channel ID valid, pastikan delay minimal 1 menit, cek permission di channel |
| **Webhook tidak terkirim** | Cek webhook URL valid, pastikan webhook aktif, cek network connection |
| **Bot crash atau error** | Bot memiliki comprehensive error handling, unhandled rejection akan di-log ke webhook |
| **Memory leak atau performance** | Bot otomatis cleanup saat shutdown, auto post interval di-clear dengan benar |

</div>

---

## 📊 **Screenshots**

<div align="center">

### **CLI Interface**
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🤖 DISCORD SELFBOT AUTOMATION SCRIPT              ║
║                                                              ║
║                    𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀                            ║
║              We Grow Because You Believe                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

🔍 Checking for updates...
✅ You are running the latest version!

👤 username1
👤 username2
➕ New Account
🔄 Update Script
❌ Quit
```

### **Bot Commands**
```
!post 1 "Promo special! 🎉" 5 123456789012345678
✅ Auto post [1] started in #general with 5 minute(s) delay

!index
[1] general (123456789012345678) - 5 minute(s) delay - 🟢 Running
[2] promo (987654321098765432) - 30 minute(s) delay - 🟢 Running
```

</div>

---

## 🤝 **Contributing**

<div align="center">

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

</div>

---

## 📞 **Support & Contact**

<div align="center">

### **Get Help**
- **Discord Server**: [Join our Discord](https://discord.gg/your-invite-link)
- **Instagram**: [@saya.p4rhan](https://www.instagram.com/saya.p4rhan)
- **GitHub Issues**: [Report Issues](https://github.com/ihannsy/discord-selfbot-automation/issues)

### **Developer**
- **GitHub**: [@ihannsy](https://github.com/ihannsy)
- **Instagram**: [@saya.p4rhan](https://www.instagram.com/saya.p4rhan)

</div>

---

## 📄 **License**

<div align="center">

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**⚠️ Disclaimer**: This software is for educational purposes only. Use at your own risk.

</div>

---

<div align="center">

## 🌟 **Star this Repository**

If you found this project helpful, please give it a ⭐!

**𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀** - We Grow Because You Believe

*Honest From the Start, Always Safe*

</div>