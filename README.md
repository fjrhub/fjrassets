
# FJR Assets

**FJR Assets** adalah aplikasi portfolio dan core dashboard modern yang dibangun dengan performa tinggi dan arsitektur yang scalable. Proyek ini mengintegrasikan berbagai teknologi terkini untuk menyediakan pengalaman pengguna yang mulus, manajemen data yang efisien, serta fitur real-time.

## ✨ Fitur Utama

- 🚀 **Next.js 16 & React 19**: Menggunakan App Router terbaru dengan React 19 untuk rendering yang optimal.
- 🎨 **UI Modern**: Didesain dengan Tailwind CSS 4 dan komponen shadcn/ui (Radix UI) yang aksesibel dan estetis.
- 🌐 **Internationalization (i18n)**: Dukungan multi-bahasa menggunakan `next-intl`.
- 🔐 **Authentication**: Manajemen sesi dan autentikasi yang aman menggunakan `next-auth`.
- 📊 **Dashboard & Visualisasi**: Fitur dashboard inti dengan grafik interaktif menggunakan `recharts` dan tabel data yang powerful dengan `@tanstack/react-table`.
- 📝 **Markdown Editor**: Terintegrasi dengan `@mdxeditor/editor` untuk manajemen konten yang fleksibel.
- ⚡ **State Management**: Manajemen state global yang ringan dan efisien menggunakan `zustand` dan `@tanstack/react-query`.
- 🔄 **Real-time Support**: Contoh implementasi WebSocket untuk komunikasi real-time.
- 🗄️ **Database ORM**: Integrasi database yang aman dan type-safe menggunakan `prisma`.
- 🎬 **Animasi**: Transisi dan animasi yang halus menggunakan `framer-motion`.

## 🛠️ Tech Stack

| Kategori | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 16, React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, CSS Modules |
| **UI Components** | shadcn/ui, Radix UI, Lucide Icons |
| **Runtime** | Bun |
| **Database** | Prisma ORM |
| **State & Data** | Zustand, TanStack Query, TanStack Table |
| **Auth** | NextAuth.js |
| **Animation** | Framer Motion |
| **Server/Proxy** | Caddy Server |

## 📂 Struktur Proyek

```bash
.
├── db/                  # Konfigurasi dan file terkait database
├── examples/
│   └── websocket/       # Contoh implementasi WebSocket
├── mini-services/       # Layanan kecil atau microservices
├── prisma/              # Schema Prisma dan migrasi database
├── public/              # Aset statis (gambar, font, dll)
├── src/
│   ├── app/             # Next.js App Router (Halaman & API Routes)
│   ├── components/      # Komponen UI yang dapat digunakan kembali
│   ├── hooks/           # Custom React Hooks
│   └── lib/             # Utilitas, konfigurasi, dan helper functions
├── Caddyfile            # Konfigurasi reverse proxy Caddy
├── next.config.ts       # Konfigurasi Next.js
├── tailwind.config.ts   # Konfigurasi Tailwind CSS
└── package.json         # Dependensi dan scripts
```

## 🚀 Memulai (Getting Started)

Pastikan Anda telah menginstal **Bun** di sistem Anda. Jika belum, Anda dapat menginstalnya melalui:
```bash
curl -fsSL https://bun.sh/install | bash
```

### 1. Instalasi Dependensi
Clone repository ini dan instal dependensi menggunakan Bun:
```bash
git clone https://github.com/fjrhub/fjrassets.git
cd fjrassets
bun install
```

### 2. Konfigurasi Environment Variables
Salin file `.env.example` (jika ada) atau buat file `.env` di root direktori dan sesuaikan variabel lingkungan yang diperlukan (seperti `DATABASE_URL`, `NEXTAUTH_SECRET`, dll).

### 3. Setup Database
Jalankan perintah berikut untuk membuat schema database dan generate Prisma Client:
```bash
# Generate Prisma Client
bun run db:generate

# Push schema ke database (Development)
bun run db:push

# ATAU jalankan migrasi
bun run db:migrate
```

### 4. Menjalankan Development Server
Jalankan server development:
```bash
bun run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📜 Scripts yang Tersedia

Berikut adalah beberapa script utama yang dapat Anda gunakan:

- `bun run dev`: Menjalankan server development di port 3000 dengan logging ke `dev.log`.
- `bun run build`: Membangun aplikasi untuk produksi (standalone output).
- `bun run start`: Menjalankan server produksi menggunakan Bun.
- `bun run lint`: Menjalankan ESLint untuk memeriksa kode.
- `bun run db:push`: Mendorong perubahan schema Prisma ke database.
- `bun run db:generate`: Menghasilkan Prisma Client.
- `bun run db:migrate`: Menjalankan migrasi database Prisma.
- `bun run db:reset`: Mereset database (hapus data dan migrasi ulang).

## 🌐 Deployment (Caddy Server)

Proyek ini dikonfigurasi untuk menggunakan **Caddy** sebagai reverse proxy. File `Caddyfile` telah diatur untuk meneruskan request ke aplikasi Next.js yang berjalan di `localhost:3000`.

Untuk deployment produksi:
1. Build aplikasi: `bun run build`
2. Jalankan aplikasi: `bun run start`
3. Jalankan Caddy Server di direktori root (pastikan Caddy telah terinstal):
   ```bash
   caddy run
   ```

Caddy akan secara otomatis menangani HTTPS jika domain dikonfigurasi dengan benar.

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda memiliki saran atau perbaikan, silakan buat *fork* dari repository ini dan ajukan *pull request*.

1. Fork Proyek
2. Buat Branch Fitur Anda (`git checkout -b feature/AmazingFeature`)
3. Commit Perubahan Anda (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push ke Branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---
Dibuat dengan ❤️ oleh [fjrhub](https://github.com/fjrhub)
