<script setup lang="ts">
// App 入口 - 仅用于全局生命周期
// 真实 uni-app 项目需要在此导入 Wot UI 全局样式等
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('[App] onLaunch - 中兵康养启动')
})

onShow(() => {
  console.log('[App] onShow')
})

onHide(() => {
  console.log('[App] onHide')
})
</script>

<style lang="scss">
/* ========== 全局主题变量 ========== */
page {
  /* 主题色 */
  --brand-primary: #36c994;
  --brand-blue: #4298e8;
  --brand-orange: #f7941d;

  /* 文字色 */
  --text-main: #1f2937;
  --text-sub: #6b7280;
  --text-light: #9ca3af;

  /* 背景 */
  --bg-page: #f5f7fa;
  --bg-white: #ffffff;

  /* 圆角 */
  --radius-card: 16rpx;
  --radius-sm: 12rpx;

  /* 阴影 */
  --shadow-card: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  background: var(--bg-page);
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
}

/* 全局重置 */
view, text, image {
  box-sizing: border-box;
}
</style>
