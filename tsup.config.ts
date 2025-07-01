import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm", "cjs"],
  entry: ["./src/index.ts"],
  skipNodeModulesBundle: true,
  clean: true,
  shims: true,
  dts: true,
  minify: true,
});
