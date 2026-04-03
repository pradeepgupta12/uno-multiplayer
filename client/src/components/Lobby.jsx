// components/Lobby.jsx - Pre-game lobby where players wait
import React, { useState } from 'react';

export default function Lobby({ roomId, players, myId, onStartGame, onCopyLink }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    if (onCopyLink) onCopyLink();
  };

  const me = players.find(p => p.id === myId);
  const isHost = me?.isHost;
  const canStart = players.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🔴', '🟢', '🔵', '🟡'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-5 animate-pulse"
            style={{
              top: `${20 + i * 20}%`,
              left: `${10 + i * 22}%`,
              animationDelay: `${i * 0.7}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-lg">
        {/* UNO Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-red-600 rounded-2xl px-8 py-3 shadow-2xl shadow-red-600/40 border-4 border-red-400 mb-4 transform -rotate-1">
            <span className="font-uno text-6xl text-white tracking-wider drop-shadow-lg">UNO</span>
          </div>
          <div className="text-gray-400 font-body text-sm">Multiplayer Card Game</div>
        </div>

        {/* Room card */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700 p-6 shadow-2xl">
          {/* Room ID */}
          <div className="mb-6">
            <div className="text-gray-400 text-xs font-body uppercase tracking-widest mb-2">Room ID</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-900 rounded-xl px-4 py-3 font-mono text-white text-lg tracking-widest border border-gray-700">
                {roomId}
              </div>
              <button
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-body font-bold text-sm transition-all duration-200 hover:scale-105 flex-shrink-0"
              >
                {copied ? '✅ Copied!' : '📋 Copy Link'}
              </button>
            </div>
            <p className="text-gray-500 text-xs font-body mt-2">Share this link with friends to invite them</p>
          </div>

          {/* Players list */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-400 text-xs font-body uppercase tracking-widest">
                Players ({players.length}/10)
              </div>
              {players.length < 2 && (
                <div className="text-yellow-500 text-xs font-body animate-pulse">
                  Need {2 - players.length} more to start
                </div>
              )}
            </div>

            <div className="space-y-2">
              {players.map((player, idx) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 animate-card-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm font-body">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-white font-body font-semibold">
                    {player.name}
                    {player.id === myId && <span className="ml-2 text-gray-500 text-xs">(you)</span>}
                  </span>
                  {player.isHost && <span className="text-yellow-400 text-sm">👑 Host</span>}
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              ))}

              {/* Empty slots */}
              {players.length < 2 && Array.from({ length: 2 - players.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 bg-gray-800/30 rounded-xl px-4 py-3 border border-dashed border-gray-700">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <span className="text-gray-600 text-lg">?</span>
                  </div>
                  <span className="text-gray-600 font-body text-sm">Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start button (host only) */}
          {isHost ? (
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className={`
                w-full py-4 rounded-2xl font-uno text-2xl transition-all duration-200
                ${canStart
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30 hover:scale-105 hover:shadow-xl cursor-pointer'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {canStart ? '🎮 Start Game!' : `⏳ Waiting (${players.length}/2 min)`}
            </button>
          ) : (
            <div className="w-full py-4 rounded-2xl bg-gray-700/50 text-gray-400 font-body text-center text-sm border border-dashed border-gray-600">
              ⏳ Waiting for host to start the game...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
