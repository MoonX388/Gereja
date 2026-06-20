# 🏰 Gereja Digital - Sistem Manajemen Gereja Terpadu

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![NestJS](https://img.shields.io/badge/NestJS-11+-red)
![Next.js](https://img.shields.io/badge/Next.js-16+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/license-UNLICENSED-red)

Platform digital komprehensif untuk manajemen gereja modern yang menggabungkan sistem admin dashboard, WhatsApp bot AI, dan jemaat portal. Dibangun dengan **NestJS** (backend) dan **Next.js** (frontend) dengan **TypeScript** penuh, real-time state management, dan local database SQLite.

---

## 📑 Daftar Isi

1. [🎯 Gambaran Umum](#-gambaran-umum)
2. [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
3. [📦 Tech Stack](#-tech-stack)
4. [📂 Struktur Direktori](#-struktur-direktori)
5. [🚀 Quick Start](#-quick-start)
6. [🔧 Konfigurasi](#-konfigurasi)
7. [📚 Backend Documentation](#-backend-documentation)
8. [🎨 Frontend Documentation](#-frontend-documentation)
9. [🤖 WhatsApp Bot Documentation](#-whatsapp-bot-documentation)
10. [📊 Database Schema](#-database-schema)
11. [🔐 Authentication & Security](#-authentication--security)
12. [📡 API Endpoints](#-api-endpoints)
13. [🧪 Testing](#-testing)
14. [🚢 Deployment](#-deployment)
15. [🐛 Troubleshooting](#-troubleshooting)
16. [📝 License](#-license)

---

## 🎯 Gambaran Umum

**Gereja Digital** adalah solusi manajemen gereja terintegrasi yang menyediakan:

### 📊 **Admin Dashboard** (Next.js + React Context)
- Manajemen jemaat (anggota gereja)
- Manajemen staf/pelayan
- Sistem keuangan/akuntansi
- Manajemen inventaris/aset
- Penjadwalan acara/kegiatan
- Tracking kehadiran
- Sistem notifikasi broadcast
- Laporan dan export data
- Pengaturan sistem

### 🤖 **WhatsApp Bot AI** (NestJS + Baileys + Xenova Transformers)
- Chat interaktif dengan AI lokal (Qwen 1.5 0.5B)
- Integrasi WhatsApp via QR Code/Pairing Code
- Respon cepat dengan model quantized
- Lookup database jemaat untuk konteks personal
- Prefix-based commands untuk admin
- Session management dengan localStorage

### 👥 **Jemaat Portal** (Next.js)
- Registrasi jemaat baru
- Login dengan email/username
- Profile management
- Akses informasi gereja
- Navigasi ke bot WhatsApp

### 💾 **Database** (SQLite + TypeORM)
- Data jemaat lengkap
- User accounts dengan role-based access
- Secure password hashing (bcrypt)
- Timestamp tracking (created/updated)

---

## 🏗️ Arsitektur Sistem

### Overall Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
├──────────────────┬──────────────────┬───────────────────┤
│  Admin Dashboard │  Jemaat Portal   │  WhatsApp Web UI  │
│   (Next.js)      │   (Next.js)      │   (Browser)       │
└────────┬─────────┴────────┬─────────┴────────┬──────────┘
         │                  │                   │
         └──────────────────┼───────────────────┘
                            │ HTTP/REST API
         ┌──────────────────┴───────────────────┐
         │      BACKEND LAYER (NestJS)          │
         ├──────────────────────────────────────┤
         │  • Auth Service (JWT)                │
         │  • Users Service (User Management)   │
         │  • Bot Service (Baileys Integration) │
         │  • AI Service (Text Generation)      │
         └──────────────────┬───────────────────┘
                            │
         ┌──────────────────┴───────────────────┐
         │   DATA LAYER (SQLite + TypeORM)      │
         ├──────────────────────────────────────┤
         │  database.sqlite                     │
         │  └─ User Entity                      │
         │  └─ (Extensible untuk data lain)    │
         └──────────────────────────────────────┘
```

### Data Flow
```
User Login → Backend Auth → JWT Token → localStorage
                ↓
         API Call dengan Token
                ↓
      Backend validasi JWT
                ↓
      Akses protected endpoints
                ↓
      Frontend render UI
```

### Bot Flow
```
User kirim WhatsApp → Baileys receive → Bot Service
                ↓
        Parse command/message
                ↓
        Lookup database (jika diperlukan)
                ↓
        Generate response (AI atau predefined)
                ↓
        Send balik ke WhatsApp
```

---

## 📦 Tech Stack

### Backend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | NestJS | 11.0+ | REST API Framework |
| **Runtime** | Node.js | 18+ | JavaScript Runtime |
| **Language** | TypeScript | 5.0+ | Type Safety |
| **Database** | SQLite | 3 | Lightweight DB |
| **ORM** | TypeORM | 1.0+ | Database Mapper |
| **Authentication** | JWT | via @nestjs/jwt | Token-based Auth |
| **Password** | bcrypt | 6.0+ | Password Hashing |
| **WhatsApp** | Baileys | 6.7+ | WhatsApp Web API |
| **AI** | Xenova Transformers | 2.17+ | Local AI Models |
| **Logger** | Pino | 8.17+ | Structured Logging |
| **CLI** | NestJS CLI | 11.0+ | Development Tools |

### Frontend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 16.2+ | React Framework |
| **Runtime** | Node.js | 18+ | JavaScript Runtime |
| **Language** | TypeScript | 5.0+ | Type Safety |
| **UI Library** | React | 19.2+ | Component Library |
| **Styling** | Tailwind CSS | 4.0+ | Utility-first CSS |
| **HTTP** | Axios | 1.16+ | HTTP Client |
| **QR Code** | react-qr-code | 2.0+ | QR Display |
| **State Mgmt** | Context API | Built-in | Local State |
| **Linting** | ESLint | 9+ | Code Quality |

### Shared
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Language** | TypeScript | 5.0+ | Type Safety |
| **Package Mgr** | npm | 8+ | Dependency Management |
| **Version Control** | Git | - | Code Management |

---

## 📂 Struktur Direktori

```
gereja/
│
├── 📄 README.md                          # File ini (root README)
├── 📄 .gitignore                         # Git ignore rules
│
├── 📂 backend/                           # NestJS Backend
│   ├── 📄 package.json                   # Dependencies
│   ├── 📄 tsconfig.json                  # TS Config
│   ├── 📄 nest-cli.json                  # NestJS CLI Config
│   ├── 📄 eslint.config.mjs              # ESLint Config
│   ├── 📄 README.md                      # Backend Docs
│   │
│   ├── 📂 src/                           # Source Code
│   │   ├── 📄 main.ts                    # Entry Point (Port 3001)
│   │   ├── 📄 app.module.ts              # Root Module
│   │   │
│   │   ├── 📂 auth/                      # Authentication Module
│   │   │   ├── 📄 auth.module.ts         # Module definition
│   │   │   ├── 📄 auth.service.ts        # Business logic
│   │   │   ├── 📄 auth.controller.ts     # Endpoints
│   │   │   ├── 📄 jwt.strategy.ts        # JWT Strategy
│   │   │   ├── 📄 admin.guard.ts         # Admin Guard (unused in dev)
│   │   │   └── 📂 dto/
│   │   │       ├── 📄 login.dto.ts       # Login DTO
│   │   │       └── 📄 register.dto.ts    # Register DTO
│   │   │
│   │   ├── 📂 users/                     # User Management Module
│   │   │   ├── 📄 users.module.ts        # Module definition
│   │   │   ├── 📄 users.service.ts       # Business logic
│   │   │   ├── 📄 users.controller.ts    # Endpoints
│   │   │   └── 📄 user.entity.ts         # User Entity
│   │   │
│   │   ├── 📂 entity/                    # Entities (Models)
│   │   │   ├── 📄 user.entity.ts         # User Entity
│   │   │   └── 📄 token.entity.ts        # Token Entity
│   │   │
│   │   ├── 📂 bot/                       # Bot Module
│   │   │   ├── 📄 bot.module.ts          # Module definition
│   │   │   ├── 📄 bot.service.ts         # Baileys Integration
│   │   │   ├── 📄 bot.controller.ts      # Bot Endpoints
│   │   │   ├── 📄 token.service.ts       # Token Management
│   │   │   │
│   │   │   └── 📂 ai/                    # AI Submodule
│   │   │       ├── 📄 ai.module.ts       # Module definition
│   │   │       ├── 📄 ai.service.ts      # Text Generation Logic
│   │   │       └── 📄 ai.interface.ts    # AI Types
│   │   │
│   │   ├── 📂 jemaat/                    # Jemaat Module (placeholder)
│   │   │   └── 📄 jemaat.service.ts
│   │   │
│   │   └── 📂 LenwySesi/                 # Bot Session Storage
│   │       └── (Baileys auth files)
│   │
│   ├── 📂 test/                          # Testing
│   │   └── 📄 app.e2e-spec.ts
│   │
│   └── 📄 database.sqlite                # SQLite Database
│
├── 📂 frontend/                          # Next.js Frontend
│   ├── 📄 package.json                   # Dependencies
│   ├── 📄 tsconfig.json                  # TS Config
│   ├── 📄 next.config.ts                 # Next.js Config
│   ├── 📄 tailwind.config.ts             # Tailwind Config
│   ├── 📄 postcss.config.mjs             # PostCSS Config
│   ├── 📄 eslint.config.mjs              # ESLint Config
│   ├── 📄 next-env.d.ts                  # Next.js Types
│   ├── 📄 README.md                      # Frontend Docs
│   │
│   ├── 📂 app/                           # App Router (Next.js 13+)
│   │   ├── 📄 layout.tsx                 # Root Layout
│   │   ├── 📄 page.tsx                   # Home Page
│   │   │
│   │   ├── 📂 auth/                      # Auth Pages
│   │   │   ├── 📂 login/
│   │   │   │   └── 📄 page.tsx           # Login Page
│   │   │   └── 📂 register/
│   │   │       └── 📄 page.tsx           # Register Page
│   │   │
│   │   ├── 📂 admin/                     # Admin Dashboard (NEW)
│   │   │   ├── 📄 layout.tsx             # Admin Layout Wrapper
│   │   │   ├── 📄 page.tsx               # Main Router
│   │   │   ├── 📄 README.md              # Admin Docs
│   │   │   │
│   │   │   ├── 📂 context/
│   │   │   │   └── 📄 AdminContext.tsx   # State Management
│   │   │   │
│   │   │   ├── 📂 components/
│   │   │   │   ├── 📄 AdminLayout.tsx
│   │   │   │   ├── 📄 Sidebar.tsx
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   └── 📄 Modal.tsx
│   │   │   │
│   │   │   └── 📂 pages/
│   │   │       ├── 📄 Dashboard.tsx
│   │   │       ├── 📄 DataJemaat.tsx
│   │   │       ├── 📄 KartuKeluarga.tsx
│   │   │       ├── 📄 PelayanGereja.tsx
│   │   │       ├── 📄 Keuangan.tsx
│   │   │       ├── 📄 Inventaris.tsx
│   │   │       ├── 📄 Jadwal.tsx
│   │   │       ├── 📄 Absensi.tsx
│   │   │       ├── 📄 Notifikasi.tsx
│   │   │       ├── 📄 Dokumen.tsx
│   │   │       └── 📄 Pengaturan.tsx
│   │   │
│   │   ├── 📂 bot/                       # Bot Pages
│   │   │   ├── 📄 page.tsx               # Bot Main Page
│   │   │   └── 📄 BotLoginClient.tsx     # QR/Pairing UI
│   │   │
│   │   ├── 📂 dashboard/                 # Jemaat Dashboard (placeholder)
│   │   │   └── 📄 page.tsx
│   │   │
│   │   ├── 📂 components/
│   │   │   ├── 📄 dashboard.tsx          # Placeholder
│   │   │   ├── 📄 header.tsx
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📂 dashboard/
│   │   │
│   │   ├── 📂 ui/                        # UI Styles
│   │   │   ├── 📄 globals.css            # Global Styles
│   │   │   ├── 📄 style.css              # Admin Styles
│   │   │   └── 📄 auth.css               # Auth Styles
│   │   │
│   │   └── (legacy pages not in app dir)
│   │
│   ├── 📂 components/                    # Shared Components (legacy)
│   │   └── 📂 dashboard/
│   │
│   ├── 📂 context/                       # Context API (legacy)
│   │
│   ├── 📂 lib/                           # Utilities & Libraries
│   │   ├── 📄 api.ts                     # Axios instance
│   │   └── 📄 auth-context.tsx           # Auth Context (legacy)
│   │
│   ├── 📂 public/                        # Static Assets
│   │   └── (images, icons, etc)
│   │
│   └── 📂 node_modules/                  # Dependencies
│
└── 📂 .git/                              # Git Repository
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 8+
- **Git**
- **WhatsApp Account** (untuk bot)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/MoonX388/Gereja.git
cd gereja
```

#### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env (optional, defaults ada di code)
echo "JWT_SECRET=your_secret_key" > .env
echo "FRONTEND_URL=http://localhost:3000" >> .env

# Run migrations (TypeORM auto-create)
# - Database akan auto-created di database.sqlite

# Start development server
npm run start:dev

# Backend akan jalan di http://localhost:3001
```

#### 3. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" > .env.local

# Start development server
npm run dev

# Frontend akan jalan di http://localhost:3000
```

#### 4. Access Aplikasi
- **Home**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Login**: http://localhost:3000/auth/login
- **Register**: http://localhost:3000/auth/register
- **Bot**: http://localhost:3000/bot

---

## 🔧 Konfigurasi

### Backend Configuration

#### `backend/.env`
```env
# Database
DATABASE_URL=./database.sqlite
DATABASE_TYPE=better-sqlite3

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Bot Config
BOT_PREFIX=!
BOT_ADMIN_PHONE=6282158024074@s.whatsapp.net

# AI Model
AI_MODEL=Xenova/Qwen1.5-0.5B-Chat
AI_QUANTIZED=true

# Port
PORT=3001
```

#### `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Frontend Configuration

#### `frontend/.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=GerejaDigital
NEXT_PUBLIC_BOT_MESSAGE_DELAY=1000
```

#### `frontend/tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        secondary: '#2c5282',
        accent: '#e8c547',
      },
    },
  },
};

export default config;
```

---

## 📚 Backend Documentation

### Module Structure

#### **AuthModule**
Handles user authentication dan authorization.

**Endpoints**:
- `POST /auth/register` - Register user baru
- `POST /auth/login` - Login dengan email/username
- `GET /auth/profile` - Get profile (JWT protected)

**Services**:
- `AuthService` - Authentication logic
- `UsersService` - User management

**Security**:
- JWT tokens dengan expiration
- Password hashing dengan bcrypt
- Role-based access control

**DTO**:
```typescript
// RegisterDto
{
  email: string;
  password: string;
  nama: string;
  gender?: string;
}

// LoginDto
{
  email: string;
  password: string;
}
```

#### **BotModule**
Handles WhatsApp bot integration dan AI.

**Endpoints**:
- `GET /wa/login-url` - Get bot login URL
- `GET /wa/login` - Redirect ke login page
- `GET /wa/qr-string?token=TOKEN` - Get QR untuk scan
- `POST /wa/request-pairing-code` - Request pairing code
- `GET /wa/disconnect` - Disconnect bot
- `POST /wa/send-message` - Send message (admin)

**Services**:
- `BotService` - Baileys integration
- `TokenService` - Token management
- `AiService` - Text generation

**Features**:
- QR Code scanning (default)
- Pairing code method (fallback)
- Session persistence
- AI-powered responses
- Database lookup
- Group management
- Command system

#### **UsersModule**
Manages user/jemaat data.

**Endpoints**:
- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (admin)
- `PUT /users/:id` - Update user (admin)
- `DELETE /users/:id` - Delete user (admin)

**Entity**:
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;
  
  @Column()
  nama: string;
  
  @Column({ nullable: true })
  gender: string;
  
  @Column({ nullable: true })
  alamat: string;
  
  @Column({ nullable: true })
  telepon: string;
  
  @Column({ nullable: true })
  tanggalLahir: string;
  
  @Column({ default: 'Aktif' })
  status: string;
  
  @CreateDateColumn()
  createdAt: Date;
}
```

### Database

#### SQLite Setup
```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Auto-create tables
})
```

#### Creating Entities
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}
```

---

## 🎨 Frontend Documentation

### Admin Dashboard

**Location**: `/app/admin`

Comprehensive church management system dengan 11 modules:

1. **Dashboard** - Statistik & overview
2. **Data Jemaat** - Congregation member management
3. **Kartu Keluarga** - Family card management  
4. **Pelayan Gereja** - Staff/servant management
5. **Keuangan** - Financial tracking
6. **Inventaris** - Asset management
7. **Jadwal** - Event scheduling
8. **Absensi** - Attendance tracking
9. **Notifikasi** - Broadcast notifications
10. **Dokumen** - Reports & export
11. **Pengaturan** - System settings

**Detail** → Lihat [app/admin/README.md](frontend/app/admin/README.md)

### Auth Pages

#### Login Page (`/auth/login`)
- Email/Username input
- Password input
- Remember me checkbox
- Responsive design
- Error messaging

#### Register Page (`/auth/register`)
- Email input
- Password input
- Full name input
- Terms acceptance
- Form validation

### Bot Pages

#### Bot Main Page (`/bot`)
- Bot status display
- QR Code display
- Pairing code input
- Session management
- Real-time status updates

#### Bot Login Client
- QR Polling dengan interval 2 detik
- Pairing code fallback
- Token management
- Auto-connection handling

### Component Architecture

#### Shared Components
- `Header` - Top navigation
- `Loading` - Loading state
- `Dashboard` - Placeholder

#### Admin Components (in `/app/admin/components/`)
- `AdminLayout` - Main wrapper
- `Sidebar` - Navigation menu
- `Header` - Top bar
- `Modal` - Form dialog

#### Auth Components (in `/app/auth/`)
- Login form
- Register form
- Password input
- Email validation

### State Management

#### Auth Context (`lib/auth-context.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const { user, loading, login, logout } = useAuth();
```

#### Admin Context (`app/admin/context/AdminContext.tsx`)
```typescript
const { 
  jemaat, 
  pelayan, 
  keuangan, 
  addJemaat, 
  setCurrentPage 
} = useAdmin();
```

### API Integration

#### Axios Instance (`lib/api.ts`)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Usage
```typescript
import api from '@/lib/api';

// Login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Get profile
const profile = await api.get('/auth/profile');
```

---

## 🤖 WhatsApp Bot Documentation

### Architecture

```
User WhatsApp → Baileys Socket → BotService
                                     ↓
                            Parse command/message
                                     ↓
                            Call AiService (if needed)
                                     ↓
                            Lookup User DB (context)
                                     ↓
                            Generate response
                                     ↓
Send to WhatsApp ← Baileys Socket ← Response
```

### Features

#### 1. **QR Code Authentication**
```typescript
// Default method
// User scan QR → Bot auto-connected
```

#### 2. **Pairing Code Authentication** (Fallback)
```typescript
// If QR fails
// Phone's Settings → Linked Devices → Link a Device
// Enter pairing code from bot
```

#### 3. **AI Response**
```typescript
// Xenova Transformers (local)
// Model: Qwen1.5-0.5B-Chat (500MB, quantized)
// Max tokens: 40 (fast response)
// Temperature: 0.4 (consistent)
```

#### 4. **User Context**
```typescript
// Bot looks up sender phone in DB
// Attaches user info to AI prompt
// Personalized responses
```

#### 5. **Admin Commands**
```bash
!help           # Show available commands
!stats          # Show bot statistics
!broadcast msg  # Send message to all
!status         # Bot connection status
```

### Bot Service Methods

```typescript
// Start bot
async startBot()

// Send message
async sendMessage(jid: string, message: string)

// Disconnect
async disconnect()

// Get QR string
getQrString(): string | null

// Get pairing code
getPairingCode(): string | null

// Handle incoming message
private async handleMessage(message: proto.IWebMessageInfo)
```

### AI Service

```typescript
// Text generation dengan context
async generate(prompt: string, nomorHP: string): Promise<string>

// Lazy loading model (only when needed)
// Runs in local memory (no API calls)
```

### Session Management

**Location**: `backend/LenwySesi/`

Files stored:
- `creds.json` - Authentication credentials
- `pre-key-*.json` - Pre-encryption keys
- `sender-*.json` - Sender keys
- `session-*.json` - Session state

**Auto-restored** on bot restart.

---

## 📊 Database Schema

### User Entity

```sql
CREATE TABLE "user" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR UNIQUE,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  nama VARCHAR NOT NULL,
  gender VARCHAR,
  baptis VARCHAR,
  alamat VARCHAR,
  telepon VARCHAR,
  jenisKelamin VARCHAR,
  tanggalLahir VARCHAR,
  tempatLahir VARCHAR,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  nikah VARCHAR,
  pekerjaan VARCHAR,
  status VARCHAR DEFAULT 'Aktif',
  role VARCHAR DEFAULT 'user'
);
```

### Admin Local Storage

**Prefix**: `gd_` (GerejaDigital)

Keys:
- `gd_jemaat` - Congregation members
- `gd_pelayan` - Church staff
- `gd_keuangan` - Financial records
- `gd_inventaris` - Inventory items
- `gd_keluarga` - Family cards
- `gd_jadwal` - Event schedules
- `gd_absensi` - Attendance records
- `gd_notifikasi` - Notifications
- `gd_settings` - System settings

---

## 🔐 Authentication & Security

### JWT Strategy

```typescript
// Payload
{
  sub: userId,
  email: userEmail,
  role: userRole,
  iat: issuedAt,
  exp: expiresAt
}

// Token location
Header: Authorization: Bearer TOKEN

// Verification
@UseGuards(AuthGuard('jwt'))
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

### Password Security

```typescript
// Hashing (Registration)
const hashedPassword = await bcrypt.hash(password, 10);

// Verification (Login)
const isValid = await bcrypt.compare(password, hashedPassword);
```

### CORS Setup

```typescript
// backend/main.ts
app.enableCors("*"); // Allow all origins (development)

// Production: specify origins
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### Dev Mode Bypass

```typescript
// admin/layout.tsx
if (process.env.NODE_ENV === 'development') {
  setIsAdminVerified(true); // Skip auth in dev
  return;
}
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/profile` | JWT | Get user profile |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | Admin | List all users |
| GET | `/users/:id` | Admin | Get user by ID |
| POST | `/users` | Admin | Create user |
| PUT | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |

### Bot

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/wa/login-url` | No | Get bot login URL |
| GET | `/wa/login` | No | Redirect to login |
| GET | `/wa/qr-string` | Token | Get QR code |
| POST | `/wa/request-pairing-code` | Token | Request pairing code |
| GET | `/wa/disconnect` | Admin | Disconnect bot |
| POST | `/wa/send-message` | Admin | Send message |

---

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Frontend Testing

```bash
cd frontend

# Build check
npm run build

# Lint check
npm run lint
```

### Manual Testing

#### Test Login Flow
```bash
# 1. Register
POST http://localhost:3001/auth/register
{
  "email": "test@example.com",
  "password": "test123456",
  "nama": "Test User"
}

# 2. Login
POST http://localhost:3001/auth/login
{
  "email": "test@example.com",
  "password": "test123456"
}

# 3. Get Profile
GET http://localhost:3001/auth/profile
Header: Authorization: Bearer <token>
```

#### Test Bot Flow
```bash
# 1. Get login URL
GET http://localhost:3001/wa/login-url

# 2. Get QR
GET http://localhost:3001/wa/qr-string?token=<token>

# 3. Scan & send message via WhatsApp
```

---

## 🚢 Deployment

### Build for Production

#### Backend
```bash
cd backend

# Build
npm run build

# Optimize
npm run lint

# Output: dist/ folder
```

#### Frontend
```bash
cd frontend

# Build
npm run build

# Output: .next/ folder
# Static export (if needed)
npm run build -- --experimental-app-only
```

### Environment Setup (Production)

#### `backend/.env`
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=<strong_random_secret>
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=./database.sqlite
```

#### `frontend/.env.production`
```env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=GerejaDigital
```

### Hosting Options

#### Option 1: Vercel (Frontend) + Railway (Backend)
```bash
# Frontend → Vercel
vercel deploy

# Backend → Railway
railway deploy
```

#### Option 2: Docker Compose (All-in-one)

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend/database.sqlite:/app/database.sqlite

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:3001
    depends_on:
      - backend
```

**Run**:
```bash
docker-compose up -d
```

#### Option 3: Linux Server (with PM2)

**Backend**:
```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start dist/main.js --name "gereja-backend"

# Start frontend
pm2 start npm --name "gereja-frontend" -- run start

# Monit
pm2 monit
```

---

## 🐛 Troubleshooting

### Backend Issues

#### Error: `Cannot find module 'better-sqlite3'`
```bash
# Solution
npm rebuild better-sqlite3

# Or reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Error: `Port 3001 already in use`
```bash
# Kill process
lsof -i :3001
kill -9 <PID>

# Or change port
PORT=3002 npm run start:dev
```

#### Error: `JWT token expired`
```bash
# Solution: Increase JWT_EXPIRATION
JWT_EXPIRATION=48h npm run start:dev
```

### Frontend Issues

#### Error: `Cannot find module 'axios'`
```bash
npm install axios
```

#### Error: `NEXT_PUBLIC_BACKEND_URL not found`
```bash
# Create .env.local
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" > .env.local

# Or inline during build
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001 npm run build
```

#### Error: `CORS error from backend`
```typescript
// backend/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### Bot Issues

#### Error: `QR code not updating`
```typescript
// Increase polling interval
const pollInterval = setInterval(() => {
  // Fetch QR
}, 2000); // was 1000
```

#### Error: `Bot not responding to messages`
```bash
# Check session
ls -la backend/LenwySesi/

# Clear session & restart
rm -rf backend/LenwySesi/*
npm run start:dev
```

#### Error: `AI model too slow`
```typescript
// Reduce max_new_tokens
const result = await generator(prompt, {
  max_new_tokens: 20, // was 40
  temperature: 0.7, // increase for faster response
});
```

---

## 📝 License

UNLICENSED - Proprietary software

Dilarang untuk digunakan, disalin, dimodifikasi, atau didistribusikan tanpa izin tertulis dari pemilik.

---

## 📞 Support & Contact

### Issues & Bug Reports
Buat issue di GitHub:
https://github.com/MoonX388/Gereja/issues

### Feature Requests
Silakan diskusikan di:
https://github.com/MoonX388/Gereja/discussions

### Contact
**Author**: [MoonX388](https://github.com/MoonX388)
**Organization**: Gereja Digital Initiative
**Email**: support@gerejadigital.id

---

## 🎯 Roadmap

### v1.1 (Coming Soon)
- [ ] Data backup/restore
- [ ] Multi-language support (ID/EN)
- [ ] Dark mode UI
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS integration

### v1.2 (Future)
- [ ] Real-time analytics
- [ ] Advanced reporting
- [ ] Calendar integration
- [ ] Video streaming for services
- [ ] Donation/giving system
- [ ] Member mobile app

### v2.0 (Long Term)
- [ ] Multi-location support
- [ ] Advanced CRM features
- [ ] AI-powered insights
- [ ] Blockchain for records
- [ ] IoT integration

---

## 📚 Additional Resources

### Official Documentation
- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [TypeORM Docs](https://typeorm.io)
- [Baileys Wiki](https://github.com/WhiskeySockets/Baileys)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Tutorials
- [NestJS Tutorial](https://docs.nestjs.com/first-steps)
- [Next.js App Router](https://nextjs.org/docs/app/getting-started/installation)
- [REST API Design](https://restfulapi.net)
- [JWT Authentication](https://jwt.io/introduction)

### Tools
- [Postman](https://www.postman.com) - API Testing
- [VS Code](https://code.visualstudio.com) - Code Editor
- [Docker Desktop](https://www.docker.com/products/docker-desktop) - Containerization
- [Git](https://git-scm.com) - Version Control

---

## 🎉 Thank You

Terima kasih telah menggunakan Gereja Digital! Kami berharap sistem ini membantu gereja Anda dalam manajemen operasional yang lebih efisien.

**Happy Coding! 💻**

---

**Last Updated**: June 18, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

