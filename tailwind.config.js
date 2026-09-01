/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm cozy base palette (kept from the original cream design)
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
          DEFAULT: '#D99CA3',
          deep: '#C77E92',
          soft: '#E6B7BC',
        },
        // The app's primary accent (checkmarks, rings, "today", progress)
        accent: {
          DEFAULT: '#CB5A45', // warm LIIFT MORE coral
          soft: '#E0917F',
        },
        // Per-day muscle-group colors (LIIFT MORE split)
        chest: '#CB5A45', // Chest & Triceps — coral
        legs: '#C4892F', // Legs — amber
        back: '#7C9A5E', // Back & Biceps — olive
        shoulders: '#A96FA0', // Shoulders — orchid
        arms: '#9C5A70', // Arms - berry
        totalbody: '#5E7CA8', // Total Body — dusty blue
        resttag: '#B9A593',
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
