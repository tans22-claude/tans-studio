/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#111111",
        "paper-white": "#ffffff",
        "concrete-gray": "#e5e5e5",
        "soft-mist": "#f5f5f5",
        steel: "#707072",
        "faint-gray": "#9e9ea0",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Oswald", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        pill: "30px",
      },
    },
  },
  plugins: [],
};
