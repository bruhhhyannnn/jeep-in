import tokens from "@jeep-in/tokens/tailwind";

// Colours, radii, shadows and fonts come from the shared preset in packages/tokens.
// The semantic colours resolve through the CSS variables in app/global.css.

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  presets: [tokens],
  content: ["./index.html", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
};
