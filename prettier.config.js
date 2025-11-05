/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 100, // Wrap lines at 100 chars
  tabWidth: 2, // 2 spaces per tab
  useTabs: false, // Use spaces, not tabs
  semi: true, // Always end statements with semicolons
  singleQuote: false, // Use double quotes (consistent with RN style)
  trailingComma: "all", // Trailing commas wherever valid in ES5 (objects, arrays, etc.)
  bracketSpacing: true, // Space inside object literals { foo: bar }
  bracketSameLine: false, // JSX closing bracket on new line
  arrowParens: "always", // Always include parentheses around arrow function args
  endOfLine: "lf", // Line feed only (avoid Windows CRLF issues)
  jsxSingleQuote: false, // Use double quotes in JSX
  quoteProps: "as-needed", // Only quote object properties when required
  plugins: [require("prettier-plugin-tailwindcss")], // Sort Tailwind classes automatically
  tailwindFunctions: ["clsx", "cn", "cva"], // Recognize these for class sorting
};
