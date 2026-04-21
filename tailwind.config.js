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
        accent: "var(--color-accent)",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)"],
      },
      boxShadow: {
        'pixel': '4px 4px 0 rgba(0,0,0,0.5)',
        'pixel-hover': '2px 2px 0 rgba(0,0,0,0.5)',
        'ink-glow': '0 0 20px rgba(244, 244, 240, 0.1)',
      }
    },
  },
  plugins: [],
};
