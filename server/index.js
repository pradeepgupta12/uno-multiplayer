// server/index.js - Main server entry point
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const setupGameSocket = require('./socket/gameSocket');

const app = express();
const server = http.createServer(app);

// Allow all origins for dev (restrict in production)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'UNO Game Server Running 🎮', port: PORT });
});

// Setup all Socket.IO game events
setupGameSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 UNO Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO ready for connections\n`);
});
