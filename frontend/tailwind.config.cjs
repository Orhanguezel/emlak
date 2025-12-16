/** @type {import('tailwindcss').Config} */
import { customPagesSafelist } from './src/data/twSafelist.customPages'
export default {
  darkMode: "class",

  /**
   * Buradaki selector, TÜM Tailwind utility’lerini sadece
   * [data-app] kapsayıcısı içinde üretir → public site’i bozmaz.
   */
  important: "[data-app]",

  // v4'te content gerekli değil ama bırakmanın zararı yok
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // Tema/token’ları CSS tarafında yöneteceğiz (src/styles/tailwind.css)
  theme: {},
  plugins: [],
  safelist: [
    "bg-teal-500","bg-teal-600","text-teal-600","text-teal-700",
    "border-teal-500","ring-teal-500","animate-pulse","hidden",
    ...customPagesSafelist
  ],
};
