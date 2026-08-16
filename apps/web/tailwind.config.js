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
          50: "#fbfdf9",
          100: "#f3f7f1",
          200: "#e5ece3",
        },
        sage: {
          50: "#f0f5f1",
          100: "#dfe9e1",
          200: "#c3d4c7",
          300: "#9fb8a6",
          400: "#75937e",
          500: "#55735e",
          600: "#405b49",
        },
        goethe: {
          blue: "#163a5f",
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
