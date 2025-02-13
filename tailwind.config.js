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
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#5e382e",
          "secondary": "#e5ab85",
          "accent": "#088081",
          "neutral": "#ffffff",  // Ensuring a light theme background
          "base-100": "#ffffff", // Background set to white to avoid dark mode
        },
      },
    ],
    darkTheme: false, // **This explicitly disables dark mode**
  },
  plugins: [require("daisyui")], // if you're using DaisyUI
};