const { defineConfig } = require("eslint/config");

module.exports = defineConfig({
  extends: ["expo", "prettier"],
  plugins: {
    prettier: require("eslint-plugin-prettier"),
  },
  rules: {
    "prettier/prettier": "error",
  },
  ignorePatterns: ["node_modules", "dist", "build"],
});
