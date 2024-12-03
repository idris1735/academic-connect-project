import io from 'socket.io-client'

const SOCKET_URL = 'http://localhost:3000'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false
    })

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
    })

    this.socket.connect()
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event)
    }
  }
}

export default new SocketService()


