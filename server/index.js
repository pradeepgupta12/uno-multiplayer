const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const setupGameSocket = require('./socket/gameSocket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// React build serve karo
app.use(express.static(path.join(__dirname, '../client/dist')));

// Sab routes React ko do
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

setupGameSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 UNO Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO ready for connections`);
});