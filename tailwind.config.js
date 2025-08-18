/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        move: {
          "100%": { transform: "translate3d(0,0,1px) rotate(360deg)" },
        },
      },
      animation: {
        move: "move 20s linear infinite",
      },
    },
  },
  plugins: [],
};
