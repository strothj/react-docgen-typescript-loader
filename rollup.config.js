import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";

export default {
  input: "src/index.ts",

  output: {
    file: "dist/index.js",
    format: "cjs",
  },

  external: [
    "fs",
    "path",
    "typescript",
    "react-docgen-typescript/lib/parser.js",
    "ajv",
  ],

  plugins: [typescript(), json()],
};
