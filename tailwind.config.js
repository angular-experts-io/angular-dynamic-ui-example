/** @type {import('tailwindcss').Config} */

const colors = {
  blue: {
    // should be same as in styles.scss
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#4c73db',
    700: '#2852c8',
    800: '#2144a6',
    900: '#1d3c91',
  },
};

module.exports = {
  content: ['./projects/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        code: ['Sora', 'sans-serif'],
        display: ['Gabarito', 'sans-serif'],
      },
      colors,
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      const blue = theme('colors.blue');

      addBase({
        ':root': {
          '--blue-50': blue['50'],
          '--blue-100': blue['100'],
          '--blue-200': blue['200'],
          '--blue-300': blue['300'],
          '--blue-400': blue['400'],
          '--blue-500': blue['500'],
          '--blue-600': blue['600'],
          '--blue-700': blue['700'],
          '--blue-800': blue['800'],
          '--blue-900': blue['900'],
        },
      });
    },
  ],
};
