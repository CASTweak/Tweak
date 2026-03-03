import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [tailwindcss(), viteSingleFile()],
  build: {
    // Single HTML file output for embedding in the dylib
    assetsInlineLimit: Infinity,
  },
});
