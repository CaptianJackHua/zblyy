import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
// 构建产物部署在 GitHub Pages 的项目站点（/zblyy/）下，需要设置 base；
// 本地开发仍使用根路径，避免影响 dev server。
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/zblyy/" : "/",
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
}));
