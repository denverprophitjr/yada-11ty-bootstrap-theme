import { terser } from "rollup-plugin-terser";

export default {
  input: "src/assets/js/main.js",
  output: [
    {
      file: "assets/js/min.js",
      format: "iife",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
};
