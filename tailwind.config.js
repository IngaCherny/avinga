/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm cozy palette pulled from the training PDF
        cream: {
          DEFAULT: '#F4E8DE', // page background
          card: '#FBF5EE', // workout cards
          deep: '#EFE1D5',
        },
        peach: {
          light: '#EDD4C5',
          DEFAULT: '#E6B9A0',
          deep: '#DFA98C',
        },
        mocha: {
          DEFAULT: '#5E4435', // dark brown headings / date pill
          soft: '#7A5C49',
          muted: '#A8907F', // subtitle gray-brown
        },
        rose: {
          DEFAULT: '#D99CA3', // "Training" pink
          deep: '#C77E92',
          soft: '#E6B7BC',
        },
        // Per-day & method accent colors
        belle: '#CE7E94',
        burn: '#8A6A55',
        run: '#BC5E3A',
        runclub: '#B5882B',
        wildcard: '#8E6E9E',
        yoga: '#8FA98C', // calm sage for yoga / mobility days
        camel: '#C2925E',
        clay: '#A37C63',
        resttag: '#B9A593',
        levelup: '#C7902E',
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.75rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 14px 30px -18px rgba(94, 68, 53, 0.35)',
        soft: '0 8px 20px -12px rgba(94, 68, 53, 0.28)',
        pill: '0 4px 12px -4px rgba(94, 68, 53, 0.30)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'pop-in': 'pop-in 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
