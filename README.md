# Discord Selfbot Automation Script

Script selfbot Discord menggunakan `discord.js-selfbot-v13` dengan fitur auto posting, Rich Presence, dan webhook logging.

## ⚠️ Peringatan
- Script ini menggunakan **user token**, bukan bot token
- Penggunaan selfbot melanggar Terms of Service Discord
- Gunakan dengan risiko sendiri
- Jangan gunakan di server yang tidak Anda miliki

## 🚀 Instalasi

1. **Install dependencies:**
```bash
npm install
```

2. **Jalankan script:**
```bash
npm start
```

3. **Ikuti panduan CLI interaktif:**
   - Input Discord user token
   - Pilih enable/disable webhook
   - Input webhook URL (jika enable)
   - Set custom prefix (default: !)
   - Pilih enable/disable RPC
   - Start bot

## 📋 Fitur

### 1. 🖥️ Interactive CLI System
- **Multi-account management** - Simpan dan kelola multiple Discord accounts
- **Configuration wizard** - Setup mudah dengan panduan step-by-step
- **Account selection menu** - Pilih akun yang sudah tersimpan
- **Configuration management** - Update config tanpa menghapus akun

### 2. Auto Posting System
- **Command:** `{prefix}post <index> <message> <delay> <channel_id>`
- Multi channel posting
- Custom delay per channel
- **Easy file attachment** (just attach files to your command message!)
- Error handling robust

### 3. Management Commands
- `{prefix}index` - List semua autopost aktif
- `{prefix}stop <index>` - Hentikan autopost spesifik
- `{prefix}stop` - Hentikan semua autopost
- `{prefix}ping` - Cek latency bot & API
- `{prefix}help` - Manual penggunaan detail

### 4. Rich Presence (Optional)
- Custom RPC dengan format yang diminta
- Status "Do Not Disturb"
- Assets dan buttons custom
- **Dapat di-disable** melalui CLI

### 5. Webhook Logger (Optional)
- Logging otomatis ke webhook
- Format sesuai spesifikasi
- Error tracking
- Status monitoring
- **Dapat di-disable** melalui CLI

## 📖 Cara Penggunaan

### 🖥️ CLI Interface

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

### 🤖 Bot Commands

**Auto Posting:**
```
{prefix}post 1 "Promo special hari ini! 🎉" 30 123456789012345678
```
- `1` = Index autopost
- `"Promo special hari ini! 🎉"` = Pesan
- `30` = Delay 30 detik
- `123456789012345678` = Channel ID

**Dengan Attachment:**
```
{prefix}post 2 "Check this out!" 60 123456789012345678
[Attach files to this message - image.png, video.mp4, etc.]
```

**Management:**
```
{prefix}index          # Lihat semua autopost aktif
{prefix}stop 1         # Hentikan autopost index 1
{prefix}stop           # Hentikan semua autopost
{prefix}ping           # Cek latency
{prefix}help           # Manual lengkap
```

## 🔧 Konfigurasi

### CLI Configuration
- **Interactive setup** - Tidak perlu edit file manual
- **Multi-account support** - Kelola multiple Discord accounts
- **Configuration persistence** - Settings tersimpan otomatis
- **Easy reconfiguration** - Update settings kapan saja

### File Attachments
- **Cara mudah**: Attach files langsung ke pesan command `{prefix}post`
- File akan otomatis terdeteksi dan disertakan dalam auto post
- Support semua jenis file (gambar, video, dokumen, dll)
- Tidak perlu path file atau upload manual

### Account Management
- **Save accounts** - Token dan config tersimpan aman
- **Switch accounts** - Ganti akun dengan mudah
- **Remove accounts** - Hapus akun yang tidak digunakan
- **Reconfigure** - Update settings tanpa menghapus akun

## 📁 Struktur File
```
/workspace/
├── index.js           # Script utama
├── cli.js             # CLI interactive system
├── package.json       # Dependencies
├── configs/           # Configuration storage
│   └── accounts.json  # Saved accounts & configs
└── README.md          # Dokumentasi
```

## ⚡ Dependencies
- `discord.js-selfbot-v13`: Library selfbot utama
- `inquirer`: CLI interactive prompts
- `chalk`: Terminal colors & styling
- Node.js built-in modules: `https`, `fs`, `path`

## 🛡️ Error Handling
- **CLI validation** - Input validation di setiap step
- **Token validation** - Cek token sebelum login
- **Command validation** - Validasi input command
- **Error logging** - Logging ke webhook (jika enable)
- **Graceful shutdown** - Clean exit dengan cleanup
- **Connection handling** - Auto retry pada connection error
- **File validation** - Validasi attachment files

## 📝 Log Format
Webhook mengirim log dengan format:
- Client user info
- Channel target
- Action performed
- Status (success/error)
- Timestamp
- Error details (jika ada)

## 🔄 Auto Restart
Script akan otomatis restart jika terjadi error fatal, kecuali:
- Token invalid
- Network error berkepanjangan
- Permission denied

## ⚠️ Catatan Penting
1. **Token Security**: Jangan share user token Anda
2. **Rate Limiting**: Discord memiliki rate limit, gunakan delay minimal 5 detik
3. **File Attachments**: Attach files langsung ke pesan command, tidak perlu path
4. **Channel Access**: Pastikan bot memiliki akses ke channel target
5. **Webhook**: Setup webhook untuk monitoring yang lebih baik

## 🆘 Troubleshooting

### Bot tidak login
- Cek token user (bukan bot token)
- Pastikan token valid dan tidak expired

### Auto post tidak berjalan
- Cek channel ID valid
- Pastikan delay minimal 5 detik
- Cek permission di channel

### Webhook tidak terkirim
- Cek webhook URL valid
- Pastikan webhook aktif
- Cek network connection

## 📞 Support
Untuk bantuan lebih lanjut, hubungi:
- Instagram: [@saya.p4rhan](https://www.instagram.com/saya.p4rhan)
- GitHub: [Repository](https://github.com/your-repo)

---
**𝙋𝘼𝙆𝘼𝙉 𝙎𝙏𝙊𝙍𝙀** - We Grow Because You Believe