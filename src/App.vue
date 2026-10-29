<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("中兵康养 App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
@import "./styles/global.scss";

/* ================= H5 画布：375 × 900 ================= */
/* #ifdef H5 */
html,
body {
  height: 100%;
  margin: 0;
  background: #dfe4ea;
}

body {
  overflow: auto;
}

/* #app 作为小程序画布：自身不滚动，页面在内部滚动 */
#app {
  position: relative;
  width: 375px;
  height: 900px;
  margin: 16px auto;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 12px 40px rgba(26, 26, 46, 0.16);
  transform: translateZ(0); /* 让内部 fixed 定位元素以画布为参照 */
}

uni-page {
  display: flex !important;
  flex-direction: column;
  height: 100% !important;
}

uni-page-wrapper {
  flex: 1;
  min-height: 0;
  height: auto !important;
}

uni-page-body {
  height: 100% !important;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 底部 TabBar 始终贴住画布底部 */
uni-tabbar,
.uni-tabbar-bottom,
.uni-tabbar-bottom .uni-tabbar {
  position: fixed !important;
  top: auto !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
}
/* #endif */

/* Wot UI 主题变量覆盖 */
page {
  --wot-color-primary: #2ec4b6;
  --wot-color-primary-light-1: #4dcdc2;
  --wot-color-primary-light-2: #70d8cf;
  --wot-color-primary-light-3: #9de5de;
  --wot-color-primary-light-5: #c6f0eb;
  --wot-color-primary-light-7: #def6f3;
  --wot-color-primary-light-8: #eaf8f7;
  --wot-color-primary-light-9: #f5fbfa;
  --wot-color-primary-dark-2: #25a095;
  --wot-color-success: #52c41a;
  --wot-color-warning: #faad14;
  --wot-color-danger: #ff4d4f;
  --wot-color-info: #909399;
  --wot-bg-color-page: #f5f7fa;
}
</style>
