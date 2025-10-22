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

2. **Setup konfigurasi:**
   - Copy `.env.example` ke `.env`
   - Isi `DISCORD_TOKEN` dengan user token Anda
   - Isi `WEBHOOK_URL` dengan webhook URL (opsional)

3. **Jalankan script:**
```bash
npm start
```

## 📋 Fitur

### 1. Auto Posting System
- **Command:** `!post <index> <message> <delay> <channel_id>`
- Multi channel posting
- Custom delay per channel
- **Easy file attachment** (just attach files to your command message!)
- Error handling robust

### 2. Management Commands
- `!index` - List semua autopost aktif
- `!stop <index>` - Hentikan autopost spesifik
- `!stop` - Hentikan semua autopost
- `!ping` - Cek latency bot & API
- `!help` - Manual penggunaan detail

### 3. Rich Presence
- Custom RPC dengan format yang diminta
- Status "Do Not Disturb"
- Assets dan buttons custom

### 4. Webhook Logger
- Logging otomatis ke webhook
- Format sesuai spesifikasi
- Error tracking
- Status monitoring

## 📖 Cara Penggunaan

### Auto Posting
```
!post 1 "Promo special hari ini! 🎉" 30 123456789012345678
```
- `1` = Index autopost
- `"Promo special hari ini! 🎉"` = Pesan
- `30` = Delay 30 detik
- `123456789012345678` = Channel ID

### Dengan Attachment
```
!post 2 "Check this out!" 60 123456789012345678
[Attach files to this message - image.png, video.mp4, etc.]
```

### Management
```
!index          # Lihat semua autopost aktif
!stop 1         # Hentikan autopost index 1
!stop           # Hentikan semua autopost
!ping           # Cek latency
!help           # Manual lengkap
```

## 🔧 Konfigurasi

### Environment Variables
- `DISCORD_TOKEN`: User token Discord Anda
- `WEBHOOK_URL`: URL webhook untuk logging (opsional)

### File Attachments
- **Cara mudah**: Attach files langsung ke pesan command `!post`
- File akan otomatis terdeteksi dan disertakan dalam auto post
- Support semua jenis file (gambar, video, dokumen, dll)
- Tidak perlu path file atau upload manual

### Rich Presence
Edit di `index.js` bagian `setupRichPresence()`:
- Application ID
- Assets URLs
- Button URLs
- Status text

## 📁 Struktur File
```
/workspace/
├── index.js           # Script utama
├── package.json       # Dependencies
├── .env.example       # Template konfigurasi
└── README.md          # Dokumentasi
```

## ⚡ Dependencies
- `discord.js-selfbot-v13`: Library selfbot utama
- Node.js built-in modules: `https`, `fs`, `path`

## 🛡️ Error Handling
- Validasi input command
- Error logging ke webhook
- Graceful shutdown
- Connection error handling
- File attachment validation

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