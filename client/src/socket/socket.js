// socket/socket.js - Socket.IO client singleton
import { io } from 'socket.io-client';

// Connect to backend server
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('🔌 Connected to server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from server');
});

export default socket;
