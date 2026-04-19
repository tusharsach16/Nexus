# Nexus Chat App 🚀

A professional, real-time, full-stack chat application built with modern web technologies. This project is designed for scalability and performance, featuring a sleek UI and robust backend architecture.

## ✨ Features

- **Real-time Messaging**: Instant communication powered by Socket.IO.
- **Optimistic UI Updates**: Zero-latency experience using Zustand for state management.
- **Multi-media Sharing**: Share images, videos, and documents with Cloudinary integration.
- **Conversation Management**: Dynamic sorting, unread indicators, and persistence.
- **Authentication**: Secure JWT-based authentication with access and refresh tokens.
- **Scalable Architecture**: Support for Redis-based horizontal scaling.
- **Modern UI/UX**: Built with React, Tailwind CSS, and Framer Motion for smooth animations.

## 🛠 Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Toast Notifications**: React Hot Toast
- **Networking**: Axios & Socket.IO Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Pub-Sub**: Redis (via ioredis)
- **Real-time**: Socket.IO
- **File Storage**: Cloudinary
- **Validation**: Zod
- **Logging**: Morgan

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database
- Redis Instance (Optional, for scaling)
- Cloudinary Account (For file sharing)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nexus-chat-app.git
   cd nexus-chat-app
   ```

2. **Install dependencies for all packages:**
   ```bash
   npm run install:all
   ```

### Configuration

#### Backend Setup
1. Navigate to the `server/` directory and create a `.env` file from the placeholder:
   ```bash
   cd server
   cp .env.example .env
   ```
2. Fill in your credentials in the `.env` file (Database URL, JWT secrets, Cloudinary keys, etc.).

#### Database Migration
Run Prisma migrations to set up your database schema:
```bash
npx prisma migrate dev
```

### Running Locally

From the root directory, start both the backend and frontend concurrently:
```bash
npm run dev
```
- **Backend**: [http://localhost:5000](http://localhost:5000)
- **Frontend**: [http://localhost:5173](http://localhost:5173)

## 🐳 Deployment Guide

### 1. Database (PostgreSQL)
We recommend using **Neon DB** or **Render PostgreSQL**.
- Create a new PostgreSQL database.
- Copy the **Connection String** (External Database URL).
- You will need this for the `DATABASE_URL` environment variable.

### 2. Redis (Upstash)
- Log in to **Upstash** and create a new Redis database.
- Under the "Details" tab, copy the **Redis URL**.
- You will need this for the `REDIS_URL` environment variable.

### 3. Backend (Render)
- Link your GitHub repository to a new **Web Service** on Render.
- Set the following configuration:
  - **Root Directory**: `server`
  - **Environment**: `Node`
  - **Build Command**: `npm install` (The `postinstall` script will automatically run `prisma generate`)
  - **Start Command**: `node src/server.js`
- **Environment Variables**: Add all variables from `server/.env.example`.
  - Set `NODE_ENV` to `production`.
  - Set `FRONTEND_URL` to your Vercel URL once it is live.

### 4. Frontend (Vercel)
- Create a new project on Vercel and link your repository.
- Set the following configuration:
  - **Root Directory**: `client`
  - **Framework Preset**: `Vite`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
- **Environment Variables**: 
  - `VITE_API_URL`: Set this to your Render backend URL (e.g., `https://your-app.onrender.com/api`).
  - `VITE_SOCKET_URL`: Set this to your Render backend URL (e.g., `https://your-app.onrender.com`).

---

## 🛠 Required Environment Variables Checklist

| Variable | Platform | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Render | PostgreSQL connection string |
| `REDIS_URL` | Render | Upstash Redis connection string |
| `JWT_ACCESS_SECRET` | Render | Long random string for access tokens |
| `JWT_REFRESH_SECRET` | Render | Long random string for refresh tokens |
| `CLOUDINARY_*` | Render | Cloudinary name, key, and secret |
| `FRONTEND_URL` | Render | Your Vercel domain (e.g., `https://nexus.vercel.app`) |
| `VITE_API_URL` | Vercel | Your Render API URL (e.g., `https://nexus.onrender.com/api`) |
| `VITE_SOCKET_URL` | Vercel | Your Render domain (e.g., `https://nexus.onrender.com`) |

---

## 📄 License

This project is licensed under the ISC License.

---

Made with ❤️ by [Your Name]
