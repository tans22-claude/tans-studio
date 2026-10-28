/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "#fffef7",
        ink: "#000000",
        graphite: "#666666",
        ash: "#aaaaaa",
        charcoal: "#4d4c4a",
        magenta: "#8a0467",
        teal: "#03624c",
        powder: "#a5c8eb",
        candy: "#ffacea",
        mint: "#a5ebd6",
        navy: "#101731",
        signal: "#ffd001",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [],
};
