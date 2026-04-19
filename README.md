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

## 🐳 Deployment

1. **Database**: Use a managed PostgreSQL service like Neon, AWS RDS, or Railway.
2. **Backend**: Deploy the `server/` directory to platforms like Render, Heroku, or DigitalOcean.
3. **Frontend**: Build the React app and deploy to Vercel, Netlify, or AWS Amplify.
   ```bash
   npm run build --prefix client
   ```
4. **Environment Variables**: Ensure all variables from `.env.example` are set in your production environment.

## 📄 License

This project is licensed under the ISC License.

---

Made with ❤️ by [Your Name]
