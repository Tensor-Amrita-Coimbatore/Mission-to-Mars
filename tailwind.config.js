// Shiva
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0a0a1a',
        'primary-cyan': '#00ffff',
        'accent-orange': '#ff7f50',
        'light-gray': '#e0e0e0',
      },
      fontFamily: {
        'mono': ['"Space Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}