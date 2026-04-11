/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {colors: {
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#3b82f6",
        background: "#ffffff",
        foreground: "#000000",},
  },
  plugins: [],
}}