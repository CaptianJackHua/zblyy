import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

// GitHub Pages 部署：资源前缀
// 本地 dev 用根路径，build 时用 /zblyy/
const isGhPages = process.env.GH_PAGES === '1'

export default defineConfig({
  plugins: [uni()],
  base: isGhPages ? '/zblyy/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
})
