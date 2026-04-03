// components/ColorPicker.jsx - Wild card color selection overlay
import React from 'react';

const COLORS = [
  { id: 'red', label: 'Red', bg: 'bg-red-500', hover: 'hover:bg-red-400', ring: 'ring-red-300', emoji: '🔴' },
  { id: 'green', label: 'Green', bg: 'bg-green-500', hover: 'hover:bg-green-400', ring: 'ring-green-300', emoji: '🟢' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-400', ring: 'ring-blue-300', emoji: '🔵' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-400', hover: 'hover:bg-yellow-300', ring: 'ring-yellow-200', emoji: '🟡' }
];

export default function ColorPicker({ onChoose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-slide-up">
      <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700 shadow-2xl text-center max-w-sm w-full mx-4">
        <h2 className="text-white font-uno text-3xl mb-2">Choose a Color</h2>
        <p className="text-gray-400 font-body text-sm mb-8">Pick the color for your wild card</p>

        <div className="grid grid-cols-2 gap-4">
          {COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => onChoose(color.id)}
              className={`
                ${color.bg} ${color.hover}
                rounded-2xl p-6 flex flex-col items-center gap-2
                transition-all duration-200 hover:scale-105 hover:shadow-xl
                ring-2 ${color.ring} font-body font-bold text-white
                text-lg cursor-pointer
              `}
            >
              <span className="text-4xl">{color.emoji}</span>
              {color.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
