// gameManager.js - Manages all active game rooms
const { generateDeck, drawCards } = require('./deck');
const { isValidMove, applyCardEffect, checkWinner } = require('./rules');
const { createPlayer } = require('./player');

// In-memory store for all rooms
const rooms = {};

/**
 * Get or create a room
 */
function getRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      players: [],
      deck: [],
      discardPile: [],
      currentPlayerIndex: 0,
      direction: 1,
      currentColor: null,
      currentValue: null,
      gameStarted: false,
      winner: null,
      waitingForColor: false // True when wild card played, waiting for color choice
    };
  }
  return rooms[roomId];
}

/**
 * Add a player to a room
 */
function joinRoom(roomId, socketId, playerName) {
  const room = getRoom(roomId);

  // Prevent duplicate joins
  if (room.players.find(p => p.id === socketId)) return room;

  const player = createPlayer(socketId, playerName);

  // First player is host
  if (room.players.length === 0) {
    player.isHost = true;
  }

  room.players.push(player);
  return room;
}

/**
 * Remove player from room
 */
function leaveRoom(roomId, socketId) {
  if (!rooms[roomId]) return null;
  const room = rooms[roomId];
  room.players = room.players.filter(p => p.id !== socketId);

  // Assign new host if needed
  if (room.players.length > 0 && !room.players.find(p => p.isHost)) {
    room.players[0].isHost = true;
  }

  // Clean up empty rooms
  if (room.players.length === 0) {
    delete rooms[roomId];
    return null;
  }

  return room;
}

/**
 * Start the game - deal cards and set initial state
 */
function startGame(roomId, socketId) {
  const room = getRoom(roomId);

  // Only host can start
  const host = room.players.find(p => p.id === socketId);
  if (!host || !host.isHost) return { error: 'Only the host can start the game' };

  if (room.players.length < 2) return { error: 'Need at least 2 players to start' };

  // Generate and shuffle deck
  room.deck = generateDeck();
  room.discardPile = [];

  // Deal 7 cards to each player
  room.players.forEach(player => {
    player.hand = [];
    player.saidUno = false;
    for (let i = 0; i < 7; i++) {
      player.hand.push(room.deck.pop());
    }
  });

  // Place first card on discard pile (must be a number card to start)
  let startCard;
  do {
    startCard = room.deck.pop();
    if (startCard.type !== 'number') {
      room.deck.unshift(startCard); // Put back at bottom
      startCard = null;
    }
  } while (!startCard);

  room.discardPile.push(startCard);
  room.currentColor = startCard.color;
  room.currentValue = startCard.value;
  room.currentPlayerIndex = 0;
  room.direction = 1;
  room.gameStarted = true;
  room.winner = null;
  room.waitingForColor = false;

  return room;
}

/**
 * Play a card
 */
function playCard(roomId, socketId, cardId) {
  const room = getRoom(roomId);

  if (!room.gameStarted) return { error: 'Game has not started' };
  if (room.waitingForColor) return { error: 'Waiting for color selection' };

  const playerIndex = room.players.findIndex(p => p.id === socketId);
  if (playerIndex === -1) return { error: 'Player not found' };
  if (playerIndex !== room.currentPlayerIndex) return { error: 'Not your turn' };

  const player = room.players[playerIndex];
  const cardIndex = player.hand.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return { error: 'Card not in hand' };

  const card = player.hand[cardIndex];

  // Validate move
  if (!isValidMove(card, room.currentColor, room.currentValue)) {
    return { error: 'Invalid move' };
  }

  // Remove card from hand
  player.hand.splice(cardIndex, 1);

  // Add to discard pile
  room.discardPile.push(card);

  // Handle wild cards - need color selection before advancing turn
  if (card.type === 'wild') {
    room.waitingForColor = true;
    room.currentValue = card.value;
    // Effects (draw4) will be applied after color is chosen
    return { ...room, pendingCard: card };
  }

  // Apply card effects and advance turn
  const updatedState = applyCardEffect(card, room);
  Object.assign(room, updatedState);

  // Check for winner
  const winner = checkWinner(room.players);
  if (winner) {
    room.winner = winner;
    room.gameStarted = false;
  }

  return room;
}

/**
 * Choose color after playing a wild card
 */
function chooseColor(roomId, socketId, color) {
  const room = getRoom(roomId);

  if (!room.waitingForColor) return { error: 'Not waiting for color' };

  const playerIndex = room.players.findIndex(p => p.id === socketId);
  // The player who played the wild card should be the one who just played
  // (currentPlayerIndex hasn't advanced yet during wild)
  if (playerIndex !== room.currentPlayerIndex) return { error: 'Not your turn' };

  const validColors = ['red', 'green', 'blue', 'yellow'];
  if (!validColors.includes(color)) return { error: 'Invalid color' };

  // Get the wild card that was just played
  const topCard = room.discardPile[room.discardPile.length - 1];

  room.currentColor = color;
  room.waitingForColor = false;

  // Now apply the card effect (draw4 etc.)
  const updatedState = applyCardEffect(topCard, room);
  Object.assign(room, updatedState);
  room.currentColor = color; // Restore chosen color after applyCardEffect

  // Check for winner
  const winner = checkWinner(room.players);
  if (winner) {
    room.winner = winner;
    room.gameStarted = false;
  }

  return room;
}

/**
 * Draw a card from the deck
 */
function drawCard(roomId, socketId) {
  const room = getRoom(roomId);

  if (!room.gameStarted) return { error: 'Game has not started' };
  if (room.waitingForColor) return { error: 'Waiting for color selection' };

  const playerIndex = room.players.findIndex(p => p.id === socketId);
  if (playerIndex === -1) return { error: 'Player not found' };
  if (playerIndex !== room.currentPlayerIndex) return { error: 'Not your turn' };

  const result = drawCards(room.deck, room.discardPile, 1);
  if (result.drawn.length === 0) return { error: 'No cards to draw' };

  room.deck = result.deck;
  room.discardPile = result.discardPile;

  const drawnCard = result.drawn[0];
  room.players[playerIndex].hand.push(drawnCard);

  // After drawing, check if the drawn card can be played
  // If not, advance turn
  const canPlay = isValidMove(drawnCard, room.currentColor, room.currentValue);

  if (!canPlay) {
    // Advance to next player
    const { getNextPlayerIndex } = require('./rules');
    room.currentPlayerIndex = getNextPlayerIndex(
      room.currentPlayerIndex,
      room.direction,
      room.players.length
    );
  }

  return { ...room, drawnCard, canPlayDrawn: canPlay };
}

/**
 * Say UNO when one card left
 */
function sayUno(roomId, socketId) {
  const room = getRoom(roomId);
  const player = room.players.find(p => p.id === socketId);
  if (!player) return { error: 'Player not found' };
  if (player.hand.length !== 1) return { error: 'Can only say UNO with 1 card' };
  player.saidUno = true;
  return room;
}

/**
 * Get safe game state to send to a specific player
 * (hides other players' card details but shows count)
 */
function getStateForPlayer(room, socketId) {
  if (!room) return null;

  return {
    ...room,
    deck: room.deck.length, // Only send deck size
    players: room.players.map(p => ({
      ...p,
      hand: p.id === socketId ? p.hand : p.hand.map(() => ({ hidden: true })),
      handCount: p.hand.length
    }))
  };
}

module.exports = {
  joinRoom,
  leaveRoom,
  startGame,
  playCard,
  drawCard,
  chooseColor,
  sayUno,
  getStateForPlayer,
  getRoom
};
