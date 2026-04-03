// components/GameBoard.jsx - Main game board UI
import React, { useState, useEffect } from 'react';
import Card from './Card';
import PlayerHand from './PlayerHand';
import PlayerList from './PlayerList';
import ColorPicker from './ColorPicker';

const COLOR_BG = {
  red: 'from-red-900/40 via-gray-900 to-gray-900',
  green: 'from-green-900/40 via-gray-900 to-gray-900',
  blue: 'from-blue-900/40 via-gray-900 to-gray-900',
  yellow: 'from-yellow-900/40 via-gray-900 to-gray-900',
  black: 'from-purple-900/40 via-gray-900 to-gray-900',
};

const COLOR_BORDER = {
  red: 'border-red-500 shadow-red-500/40',
  green: 'border-green-500 shadow-green-500/40',
  blue: 'border-blue-500 shadow-blue-500/40',
  yellow: 'border-yellow-400 shadow-yellow-400/40',
  black: 'border-purple-500 shadow-purple-500/40',
};

const COLOR_TEXT = {
  red: 'text-red-400',
  green: 'text-green-400',
  blue: 'text-blue-400',
  yellow: 'text-yellow-400',
  black: 'text-purple-400',
};

export default function GameBoard({
  gameState,
  myId,
  onPlayCard,
  onDrawCard,
  onChooseColor,
  onSayUno,
  lastEvent,
}) {
  const [showUnoButton, setShowUnoButton] = useState(false);
  const [unoFlash, setUnoFlash] = useState(null); // player name who said UNO

  const {
    players = [],
    discardPile = [],
    currentPlayerIndex = 0,
    direction = 1,
    currentColor,
    currentValue,
    gameStarted,
    waitingForColor,
    deck: deckCount = 0,
  } = gameState || {};

  const me = players.find(p => p.id === myId);
  const myIndex = players.findIndex(p => p.id === myId);
  const isMyTurn = myIndex === currentPlayerIndex;
  const topCard = discardPile[discardPile.length - 1];
  const myHand = me?.hand || [];

  // Show UNO button when I have exactly 1 card and it's my turn
  useEffect(() => {
    if (myHand.length === 1 && isMyTurn && !me?.saidUno) {
      setShowUnoButton(true);
    } else {
      setShowUnoButton(false);
    }
  }, [myHand.length, isMyTurn, me?.saidUno]);

  // Flash UNO notification
  useEffect(() => {
    if (lastEvent?.type === 'unoSaid') {
      setUnoFlash(lastEvent.playerName);
      const t = setTimeout(() => setUnoFlash(null), 2500);
      return () => clearTimeout(t);
    }
  }, [lastEvent]);

  const currentPlayer = players[currentPlayerIndex];
  const bgGradient = COLOR_BG[currentColor] || COLOR_BG.black;
  const borderStyle = COLOR_BORDER[currentColor] || COLOR_BORDER.black;
  const colorText = COLOR_TEXT[currentColor] || COLOR_TEXT.black;

  // Arrange opponents around the board
  const opponents = players.filter(p => p.id !== myId);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-700 flex flex-col relative overflow-hidden`}>

      {/* Animated background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 blur-3xl bg-current ${colorText}`} />
        <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl bg-current ${colorText}`} />
      </div>

      {/* UNO flash notification */}
      {unoFlash && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-uno-pop">
          <div className="bg-red-600 border-4 border-red-300 rounded-3xl px-12 py-6 shadow-2xl shadow-red-600/60 text-center">
            <div className="font-uno text-5xl text-white drop-shadow-lg">UNO!</div>
            <div className="text-red-200 font-body text-sm mt-1">{unoFlash}</div>
          </div>
        </div>
      )}

      {/* Color picker overlay */}
      {waitingForColor && isMyTurn && (
        <ColorPicker onChoose={onChooseColor} />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 rounded-lg px-3 py-1 border-2 border-red-400">
            <span className="font-uno text-white text-xl">UNO</span>
          </div>
          <div className={`text-xs font-body px-2 py-1 rounded-full bg-gray-800/80 border ${borderStyle} ${colorText} font-bold capitalize`}>
            {currentColor || 'any'} ●
          </div>
        </div>

        {/* Direction indicator */}
        <div className="text-gray-400 font-body text-xs flex items-center gap-1">
          <span>Direction:</span>
          <span className="text-2xl">{direction === 1 ? '→' : '←'}</span>
        </div>

        {/* Deck count */}
        <div className="flex items-center gap-1.5 bg-gray-800/80 rounded-full px-3 py-1 border border-gray-700">
          <span className="text-gray-400 text-xs font-body">🃏</span>
          <span className="text-white font-bold text-sm font-body">{deckCount}</span>
        </div>
      </div>

      {/* Main layout: sidebar + center */}
      <div className="flex flex-1 gap-3 px-3 pb-2 overflow-hidden">

        {/* Left Sidebar - Player list */}
        <div className="w-44 flex-shrink-0 bg-gray-900/60 backdrop-blur-sm rounded-2xl p-3 border border-gray-700/50 overflow-y-auto">
          <PlayerList
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            myId={myId}
            direction={direction}
          />
        </div>

        {/* Center area */}
        <div className="flex-1 flex flex-col items-center justify-between gap-3 min-w-0">

          {/* Opponents' cards at top */}
          {opponents.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 w-full">
              {opponents.map(opp => {
                const oppHand = opp.hand || [];
                const isOppTurn = players.findIndex(p => p.id === opp.id) === currentPlayerIndex;
                return (
                  <div key={opp.id} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${isOppTurn ? 'bg-yellow-400/10 border border-yellow-400/30' : 'bg-gray-800/30'}`}>
                    <div className={`text-xs font-body font-bold truncate max-w-24 ${isOppTurn ? 'text-yellow-300' : 'text-gray-400'}`}>
                      {opp.name} {isOppTurn && '⚡'}
                    </div>
                    {/* Show back of cards for opponents */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(opp.handCount ?? oppHand.length, 12) }).map((_, i) => (
                        <Card key={i} card={{ hidden: true }} size="sm" hidden />
                      ))}
                      {(opp.handCount ?? oppHand.length) > 12 && (
                        <div className="w-8 h-12 rounded-lg bg-gray-700/50 border border-gray-600 flex items-center justify-center text-xs text-gray-400 font-body">
                          +{(opp.handCount ?? oppHand.length) - 12}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-body">{opp.handCount ?? oppHand.length} cards</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Discard pile + Draw pile in center */}
          <div className="flex items-center justify-center gap-8">

            {/* Draw pile */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={isMyTurn && !waitingForColor ? onDrawCard : undefined}
                disabled={!isMyTurn || waitingForColor}
                className={`
                  w-16 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-1
                  font-uno text-white transition-all duration-200 relative overflow-hidden
                  bg-gradient-to-br from-gray-700 to-gray-900 border-gray-600
                  ${isMyTurn && !waitingForColor
                    ? 'cursor-pointer hover:scale-110 hover:-translate-y-1 hover:border-white hover:shadow-lg hover:shadow-white/20'
                    : 'cursor-default opacity-70'}
                `}
              >
                <span className="text-2xl opacity-50">UNO</span>
                <span className="text-xs opacity-70 font-body">{deckCount}</span>
                {isMyTurn && !waitingForColor && (
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity rounded-xl" />
                )}
              </button>
              <span className="text-gray-500 text-xs font-body">Draw</span>
            </div>

            {/* Current color indicator */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full border-2 border-white/30 shadow-lg`}
                style={{
                  backgroundColor:
                    currentColor === 'red' ? '#ef4444' :
                    currentColor === 'green' ? '#22c55e' :
                    currentColor === 'blue' ? '#3b82f6' :
                    currentColor === 'yellow' ? '#facc15' : '#6b7280'
                }}
              />
              <span className={`text-xs font-body capitalize ${colorText}`}>{currentColor}</span>
            </div>

            {/* Discard pile */}
            <div className="flex flex-col items-center gap-2">
              {topCard ? (
                <Card card={topCard} size="lg" isActive />
              ) : (
                <div className="w-24 h-36 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <span className="text-gray-600 font-body text-xs">Empty</span>
                </div>
              )}
              <span className="text-gray-500 text-xs font-body">Discard</span>
            </div>
          </div>

          {/* Turn indicator */}
          <div className={`
            px-4 py-2 rounded-full border text-sm font-body font-bold transition-all duration-300
            ${isMyTurn
              ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300 animate-pulse'
              : 'bg-gray-800/50 border-gray-700 text-gray-400'}
          `}>
            {waitingForColor && isMyTurn
              ? '🎨 Choose a color!'
              : isMyTurn
                ? '🎯 Your turn!'
                : `⏳ ${currentPlayer?.name || '...'}'s turn`}
          </div>

          {/* My hand */}
          <div className="w-full overflow-x-auto flex justify-center pb-2">
            <PlayerHand
              hand={myHand}
              currentColor={currentColor}
              currentValue={currentValue}
              isMyTurn={isMyTurn}
              onPlayCard={onPlayCard}
              waitingForColor={waitingForColor}
            />
          </div>
        </div>
      </div>

      {/* UNO Button */}
      {showUnoButton && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce-in">
          <button
            onClick={onSayUno}
            className="bg-red-600 hover:bg-red-500 border-4 border-red-300 text-white font-uno text-2xl px-8 py-4 rounded-2xl shadow-2xl shadow-red-600/50 transition-all duration-200 hover:scale-110 cursor-pointer animate-pulse-glow"
          >
            UNO! 🎴
          </button>
        </div>
      )}
    </div>
  );
}
