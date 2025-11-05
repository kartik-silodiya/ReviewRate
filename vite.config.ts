import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path from "path"; // <-- 1. ADD THIS IMPORT

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  resolve: { // <-- 2. ADD THIS ENTIRE 'resolve' BLOCK
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});