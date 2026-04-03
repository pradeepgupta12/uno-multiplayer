// components/Card.jsx - UNO card display component
import React from 'react';

const COLOR_STYLES = {
  red: {
    bg: 'bg-red-500',
    border: 'border-red-300',
    text: 'text-white',
    glow: 'shadow-red-500/60',
    gradient: 'from-red-400 to-red-700',
    hex: '#ef4444'
  },
  green: {
    bg: 'bg-green-500',
    border: 'border-green-300',
    text: 'text-white',
    glow: 'shadow-green-500/60',
    gradient: 'from-green-400 to-green-700',
    hex: '#22c55e'
  },
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-300',
    text: 'text-white',
    glow: 'shadow-blue-500/60',
    gradient: 'from-blue-400 to-blue-700',
    hex: '#3b82f6'
  },
  yellow: {
    bg: 'bg-yellow-400',
    border: 'border-yellow-200',
    text: 'text-gray-900',
    glow: 'shadow-yellow-400/60',
    gradient: 'from-yellow-300 to-yellow-600',
    hex: '#facc15'
  },
  black: {
    bg: 'bg-gray-900',
    border: 'border-gray-600',
    text: 'text-white',
    glow: 'shadow-purple-500/60',
    gradient: 'from-gray-700 to-gray-950',
    hex: '#111827'
  }
};

const VALUE_DISPLAY = {
  skip: '⊘',
  reverse: '↺',
  draw2: '+2',
  draw3: '+3',
  wild: '★',
  wild4: '+4'
};

function getCardLabel(card) {
  if (card.type === 'number') return String(card.value);
  return VALUE_DISPLAY[card.value] || card.value;
}

function WildCircles({ size }) {
  const r = size === 'sm' ? 6 : size === 'md' ? 9 : 13;
  const cx = size === 'sm' ? 12 : size === 'md' ? 20 : 28;
  const cy = cx;
  return (
    <svg viewBox={`0 0 ${cx * 2} ${cy * 2}`} className="w-full h-full">
      <circle cx={cx - r * 0.6} cy={cy - r * 0.6} r={r} fill="#ef4444" opacity="0.9" />
      <circle cx={cx + r * 0.6} cy={cy - r * 0.6} r={r} fill="#3b82f6" opacity="0.9" />
      <circle cx={cx - r * 0.6} cy={cy + r * 0.6} r={r} fill="#facc15" opacity="0.9" />
      <circle cx={cx + r * 0.6} cy={cy + r * 0.6} r={r} fill="#22c55e" opacity="0.9" />
    </svg>
  );
}

export default function Card({
  card,
  onClick,
  isPlayable = false,
  isActive = false,
  size = 'md',
  hidden = false,
  className = ''
}) {
  if (!card) return null;

  // Hidden card (other players' cards shown as card back)
  if (hidden || card.hidden) {
    const sizeClasses = {
      sm: 'w-8 h-12',
      md: 'w-14 h-20',
      lg: 'w-20 h-28'
    };
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 flex items-center justify-center shadow-lg ${className}`}>
        <span className="text-white font-uno text-lg opacity-50">UNO</span>
      </div>
    );
  }

  const style = COLOR_STYLES[card.color] || COLOR_STYLES.black;
  const label = getCardLabel(card);
  const isWild = card.type === 'wild';

  const sizeClasses = {
    sm: { card: 'w-10 h-14', label: 'text-xs', corner: 'text-xs p-0.5' },
    md: { card: 'w-16 h-24', label: 'text-lg', corner: 'text-xs p-0.5' },
    lg: { card: 'w-24 h-36', label: 'text-3xl', corner: 'text-sm p-1' }
  };
  const sz = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={`
        ${sz.card} rounded-xl border-2 flex flex-col items-center justify-between relative overflow-hidden
        select-none transition-all duration-200 font-uno
        ${style.border}
        bg-gradient-to-br ${style.gradient}
        ${isPlayable ? `cursor-pointer hover:-translate-y-3 hover:scale-110 shadow-lg ${style.glow} hover:shadow-xl` : 'cursor-default opacity-90'}
        ${isActive ? `ring-4 ring-white ring-offset-2 ring-offset-transparent -translate-y-2 scale-105 shadow-2xl animate-pulse-glow` : ''}
        ${className}
      `}
      style={{
        boxShadow: isActive ? `0 0 20px ${style.hex}, 0 8px 32px rgba(0,0,0,0.4)` : undefined
      }}
    >
      {/* White oval in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="bg-white rounded-full opacity-20"
          style={{ width: '70%', height: '80%', transform: 'rotate(-30deg)' }}
        />
      </div>

      {/* Top-left corner label */}
      <div className={`${sz.corner} ${style.text} font-bold z-10 self-start leading-none`}>
        {label}
      </div>

      {/* Center content */}
      <div className="z-10 flex items-center justify-center flex-1">
        {isWild ? (
          <div className={size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : 'w-14 h-14'}>
            <WildCircles size={size} />
          </div>
        ) : (
          <span className={`${sz.label} font-black ${style.text} drop-shadow-lg`}>
            {label}
          </span>
        )}
      </div>

      {/* Bottom-right corner label (upside down) */}
      <div className={`${sz.corner} ${style.text} font-bold z-10 self-end leading-none rotate-180`}>
        {label}
      </div>

      {/* Playable shimmer effect */}
      {isPlayable && (
        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200 rounded-xl" />
      )}
    </div>
  );
}
