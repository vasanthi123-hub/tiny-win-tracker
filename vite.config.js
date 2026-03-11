import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["vite.svg"],
      manifest: {
        name: "Tiny Wins",
        short_name: "Tiny Wins",
        description: "Track your little wins and build confidence every day.",
        theme_color: "#8b5cf6",
        background_color: "#fff8fc",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/vite.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});