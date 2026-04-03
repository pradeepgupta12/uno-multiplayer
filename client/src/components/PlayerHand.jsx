// components/PlayerHand.jsx - Shows the current player's hand of cards
import React, { useMemo } from 'react';
import Card from './Card';

export default function PlayerHand({ hand, currentColor, currentValue, isMyTurn, onPlayCard, waitingForColor }) {
  // Determine which cards are playable
  const playableCards = useMemo(() => {
    if (!isMyTurn || waitingForColor) return new Set();

    return new Set(
      hand
        .filter(card => {
          if (card.type === 'wild') return true;
          if (card.color === currentColor) return true;
          if (card.value === currentValue) return true;
          return false;
        })
        .map(c => c.id)
    );
  }, [hand, currentColor, currentValue, isMyTurn, waitingForColor]);

  if (!hand || hand.length === 0) return null;

  // Fan the cards out nicely
  const totalCards = hand.length;
  const maxSpread = Math.min(totalCards * 28, 600); // cap total width

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-gray-400 font-body text-xs uppercase tracking-widest">
        {isMyTurn ? (
          <span className="text-yellow-400 font-bold animate-pulse">✨ Your Turn — Play a card!</span>
        ) : (
          <span>Your Hand ({hand.length} cards)</span>
        )}
      </div>

      {/* Card fan layout */}
      <div
        className="relative flex items-end justify-center"
        style={{ height: '130px', minWidth: Math.min(totalCards * 36 + 60, 700) + 'px', maxWidth: '100%' }}
      >
        {hand.map((card, i) => {
          const isPlayable = playableCards.has(card.id);
          // Calculate rotation and offset for fan effect
          const midpoint = (totalCards - 1) / 2;
          const offset = i - midpoint;
          const rotation = offset * (totalCards > 10 ? 2 : 3);
          const xOffset = offset * (totalCards > 12 ? 24 : 32);
          const yOffset = Math.abs(offset) * 3;

          return (
            <div
              key={card.id}
              className="absolute transition-all duration-200 animate-card-in"
              style={{
                transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`,
                transformOrigin: 'bottom center',
                zIndex: isPlayable ? totalCards + i : i,
                animationDelay: `${i * 30}ms`
              }}
            >
              <Card
                card={card}
                isPlayable={isPlayable}
                onClick={() => onPlayCard(card.id)}
                size="md"
              />
            </div>
          );
        })}
      </div>

      {/* Playable count hint */}
      {isMyTurn && !waitingForColor && (
        <div className="text-xs text-gray-500 font-body">
          {playableCards.size > 0 ? (
            <span className="text-green-400">{playableCards.size} card{playableCards.size > 1 ? 's' : ''} playable</span>
          ) : (
            <span className="text-red-400">No playable cards — draw one</span>
          )}
        </div>
      )}
    </div>
  );
}
