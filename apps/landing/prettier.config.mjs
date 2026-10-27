import shared from "@jeep-in/config/prettier";

/** @type {import("prettier").Config} */
const config = { ...shared, tailwindStylesheet: "./src/app/globals.css" };

export default config;
