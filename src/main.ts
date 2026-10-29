import { createSSRApp } from 'vue'
import App from './App.vue'

// Wot UI V2 - 真实项目需要安装后注册:
// import WotUI from '@wot-ui/ui'
// import '@wot-ui/ui/dist/style.css'

export function createApp() {
  const app = createSSRApp(App)
  // app.use(WotUI)
  return { app }
}
