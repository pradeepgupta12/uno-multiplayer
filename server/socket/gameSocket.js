// gameSocket.js - Socket.IO event handlers for the UNO game
const {
  joinRoom,
  leaveRoom,
  startGame,
  playCard,
  drawCard,
  chooseColor,
  sayUno,
  getStateForPlayer,
  getRoom
} = require('../game/gameManager');

/**
 * Broadcast updated game state to all players in a room
 */
function broadcastGameState(io, roomId) {
  const room = getRoom(roomId);
  if (!room) return;

  room.players.forEach(player => {
    const playerState = getStateForPlayer(room, player.id);
    io.to(player.id).emit('gameState', playerState);
  });
}

module.exports = function setupGameSocket(io) {
  io.on('connection', (socket) => {
    console.log(`✅ Player connected: ${socket.id}`);

    let currentRoomId = null;

    // ─── JOIN ROOM ──────────────────────────────────────────────
    socket.on('joinRoom', ({ roomId, playerName }) => {
      if (!roomId) return socket.emit('error', { message: 'Room ID required' });

      currentRoomId = roomId;
      socket.join(roomId);

      const room = joinRoom(roomId, socket.id, playerName);
      console.log(`👤 ${playerName} joined room ${roomId}`);

      broadcastGameState(io, roomId);

      // Notify room that a new player joined
      io.to(roomId).emit('playerJoined', {
        playerName,
        playerId: socket.id,
        playerCount: room.players.length
      });
    });

    // ─── START GAME ─────────────────────────────────────────────
    socket.on('startGame', ({ roomId }) => {
      const result = startGame(roomId, socket.id);

      if (result.error) {
        return socket.emit('error', { message: result.error });
      }

      console.log(`🎮 Game started in room ${roomId}`);
      broadcastGameState(io, roomId);
      io.to(roomId).emit('gameStarted', { message: 'Game has started!' });
    });

    // ─── PLAY CARD ───────────────────────────────────────────────
    socket.on('playCard', ({ roomId, cardId }) => {
      const result = playCard(roomId, socket.id, cardId);

      if (result.error) {
        return socket.emit('error', { message: result.error });
      }

      console.log(`🃏 Card played in room ${roomId}`);

      // Broadcast to all players
      broadcastGameState(io, roomId);

      // Notify about card played
      const room = getRoom(roomId);
      const topCard = room ? room.discardPile[room.discardPile.length - 1] : null;
      io.to(roomId).emit('cardPlayed', {
        playerId: socket.id,
        card: topCard,
        waitingForColor: result.waitingForColor || false
      });

      // Check winner
      if (result.winner) {
        io.to(roomId).emit('gameOver', {
          winner: result.winner,
          message: `${result.winner.name} wins! 🎉`
        });
      }
    });

    // ─── DRAW CARD ───────────────────────────────────────────────
    socket.on('drawCard', ({ roomId }) => {
      const result = drawCard(roomId, socket.id);

      if (result.error) {
        return socket.emit('error', { message: result.error });
      }

      broadcastGameState(io, roomId);

      socket.emit('cardDrawn', {
        card: result.drawnCard,
        canPlay: result.canPlayDrawn
      });
    });

    // ─── CHOOSE COLOR ────────────────────────────────────────────
    socket.on('chooseColor', ({ roomId, color }) => {
      const result = chooseColor(roomId, socket.id, color);

      if (result.error) {
        return socket.emit('error', { message: result.error });
      }

      console.log(`🎨 Color chosen: ${color} in room ${roomId}`);
      broadcastGameState(io, roomId);

      io.to(roomId).emit('colorChosen', { color, playerId: socket.id });

      // Check winner
      if (result.winner) {
        io.to(roomId).emit('gameOver', {
          winner: result.winner,
          message: `${result.winner.name} wins! 🎉`
        });
      }
    });

    // ─── SAY UNO ────────────────────────────────────────────────
    socket.on('sayUno', ({ roomId }) => {
      const result = sayUno(roomId, socket.id);

      if (result.error) {
        return socket.emit('error', { message: result.error });
      }

      const player = result.players.find(p => p.id === socket.id);
      io.to(roomId).emit('unoSaid', {
        playerId: socket.id,
        playerName: player?.name
      });
    });

    // ─── DISCONNECT ──────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`❌ Player disconnected: ${socket.id}`);

      if (currentRoomId) {
        const room = leaveRoom(currentRoomId, socket.id);

        if (room) {
          broadcastGameState(io, currentRoomId);
          io.to(currentRoomId).emit('playerLeft', {
            playerId: socket.id,
            playerCount: room.players.length
          });
        }
      }
    });
  });
};
