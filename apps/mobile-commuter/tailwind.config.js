/** @type {import('tailwindcss').Config} */

// Colours, radii, shadows and fonts come from the shared preset in packages/tokens.
// The semantic colours resolve through the CSS variables in app/global.css.
// NativeWind's preset is listed last so its native defaults win over Tailwind's,
// which every preset brings in.
module.exports = {
  darkMode: "class",
  presets: [require("@jeep-in/tokens/tailwind"), require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
};
