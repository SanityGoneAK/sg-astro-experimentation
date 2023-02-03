import path from "path";
import { defineConfig } from "astro/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), svelte()],
  vite: {
    plugins: [vanillaExtractPlugin()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // force .json imports into their own chunks
            // so that they aren't inadvertently redownloaded
            if (id.endsWith(".json")) {
              const { base } = path.parse(id);
              return base;
            }
            return;
          },
        },
      },
    },
  },
});
