/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  /**
   * Tüm Tailwind utility’lerini sadece [data-app] içinde üretir (public site’i bozmaz).
   */
  important: "[data-app]",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {},
  plugins: [],

  safelist: [
    "bg-slate-950",
    "bg-teal-600",
    "text-teal-600",
    "text-teal-700",
    "border-teal-500",
    "ring-teal-500",
    "animate-pulse",
    "hidden",
  ],
};
