/**
 * The one Prettier config for every JEEP-IN app (the native app's settings).
 * Apps re-export it; Tailwind v4 apps add `tailwindStylesheet` so classes sort by their theme.
 *
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cn", "cva"],
};

export default config;
