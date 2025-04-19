import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Changing the base location
  // from '/' to './'
  base: "./",
  // Changing the outdir,
  // so that the build files created by
  // electron and react stay in seprate folders
  build: {
    outDir: "dist/ui",
  },
  // Changing server config
  server: {
    port: 3000,
    strictPort: true,
  },
});
