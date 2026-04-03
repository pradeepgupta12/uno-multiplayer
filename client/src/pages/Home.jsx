// pages/Home.jsx - Landing page to create or join a room
import React, { useState, useEffect } from 'react';

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Home({ onJoin }) {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState('create'); // 'create' | 'join'
  const [error, setError] = useState('');

  // Auto-fill room from URL query param (?room=XXXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomId(roomParam.toUpperCase());
      setMode('join');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const name = playerName.trim();
    if (!name) return setError('Please enter your name');
    if (name.length > 20) return setError('Name too long (max 20 chars)');

    if (mode === 'join') {
      const room = roomId.trim().toUpperCase();
      if (!room) return setError('Please enter a room ID');
      if (room.length < 4) return setError('Room ID too short');
      onJoin(room, name);
    } else {
      const newRoomId = generateRoomId();
      onJoin(newRoomId, name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating card decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { color: '#ef4444', label: '7', x: '8%', y: '15%', rot: '-15deg', delay: '0s' },
          { color: '#22c55e', label: '+2', x: '85%', y: '10%', rot: '12deg', delay: '0.3s' },
          { color: '#3b82f6', label: '⊘', x: '5%', y: '70%', rot: '-8deg', delay: '0.6s' },
          { color: '#facc15', label: '↺', x: '88%', y: '75%', rot: '20deg', delay: '0.9s' },
          { color: '#8b5cf6', label: '★', x: '50%', y: '5%', rot: '-5deg', delay: '1.2s' },
        ].map((card, i) => (
          <div
            key={i}
            className="absolute w-14 h-20 rounded-xl border-2 flex items-center justify-center font-uno text-white text-xl opacity-10 animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${card.color}aa, ${card.color}66)`,
              borderColor: card.color + '44',
              left: card.x,
              top: card.y,
              transform: `rotate(${card.rot})`,
              animationDelay: card.delay,
            }}
          >
            {card.label}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-block relative">
            <div className="bg-red-600 rounded-3xl px-10 py-4 shadow-2xl shadow-red-600/50 border-4 border-red-300 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <span className="font-uno text-7xl text-white tracking-widest drop-shadow-2xl">UNO</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-gray-900 font-bold text-xs font-body border-2 border-yellow-200">
              ×
            </div>
          </div>
          <p className="text-gray-500 font-body mt-4 text-sm">Real-time multiplayer card game</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl border border-gray-700 p-7 shadow-2xl animate-slide-up">

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6 bg-gray-900/60 p-1 rounded-2xl">
            {['create', 'join'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`
                  flex-1 py-2.5 rounded-xl font-body font-bold text-sm transition-all duration-200
                  ${mode === m
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'}
                `}
              >
                {m === 'create' ? '🎮 Create Room' : '🚪 Join Room'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input */}
            <div>
              <label className="block text-gray-400 text-xs font-body uppercase tracking-widest mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                autoFocus
                className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white font-body placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Room ID input (join mode) */}
            {mode === 'join' && (
              <div>
                <label className="block text-gray-400 text-xs font-body uppercase tracking-widest mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={e => setRoomId(e.target.value.toUpperCase())}
                  placeholder="Enter room code..."
                  maxLength={10}
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white font-body placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-widest uppercase"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-red-300 font-body text-sm animate-shake">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-uno text-2xl py-4 rounded-2xl shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer mt-2"
            >
              {mode === 'create' ? '🚀 Create Room' : '➡️ Join Game'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: '👥', label: '2-10 players' },
              { icon: '⚡', label: 'Real-time' },
              { icon: '🎴', label: 'Full UNO rules' },
            ].map(item => (
              <div key={item.label} className="bg-gray-900/50 rounded-xl p-2">
                <div className="text-lg">{item.icon}</div>
                <div className="text-gray-500 font-body text-xs mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
