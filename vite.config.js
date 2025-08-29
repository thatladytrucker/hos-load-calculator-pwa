import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["/icons/apple-touch-icon-180.png"],
      manifest: {
        name: "HOS Load Calculator",
        short_name: "HOS Calc",
        description: "On-time load planner with HOS-aware ETA/PTA.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0b0b0f",
        theme_color: "#0ea5e9",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,png,svg}"]
      },
      devOptions: { enabled: true }
    })
  ]
});
