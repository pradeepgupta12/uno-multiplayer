// App.jsx - Root application component
import React, { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';

export default function App() {
  const [session, setSession] = useState(null); // { roomId, playerName }

  const handleJoin = (roomId, playerName) => {
    setSession({ roomId, playerName });
  };

  const handleLeave = () => {
    setSession(null);
    // Clear room from URL
    window.history.replaceState({}, '', window.location.pathname);
  };

  if (session) {
    return (
      <Game
        roomId={session.roomId}
        playerName={session.playerName}
        onLeave={handleLeave}
      />
    );
  }

  return <Home onJoin={handleJoin} />;
}
