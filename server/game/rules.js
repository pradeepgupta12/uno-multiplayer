// rules.js - UNO game rules and validation

/**
 * Check if a card can be played given the current game state
 */
function isValidMove(card, currentColor, currentValue, currentType) {
  // Wild cards can always be played
  if (card.type === 'wild') return true;

  // Match by color
  if (card.color === currentColor) return true;

  // Match by value/action
  if (card.value === currentValue) return true;

  return false;
}

/**
 * Calculate the next player index based on direction
 */
function getNextPlayerIndex(currentIndex, direction, playerCount) {
  return ((currentIndex + direction) + playerCount) % playerCount;
}

/**
 * Apply card effects and return updated game state
 */
function applyCardEffect(card, gameState) {
  let {
    players,
    deck,
    discardPile,
    currentPlayerIndex,
    direction,
    currentColor,
    currentValue
  } = gameState;

  const { drawCards } = require('./deck');
  let skipNext = false;

  currentColor = card.type === 'wild' ? currentColor : card.color;
  currentValue = card.value;

  switch (card.value) {
    case 'skip': {
      // Skip the next player's turn
      skipNext = true;
      break;
    }

    case 'reverse': {
      // Reverse play direction
      direction = direction * -1;
      // With 2 players, reverse acts like skip
      if (players.length === 2) skipNext = true;
      break;
    }

    case 'draw2': {
      // Next player draws 2 and loses turn
      const nextIdx = getNextPlayerIndex(currentPlayerIndex, direction, players.length);
      const result = drawCards(deck, discardPile, 2);
      players[nextIdx].hand.push(...result.drawn);
      deck = result.deck;
      discardPile = result.discardPile;
      skipNext = true;
      break;
    }

    case 'draw3': {
      // Next player draws 3 and loses turn
      const nextIdx = getNextPlayerIndex(currentPlayerIndex, direction, players.length);
      const result = drawCards(deck, discardPile, 3);
      players[nextIdx].hand.push(...result.drawn);
      deck = result.deck;
      discardPile = result.discardPile;
      skipNext = true;
      break;
    }

    case 'wild4': {
      // Next player draws 4 and loses turn (color chosen separately)
      const nextIdx = getNextPlayerIndex(currentPlayerIndex, direction, players.length);
      const result = drawCards(deck, discardPile, 4);
      players[nextIdx].hand.push(...result.drawn);
      deck = result.deck;
      discardPile = result.discardPile;
      skipNext = true;
      break;
    }

    default:
      break; // Number cards and wild (color-only) have no extra effects
  }

  // Advance turn
  let nextPlayerIndex = getNextPlayerIndex(currentPlayerIndex, direction, players.length);
  if (skipNext) {
    nextPlayerIndex = getNextPlayerIndex(nextPlayerIndex, direction, players.length);
  }

  return {
    ...gameState,
    players,
    deck,
    discardPile,
    currentPlayerIndex: nextPlayerIndex,
    direction,
    currentColor,
    currentValue
  };
}

/**
 * Check if any player has won (0 cards in hand)
 */
function checkWinner(players) {
  return players.find(p => p.hand.length === 0) || null;
}

module.exports = { isValidMove, applyCardEffect, getNextPlayerIndex, checkWinner };
