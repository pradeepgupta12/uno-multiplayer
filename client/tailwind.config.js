/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        uno: ['"Boogaloo"', 'cursive'],
        body: ['"Nunito"', 'sans-serif']
      },
      animation: {
        'card-in': 'cardIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'flip': 'flip 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'uno-pop': 'unoPop 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
      keyframes: {
        cardIn: {
          '0%': { transform: 'translateY(20px) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,255,0,0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(255,255,0,0.9)' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' }
        },
        unoPop: {
          '0%': { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(5deg)', opacity: '1' },
          '80%': { transform: 'scale(0.9) rotate(-2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0)' }
        }
      }
    }
  },
  plugins: []
}
