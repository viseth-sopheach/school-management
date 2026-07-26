import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://school-management-2ito.onrender.com",
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: "https://school-management-system-sandy-nine.vercel.app",
        },
      },
    },
  },
});
