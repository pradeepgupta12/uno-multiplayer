// components/PlayerList.jsx - Shows all players and their status
import React from 'react';

const COLOR_DOT = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-400',
};

export default function PlayerList({ players, currentPlayerIndex, myId, direction }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-gray-400 text-xs font-body uppercase tracking-widest mb-1 flex items-center gap-2">
        <span>Players</span>
        <span className="text-gray-600">{direction === 1 ? '→' : '←'}</span>
      </div>

      {players.map((player, idx) => {
        const isCurrentTurn = idx === currentPlayerIndex;
        const isMe = player.id === myId;
        const cardCount = player.handCount ?? player.hand?.length ?? 0;

        return (
          <div
            key={player.id}
            className={`
              flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300
              ${isCurrentTurn
                ? 'bg-yellow-400/20 border border-yellow-400/50 shadow-lg shadow-yellow-400/10'
                : 'bg-gray-800/50 border border-gray-700/50'
              }
            `}
          >
            {/* Turn indicator */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCurrentTurn ? 'bg-yellow-400 animate-ping' : 'bg-gray-600'}`} />

            {/* Player name */}
            <div className="flex-1 min-w-0">
              <div className={`font-body font-bold text-sm truncate ${isCurrentTurn ? 'text-yellow-300' : isMe ? 'text-white' : 'text-gray-300'}`}>
                {player.name}
                {isMe && <span className="ml-1 text-xs text-gray-500">(you)</span>}
                {player.isHost && <span className="ml-1 text-xs text-yellow-500">👑</span>}
              </div>
            </div>

            {/* UNO badge */}
            {player.saidUno && cardCount === 1 && (
              <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded font-bold font-uno animate-pulse">
                UNO!
              </span>
            )}

            {/* Card count */}
            <div className={`
              text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center
              font-body flex-shrink-0
              ${cardCount === 1 ? 'bg-red-600 text-white animate-pulse' :
                cardCount <= 3 ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}
            `}>
              {cardCount}
            </div>
          </div>
        );
      })}
    </div>
  );
}
