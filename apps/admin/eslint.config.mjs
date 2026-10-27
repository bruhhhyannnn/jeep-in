import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { base } from "@jeep-in/config/eslint";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Last, so the shared rules and eslint-config-prettier win over Next's presets.
  ...base,
  {
    // These React Compiler rules arrived with eslint-config-next 16, after most admin
    // pages were written. They stay visible as warnings and get fixed as each page is
    // reworked.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "public/**",
    "next-env.d.ts",
    "scripts/backups/**",
    // Vendored from mapcn.
    "src/components/ui/map.tsx",
  ]),
]);
