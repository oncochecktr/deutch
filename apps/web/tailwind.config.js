/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfbf7",
          100: "#f9f5ed",
          200: "#f0e8da",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e4ebe4",
          200: "#c8d5c8",
          300: "#a3b8a3",
          400: "#7a967a",
          500: "#5a785a",
          600: "#466046",
        },
        goethe: {
          blue: "#1a3a5c",
          gold: "#c9a227",
          red: "#8b2942",
        },
      },
      fontFamily: {
        sans: ["var(--font-source-sans)", "Source Sans 3", "system-ui", "sans-serif"],
      },
      fontSize: {
        body: ["1.0625rem", { lineHeight: "1.625" }],
        caption: ["0.875rem", { lineHeight: "1.5" }],
        label: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
      },
    },
  },
  plugins: [],
};
