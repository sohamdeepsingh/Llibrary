// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // include any other paths, e.g., from daisyui if needed
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5e382e",      // Your deep brown
        secondary: "#e5ab85",    // Your soft beige
        accent: "#088081",       // Our new accent color for outlines/highlights
      },
      fontFamily: {
        sans: ["Oxygen", "sans-serif"],
        typewriter: ["Typewriter", "monospace"],
      },
    },
  },
  plugins: [require("daisyui")], // if you're using DaisyUI
};