// pages/Game.jsx - Main game page, handles all socket communication
import React, { useState, useEffect, useCallback } from 'react';
import socket from '../socket/socket';
import Lobby from '../components/Lobby';
import GameBoard from '../components/GameBoard';

export default function Game({ roomId, playerName, onLeave }) {
  const [gameState, setGameState] = useState(null);
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  // Show a temporary toast notification
  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Join room on mount
  useEffect(() => {
    if (!roomId || !playerName) return;

    socket.emit('joinRoom', { roomId, playerName });

    // ── Listen for events ──────────────────────────────────────
    socket.on('gameState', (state) => {
      setGameState(state);
    });

    socket.on('gameStarted', ({ message }) => {
      showToast(message, 'success');
    });

    socket.on('playerJoined', ({ playerName: name }) => {
      showToast(`${name} joined the room! 👋`, 'info');
    });

    socket.on('playerLeft', () => {
      showToast('A player has left the game', 'warning');
    });

    socket.on('cardPlayed', ({ waitingForColor }) => {
      if (waitingForColor) {
        showToast('Wild card played! Choose a color.', 'info');
      }
    });

    socket.on('cardDrawn', ({ canPlay }) => {
      if (!canPlay) {
        showToast('Card drawn — no playable cards, turn skipped', 'info');
      } else {
        showToast('Card drawn — you can play it!', 'success');
      }
    });

    socket.on('colorChosen', ({ color }) => {
      showToast(`Color changed to ${color}! 🎨`, 'info');
    });

    socket.on('unoSaid', ({ playerName: name }) => {
      setLastEvent({ type: 'unoSaid', playerName: name });
      showToast(`${name} said UNO! 🎴`, 'warning');
    });

    socket.on('gameOver', ({ winner: w, message }) => {
      setWinner(w);
      showToast(message, 'success');
    });

    socket.on('error', ({ message }) => {
      showToast(`❌ ${message}`, 'error');
    });

    return () => {
      socket.off('gameState');
      socket.off('gameStarted');
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('cardPlayed');
      socket.off('cardDrawn');
      socket.off('colorChosen');
      socket.off('unoSaid');
      socket.off('gameOver');
      socket.off('error');
    };
  }, [roomId, playerName, showToast]);

  // ── Actions ────────────────────────────────────────────────────
  const handleStartGame = () => {
    socket.emit('startGame', { roomId });
  };

  const handlePlayCard = (cardId) => {
    socket.emit('playCard', { roomId, cardId });
  };

  const handleDrawCard = () => {
    socket.emit('drawCard', { roomId });
  };

  const handleChooseColor = (color) => {
    socket.emit('chooseColor', { roomId, color });
  };

  const handleSayUno = () => {
    socket.emit('sayUno', { roomId });
    showToast('UNO! 🎴', 'success');
  };

  const handlePlayAgain = () => {
    setWinner(null);
    socket.emit('startGame', { roomId });
  };

  // Loading state
  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-600 rounded-2xl px-8 py-3 mb-4 inline-block border-4 border-red-400">
            <span className="font-uno text-4xl text-white">UNO</span>
          </div>
          <div className="text-gray-400 font-body animate-pulse">Connecting to room...</div>
        </div>
      </div>
    );
  }

  // Winner screen
  if (winner) {
    const isMyWin = winner.id === socket.id;
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti-like decoration */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-6 rounded opacity-30 animate-bounce"
              style={{
                background: ['#ef4444', '#22c55e', '#3b82f6', '#facc15'][i % 4],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative text-center animate-bounce-in">
          <div className="text-8xl mb-4">{isMyWin ? '🏆' : '😔'}</div>

          <div className={`rounded-3xl px-10 py-6 mb-6 border-4 shadow-2xl ${isMyWin ? 'bg-yellow-400/20 border-yellow-400 shadow-yellow-400/30' : 'bg-gray-800 border-gray-600'}`}>
            <div className="font-uno text-5xl text-white mb-2">
              {isMyWin ? 'You Win!' : `${winner.name} Wins!`}
            </div>
            <div className="text-gray-300 font-body text-lg">
              {isMyWin ? '🎉 Congratulations!' : `Better luck next time!`}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePlayAgain}
              className="bg-green-600 hover:bg-green-500 text-white font-uno text-xl px-8 py-4 rounded-2xl shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              🎮 Play Again
            </button>
            <button
              onClick={onLeave}
              className="bg-gray-700 hover:bg-gray-600 text-white font-body font-bold px-6 py-4 rounded-2xl transition-all hover:scale-105 cursor-pointer"
            >
              🚪 Leave
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Lobby (game not started yet)
  if (!gameState.gameStarted) {
    return (
      <>
        <Lobby
          roomId={roomId}
          players={gameState.players}
          myId={socket.id}
          onStartGame={handleStartGame}
        />
        <ToastNotification toast={toast} />
      </>
    );
  }

  // Active game
  return (
    <>
      <GameBoard
        gameState={gameState}
        myId={socket.id}
        onPlayCard={handlePlayCard}
        onDrawCard={handleDrawCard}
        onChooseColor={handleChooseColor}
        onSayUno={handleSayUno}
        lastEvent={lastEvent}
      />
      <ToastNotification toast={toast} />
    </>
  );
}

// Toast notification component
function ToastNotification({ toast }) {
  if (!toast) return null;

  const colors = {
    info: 'bg-blue-800/90 border-blue-600 text-blue-100',
    success: 'bg-green-800/90 border-green-600 text-green-100',
    warning: 'bg-yellow-800/90 border-yellow-600 text-yellow-100',
    error: 'bg-red-900/90 border-red-600 text-red-100',
  };

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border text-sm font-body font-semibold shadow-xl backdrop-blur-sm animate-slide-up ${colors[toast.type] || colors.info}`}>
      {toast.msg}
    </div>
  );
}
