/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#fff0d9',
          200: '#ffd99a',
          300: '#ffbc5a',
          400: '#ff9b27',
          500: '#f07d00',
          600: '#c56200',
          700: '#9c4b00',
          800: '#7a3a00',
          900: '#5c2d00',
        },
        temple: {
          50: '#fdf4f4',
          100: '#fce8e8',
          200: '#f8d0d0',
          300: '#f2a8a8',
          400: '#e87474',
          500: '#d94848',
          600: '#c03030',
          700: '#a02424',
          800: '#802020',
          900: '#5a1818',
        },
      },
      fontFamily: {
        tamil: ['Noto Sans Tamil', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
