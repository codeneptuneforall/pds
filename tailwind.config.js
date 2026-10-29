export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F1E5',
        parchment: '#F1E8D8',
        maroon: { DEFAULT: '#541D24', light: '#6E2830' },
        gold: { DEFAULT: '#D5AD57', light: '#E3C47E', deep: '#7A5C1C' },
        teal: '#176B69',
        emerald: '#267A55',
        sandstone: '#E6D6BD',
        charcoal: '#211B18',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
};
