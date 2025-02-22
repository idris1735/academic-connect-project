const WebSocket = require('ws');

class WebSocketService {
  constructor() {
    this.wss = null;
  }

  initialize(httpServer) {
    this.wss = new WebSocket.Server({ server: httpServer });

    this.wss.on('connection', (ws) => {
      console.log('Client connected:', ws._socket.remoteAddress);

      ws.on('message', (message) => {
        console.log('Received:', message);
        // Handle incoming messages here
        this.handleMessage(ws, message);
      });

      ws.on('close', () => {
        console.log('Client disconnected:', ws._socket.remoteAddress);
      });
    });
  }

  handleMessage(ws, message) {
    // Parse the message and handle it accordingly
    const data = JSON.parse(message);
    switch (data.type) {
      case 'authenticate':
        this.handleAuthentication(ws, data.token);
        break;
      // Add more cases for different message types as needed
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  handleAuthentication(ws, token) {
    // Implement your authentication logic here
    // For example, verify the token and store user information in the WebSocket instance
    console.log('Authenticating user with token:', token);
    // After successful authentication, you can join the user to a specific channel
  }

  emitToUser(userId, event, data) {
    if (!this.wss) {
      console.warn('WebSocket server not initialized');
      return;
    }

    // Broadcast to a specific user
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.userId === userId) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  }
}

// Create and export singleton instance
const SocketService = new WebSocketService();
module.exports = SocketService; 