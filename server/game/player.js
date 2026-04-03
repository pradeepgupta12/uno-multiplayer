// player.js - Player model

/**
 * Create a new player object
 */
function createPlayer(socketId, name) {
  return {
    id: socketId,
    name: name || `Player_${socketId.slice(0, 4)}`,
    hand: [],
    isHost: false,
    saidUno: false
  };
}

module.exports = { createPlayer };
