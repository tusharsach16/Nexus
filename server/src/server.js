import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import app from './app.js';
import redis from './config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO with CORS and Redis Adapter (if available)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

if (redis) {
  const pubClient = redis;
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Socket.IO Redis adapter attached');
}

// Global IO instance for use in controllers/services
app.set('io', io);

// Socket initialization
import SocketManager from './sockets/SocketManager.js';
const socketManager = new SocketManager(io);
socketManager.init();

server.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
