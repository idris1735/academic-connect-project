const { Server } = require('socket.io');
const { admin } = require('../config/firebase');

class SocketService {
  constructor() {
    this.io = null;
  }

  initialize(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? 'https://your-domain.com' 
          : 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('authenticate', this.handleAuthentication(socket));
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  handleAuthentication(socket) {
    return async (token) => {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        socket.userId = decodedToken.uid;
        socket.join(`user_${decodedToken.uid}`);
        console.log('Socket authenticated for user:', decodedToken.uid);
      } catch (error) {
        console.error('Socket authentication failed:', error);
        socket.disconnect();
      }
    };
  }

  handleDisconnect(socket) {
    return () => {
      console.log('Client disconnected:', socket.id);
      if (socket.userId) {
        socket.leave(`user_${socket.userId}`);
      }
    };
  }

  emitToUser(userId, event, data) {
    if (!this.io) {
      console.warn('Socket.IO not initialized');
      return;
    }
    this.io.to(`user_${userId}`).emit(event, data);
  }
}

// Create and export singleton instance
const socketService = new SocketService();
module.exports = socketService; 