import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias your library source so you can import it in dev
      "@": path.resolve(__dirname, "./src"),
      "@css": path.resolve(__dirname, "./css"),
    },
  },
  root: "./dev", // Set dev folder as root for the dev server
});
