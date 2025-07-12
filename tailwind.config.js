/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          50:  "#fdf2f8",
          100: "#fff8dc",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#ff6347",
          700: "#a52a2a",
          800: "#9d174d",
          900: "#831843",
        },
      },
    },
  },
  plugins: [],
};