import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0077BE',
        accent: '#FFD700',
        ocean: {
          deep: '#003D5C',
          medium: '#0077BE',
          light: '#4FC3F7',
          surface: '#B3E5FC',
        },
        coral: {
          pink: '#FF6B9D',
          orange: '#FF8C42',
        },
        sand: '#F5DEB3',
      },
      animation: {
        'bounce-soft': 'bounce 1s ease-in-out infinite',
        'confetti': 'confetti 3s ease-out forwards',
        'swim': 'swim 3s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'bubble': 'bubble 4s ease-in-out infinite',
      },
      keyframes: {
        swim: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(20px) translateY(-10px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0) scale(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
