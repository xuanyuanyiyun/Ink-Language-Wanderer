/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--color-ink)",
          light: "var(--color-ink-light)",
        },
        paper: {
          DEFAULT: "var(--color-paper)",
          dark: "var(--color-paper-dark)",
        },
      },
      fontFamily: {
        pixel: ["var(--font-pixel)"],
      },
    },
  },
  plugins: [],
};
