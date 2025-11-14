// functions/eslint.config.js
export default [
  {
    files: ["**/*.ts", "**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      // Keep it minimal for Cloud Functions
      "no-unused-vars": "warn",
      "no-undef": "off",
    },
  },
];
