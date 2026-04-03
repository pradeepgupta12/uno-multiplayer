// deck.js - Generates and manages the UNO deck
const { v4: uuidv4 } = require('uuid');

const COLORS = ['red', 'green', 'blue', 'yellow'];

/**
 * Generate a full UNO deck
 * - 0-9 number cards (x2 per color, except 0 which is x1)
 * - skip, reverse, draw2, draw3 action cards (x2 per color)
 * - wild and wild4 cards (x4 each)
 */
function generateDeck() {
  const deck = [];

  COLORS.forEach(color => {
    // One 0 card per color
    deck.push({ id: uuidv4(), color, type: 'number', value: 0 });

    // Two of each 1-9 per color
    for (let i = 1; i <= 9; i++) {
      deck.push({ id: uuidv4(), color, type: 'number', value: i });
      deck.push({ id: uuidv4(), color, type: 'number', value: i });
    }

    // Two of each action card per color
    ['skip', 'reverse', 'draw2', 'draw3'].forEach(action => {
      deck.push({ id: uuidv4(), color, type: 'action', value: action });
      deck.push({ id: uuidv4(), color, type: 'action', value: action });
    });
  });

  // Four wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({ id: uuidv4(), color: 'black', type: 'wild', value: 'wild' });
    deck.push({ id: uuidv4(), color: 'black', type: 'wild', value: 'wild4' });
  }

  return shuffleDeck(deck);
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Draw cards from deck, reshuffling discard pile if needed
 */
function drawCards(deck, discardPile, count) {
  let currentDeck = [...deck];
  const drawn = [];

  for (let i = 0; i < count; i++) {
    // If deck is empty, reshuffle discard pile (keep top card)
    if (currentDeck.length === 0) {
      if (discardPile.length <= 1) break; // No cards left at all

      const topCard = discardPile[discardPile.length - 1];
      const reshuffled = shuffleDeck(discardPile.slice(0, -1).map(c => ({
        ...c,
        color: c.type === 'wild' ? 'black' : c.color // Reset wild colors
      })));
      currentDeck = reshuffled;
      discardPile = [topCard];
    }

    drawn.push(currentDeck.pop());
  }

  return { drawn, deck: currentDeck, discardPile };
}

module.exports = { generateDeck, shuffleDeck, drawCards };
