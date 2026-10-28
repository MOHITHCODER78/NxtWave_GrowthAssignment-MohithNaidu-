/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b', // zinc-950
        card: {
          DEFAULT: '#121215',
          subtle: '#18181b',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        primary: {
          DEFAULT: '#10b981', // emerald-500
          hover: '#059669',
          light: '#34d399',
          glow: 'rgba(16, 185, 129, 0.15)',
        },
        accent: {
          DEFAULT: '#06b6d4', // cyan-500
          hover: '#0891b2',
          light: '#22d3ee',
          glow: 'rgba(6, 182, 212, 0.15)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'monospace',
        ],
      },
      boxShadow: {
        'subtle-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.15)',
        'subtle-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.15)',
        'card-glow': '0 4px 24px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};
