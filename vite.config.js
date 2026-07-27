import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({mode}) => {
   const env = loadEnv(mode, process.cwd(), "");

   return {
      plugins: [react(), tailwindcss()],
      server: env.VITE_DEV_PROXY_TARGET
         ? {
            proxy: {
               "/api": {
                  target: env.VITE_DEV_PROXY_TARGET,
                  changeOrigin: true,
                  secure: false,
               },
            },
         }
         : undefined,
   };
});
