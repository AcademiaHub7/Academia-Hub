/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-color': '#1a472a',
        'secondary-color': '#ffd700',
        'accent-color': '#dc143c',
      },
      fontFamily: {
        'educmaster': ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};