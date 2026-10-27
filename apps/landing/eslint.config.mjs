import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { base } from "@jeep-in/config/eslint";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Last, so the shared rules and eslint-config-prettier win over Next's presets.
  ...base,
  globalIgnores([".next/**", "out/**", "build/**", "public/**", "next-env.d.ts"]),
]);
