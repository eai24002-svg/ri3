import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      colors: {
        noir: '#0a0a0a',
        gold: '#d4af37',
        ivory: '#f6f2e9',
        burgundy: '#6f1d1b'
      },
      boxShadow: {
        glow: '0 0 24px rgba(212, 175, 55, 0.24)',
        soft: '0 18px 60px rgba(0, 0, 0, 0.45)'
      },
      backgroundImage: {
        aurora:
          'radial-gradient(circle at 15% 20%, rgba(212,175,55,0.14), transparent 45%), radial-gradient(circle at 85% 10%, rgba(111,29,27,0.18), transparent 40%), radial-gradient(circle at 45% 80%, rgba(212,175,55,0.08), transparent 35%)'
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite'
      }
    }
  }
}
