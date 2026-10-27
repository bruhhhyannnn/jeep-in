import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint flat configs for every JEEP-IN app and package (ESLint 9: the React,
 * accessibility and import plugins in eslint-config-next do not support ESLint 10 yet).
 *
 *   base        — JavaScript + TypeScript recommended rules (packages, scripts)
 *   react       — base + the React hooks rules (Vite apps)
 *   reactNative — react + Metro's `require()` for images and fonts (Expo apps)
 *
 * Next.js apps use `base` with eslint-config-next, which brings its own React hooks rules.
 * Formatting is Prettier's job (lint-staged on commit), so formatting rules are off here.
 */

const ignores = {
  ignores: [
    "**/node_modules/**",
    "**/dist/**",
    "**/dev-dist/**",
    "**/build/**",
    "**/.next/**",
    "**/.expo/**",
    "**/.turbo/**",
    "**/android/**",
    "**/ios/**",
    "**/next-env.d.ts",
    "**/expo-env.d.ts",
    "**/nativewind-env.d.ts",
  ],
};

export const base = tseslint.config(
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    // Config files and scripts run in Node.
    files: ["*.{js,mjs,cjs,ts}", "scripts/**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
  },
  {
    // CommonJS config files (Metro, Tailwind for NativeWind) and Node scripts that load
    // JSON credentials by path.
    files: ["**/*.cjs", "*.config.js", "scripts/**/*.{js,mjs,cjs,ts}"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  prettier,
);

export const react = tseslint.config(...base, {
  files: ["**/*.{ts,tsx,js,jsx}"],
  ignores: ["*.{js,mjs,cjs,ts}", "scripts/**"],
  languageOptions: { globals: globals.browser },
  plugins: { "react-hooks": reactHooks },
  rules: { ...reactHooks.configs.recommended.rules },
});

export const reactNative = tseslint.config(...react, {
  files: ["**/*.{ts,tsx,js,jsx}"],
  ignores: ["*.{js,mjs,cjs,ts}", "scripts/**"],
  rules: {
    // Metro resolves static assets through `require()`.
    "@typescript-eslint/no-require-imports": [
      "error",
      { allow: ["\\.(png|jpe?g|gif|webp|otf|ttf|mp3|wav|mp4|json)$"] },
    ],
  },
});
