import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  base: "/nhat-ky-suc-khoe/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png", "family.jpeg"],
      manifest: {
        name: "Nhật ký sức khỏe",
        short_name: "Sức khỏe",
        description: "Nhật ký theo dõi sức khỏe tại nhà",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/nhat-ky-suc-khoe/",
        scope: "/nhat-ky-suc-khoe/",
        icons: [
          {
            src: "/nhat-ky-suc-khoe/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/nhat-ky-suc-khoe/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"]
      }
    })
  ]
})