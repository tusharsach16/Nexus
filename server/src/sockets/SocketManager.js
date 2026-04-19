import chatService from '../services/ChatService.js';
import userService from '../services/UserService.js';
import redis from '../config/redis.js';

class SocketManager {
  constructor(io) {
    this.io = io;
    this.REDIS_KEY = 'nexus:online_users';
  }

  init() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join', async (userId) => {
        socket.userId = userId; // Store on socket instance
        socket.join(userId);
        
        if (redis) {
          await redis.sadd(this.REDIS_KEY, userId);
          const onlineUsers = await redis.smembers(this.REDIS_KEY);
          this.io.emit('online_users', onlineUsers);
        }
        
        this.io.emit('user_online', userId);
        console.log(`User ${userId} is online`);
      });

      socket.on('message_seen', async (data) => {
        const { conversationId, messageId, userId } = data;
        try {
          await chatService.markAsSeen(conversationId, userId);
          socket.to(conversationId).emit('message_seen', { conversationId, messageId, userId });
        } catch (error) {
          console.error('Failed to mark message as seen');
        }
      });

      socket.on('send_message', async (data) => {
        const { senderId, conversationId, content, type, receiverId, isGroup, ...rest } = data;
        
        try {
          const message = await chatService.sendMessage(senderId, conversationId, content, type, rest);
          
          if (isGroup) {
            this.io.to(conversationId).emit('receive_message', message);
          } else {
            // Direct message: send to both sender and receiver rooms
            this.io.to(receiverId).to(senderId).emit('receive_message', message);
          }
        } catch (error) {
          console.error("Socket send_message error:", error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
      });

      socket.on('typing_start', (data) => {
        const { conversationId, userId } = data;
        socket.to(conversationId).emit('typing_start', { conversationId, userId });
      });

      socket.on('typing_stop', (data) => {
        const { conversationId, userId } = data;
        socket.to(conversationId).emit('typing_stop', { conversationId, userId });
      });

      socket.on('disconnect', async () => {
        try {
          const userId = socket.userId;
          if (userId) {
            if (redis) {
              await redis.srem(this.REDIS_KEY, userId);
              const onlineUsers = await redis.smembers(this.REDIS_KEY);
              this.io.emit('online_users', onlineUsers);
            }
            this.io.emit('user_offline', userId);
            await userService.updateLastSeen(userId);
            console.log(`User ${userId} is offline and lastSeen updated`);
          }
        } catch (error) {
          console.error('Socket disconnect error handling failed:', error);
        }
      });
    });
  }
}

export default SocketManager;
