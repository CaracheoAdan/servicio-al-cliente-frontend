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
        totebin: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#7DBAE8',
          400: '#5BA3D9',
          500: '#3B82C4',
          600: '#2A5D8F', /* Primary — Azul Petróleo */
          700: '#1E4D73',
          800: '#163B58',
          900: '#0F2B42',
        },
        moss: {
          light: '#7C9AB5',
          DEFAULT: '#4A7A9E', /* Secondary status */
          dark: '#2E5A7A'
        }
      }
    },
  },
  plugins: [],
}
