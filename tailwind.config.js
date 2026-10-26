/** @type {import('tailwindcss').Config} */

// Semantic colours resolve through CSS variables (see app/global.css) so they
// switch with the Appearance setting. Ramps are fixed and used where a colour
// must not change between themes (jeep markers, inverse cards).
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: token("page"),
        card: token("card"),
        sunken: token("sunken"),
        inverse: token("inverse"),
        "inverse-raised": token("inverse-raised"),
        line: token("line"),
        "line-strong": token("line-strong"),
        ink: token("ink"),
        muted: token("muted"),
        faint: token("faint"),
        action: token("action"),
        "action-ink": token("action-ink"),
        "action-tint": token("action-tint"),
        accent: token("accent"),
        "accent-ink": token("accent-ink"),
        live: token("live"),
        "live-tint": token("live-tint"),
        "live-ink": token("live-ink"),
        danger: token("danger"),
        "danger-tint": token("danger-tint"),
        "danger-ink": token("danger-ink"),
        "warn-tint": token("warn-tint"),
        "warn-ink": token("warn-ink"),

        navy: {
          50: "#eaf0f8",
          200: "#b9cbe6",
          300: "#9fb8dc",
          400: "#5f7fae",
          500: "#2f5a93",
          600: "#1f4c86",
          800: "#173d70",
          900: "#11305a",
          950: "#0b1b33",
        },
        blue: {
          100: "#dbe9ff",
          200: "#cfe2ff",
          400: "#5a9ef2",
          600: "#1670e0",
        },
        yellow: {
          50: "#fff8e1",
          100: "#ffefb8",
          200: "#ffdd7a",
          300: "#ffd45c",
          400: "#ffc62e",
          600: "#e0a912",
          800: "#4a3a06",
        },
      },
      borderRadius: {
        tile: "16px",
        card: "22px",
        sheet: "28px",
      },
    },
  },
  plugins: [],
};
