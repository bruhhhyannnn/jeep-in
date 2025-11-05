const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  ...expo,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": ["error"],
    },
  },
  {
    ignores: ["node_modules", "dist", "build"],
  },
]);
