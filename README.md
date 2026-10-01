# 🏰 Gereja Pintar — Sistem Manajemen Gereja Terpadu

<div align="center">

![Version](https://img.shields.io/badge/version-1.5.30--Beta-orange)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11%2B-red?logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16%2B-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue?logo=typescript&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Bot-25D366?logo=whatsapp&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/license-UNLICENSED-red)

</div>

Platform digital untuk membantu pengelolaan operasional gereja melalui **Admin Dashboard**, **Jemaat Portal**, dan **WhatsApp Bot AI**.

Gereja Pintar dibangun menggunakan **NestJS** untuk server-side dan **Next.js** untuk client-side, dengan **TypeScript**, **JWT authentication**, **Baileys**, **AI lokal**, serta **SQLite + TypeORM** sebagai komponen utama sistem.

> **Current Version: `v1.5.30 Beta 1.50`**
>
> Repository saat ini menggunakan riwayat Git yang telah di-reset menjadi repository baru. Commit history sebelumnya tidak lagi menjadi bagian dari repository saat ini.
>
> **Package / release artifact tidak dibuat pada versi ini.**

---

## 📑 Daftar Isi

- [🎯 Gambaran Umum](#-gambaran-umum)
- [✨ Fitur Utama](#-fitur-utama)
- [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
- [📚 Dokumentasi](#-dokumentasi)
- [📦 Tech Stack](#-tech-stack)
- [📂 Struktur Direktori](#-struktur-direktori)
- [🚀 Quick Start](#-quick-start)
- [🔧 Konfigurasi](#-konfigurasi)
- [🔐 Authentication & Security](#-authentication--security)
- [📡 API](#-api)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🐛 Troubleshooting](#-troubleshooting)
- [📦 Recent Versions](#-recent-versions)
- [📜 Version History](#-version-history)
- [📝 License](#-license)
- [📞 Support & Contact](#-support--contact)

---

## 🎯 Gambaran Umum

**Gereja Pintar** adalah aplikasi sistem manajemen gereja terpadu yang menghubungkan kebutuhan administrasi gereja, portal jemaat, komunikasi WhatsApp, serta berbagai layanan pendukung dalam satu sistem.

### 📊 Admin Dashboard

- Dashboard
- Data Jemaat
- Kartu Keluarga
- Pelayan Gereja
- Keuangan
- Inventaris
- Jadwal
- Absensi
- Notifikasi
- Dokumen
- Statistik Jemaat
- Pengaturan

### 👥 Jemaat Portal

- Registrasi jemaat
- Login
- Pengelolaan profil
- Informasi gereja
- Layanan terintegrasi
- Akses WhatsApp Bot

### 💬 WhatsApp Bot

- QR Code authentication
- Pairing Code
- Chat interaktif
- Command system
- Database lookup
- Session management
- AI integration
- Pengiriman pesan

---

## ✨ Fitur Utama

### 🧑‍💼 Manajemen Gereja

- Jemaat
- Keluarga
- Pelayan
- Keuangan
- Inventaris
- Jadwal
- Absensi
- Notifikasi
- Dokumen
- Statistik
- Pengaturan

### 🔐 Authentication

- Register
- Login
- JWT
- Role & permission
- Tenant protection
- SSO
- Protected API

### 💬 WhatsApp

- QR authentication
- Pairing Code
- Session persistence
- Command handler
- Database lookup
- AI response
- Admin operations

---

## 🏗️ Arsitektur Sistem

Detail arsitektur tidak diletakkan seluruhnya di README.

Dokumentasi utama:

**[`docs/Architecture.md`](docs/Architecture.md)** / **[`docs.gerejapintar.id/Architecture`](docs.gerejapintar.id/Architecture)**

Arsitektur mencakup:

```text
Human
  │
  ▼
Client Side
  │
  ▼
Authentication / SSO
  │
  ▼
Local JWT
  │
  ▼
Protected API
  │
  ├── Jemaat
  ├── Keluarga
  ├── Pelayan
  ├── Jadwal
  ├── Absensi
  ├── Keuangan
  ├── Inventaris
  ├── Notifikasi
  ├── Settings
  ├── Users
  └── WhatsApp
        │
        ▼
     Services
        │
        ▼
   Data Adapter
        │
        ▼
     Database
```

➡️ **[Lihat Architecture.md](docs/Architecture.md)**

---

## 📚 Dokumentasi

Dokumentasi proyek dipusatkan di `docs/`.

| Dokumentasi | Lokasi |
|---|---|
| 🏗️ Architecture | [`docs/Architecture.md`](docs/Architecture.md) |
| 📜 Version History | [`docs/Version-History.md`](docs/Version-History.md) |
| 📚 Dokumentasi lainnya | [`docs/`](docs/) |
| 🖥️ Server Side | [`server_side/README.md`](server_side/README.md) |
| 🎨 Client Side | [`client_side/README.md`](client_side/README.md) |

---

## 📦 Tech Stack

### Server Side

| Technology | Purpose |
|---|---|
| NestJS | REST API |
| Node.js | Runtime |
| TypeScript | Type safety |
| SQLite | Database |
| TypeORM | ORM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Baileys | WhatsApp |
| Xenova Transformers | Local AI |
| Pino | Logging |

### Client Side

| Technology | Purpose |
|---|---|
| Next.js | Web framework |
| React | UI |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| react-qr-code | QR display |
| Context API | State management |
| ESLint | Code quality |

---

## 🚀 Quick Start

### Server Side

```bash
cd server_side
npm install
npm run start:dev
```

Server:

```text
http://localhost:3001
```

### Client Side

```bash
cd client_side
npm install
npm run dev
```

Client:

```text
http://localhost:3000
```

### Akses

| Service | URL |
|---|---|
| 🏠 Home | `http://localhost:3000` |
| 🔐 Login | `http://localhost:3000/auth/login` |
| 📝 Register | `http://localhost:3000/auth/register` |
| 📊 Admin | `http://localhost:3000/admin` |
| 💬 Bot | `http://localhost:3000/bot` |
| 🔌 Server | `http://localhost:3001` |

---

## 🔧 Konfigurasi

### Server Side

`server_side/.env`

```env
NODE_ENV=development
PORT=3001

DATABASE_URL=./database.sqlite
DATABASE_TYPE=better-sqlite3

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=24h

FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

BOT_PREFIX=!

AI_MODEL=Xenova/Qwen1.5-0.5B-Chat
AI_QUANTIZED=true
```

### Client Side

`client_side/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=GerejaPintar
NEXT_PUBLIC_BOT_MESSAGE_DELAY=1000
```

---

## 🔐 Authentication & Security

```text
Login / SSO
    ↓
Authentication Service
    ↓
Local JWT
    ↓
JWT Guard
    ↓
Tenant Guard
    ↓
Role / Permission Guard
    ↓
Protected API
```

Token:

```http
Authorization: Bearer <token>
```

Detail sistem authentication dan SSO:

**[`docs/Architecture.md`](docs/Architecture.md)**

---

## 📡 API

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/profile
```

### Users

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

### WhatsApp

```text
GET  /wa/login-url
GET  /wa/login
GET  /wa/qr-string
POST /wa/request-pairing-code
GET  /wa/disconnect
POST /wa/send-message
```

---

## 🧪 Testing

### Server Side

```bash
cd server_side

npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

### Client Side

```bash
cd client_side

npm run lint
npm run build
```

---

## 🚢 Deployment

### Server Side

```bash
cd server_side

npm run build
npm run start:prod
```

### Client Side

```bash
cd client_side

npm run build
npm run start
```

Pada `v1.5.30 Beta 1.50`, package atau release artifact tidak dibuat.

---

# 📦 Recent Versions

README hanya menampilkan versi terbaru **v1.5.20 sampai v1.5.30**.

## v1.5.30 Beta 1.50

- ⚡ Peningkatan performa sistem
- 🔄 Sistem redirect SSO
- 📥 Perbaikan sistem import
- 📤 Perbaikan sistem export
- 🔐 Penyempurnaan authentication pusat

## v1.5.25 Beta 1.04

- 🎨 Custom theme
- ⛪ Tema untuk hari besar gerejawi
- 🔗 Integrasi dengan GLive
- 🚧 Persiapan integrasi WorshipDeck
- 🛠️ WorshipDeck masih dalam tahap pengembangan

## v1.5.20 Beta 1.11

- ⏰ Pengingat Terintegrasi WhatsApp
- 🔔 Perbaikan Sistem Notifikasi
- 📞 Kontak Petugas
- 📰 Penyempurnaan Berita Jemaat

Untuk sejarah lengkap:

➡️ **[`docs/Version-History.md`](docs/Version-History.md)**

---

## 📝 License

**UNLICENSED**

Gereja Pintar merupakan software proprietary.

---

## 📞 Support & Contact

**Author:** [MoonX388](https://github.com/MoonX388)

**Organization:** Gereja Pintar Initiative

**Email:** support@gerejapintar.id

---

**Current Version:** `v1.5.30 Beta 1.50`  
**Status:** Beta / Active Development  
**Package:** Tidak dibuat
