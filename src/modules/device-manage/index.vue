<template>
  <view class="device-page">
    <view class="page-header">
      <text class="page-title">设备管理</text>
      <text class="page-desc">绑定智能设备，同步健康数据</text>
    </view>

    <view class="connected-section">
      <view class="section-title-row">
        <text class="section-title">已连接设备</text>
        <text class="connect-count">{{ devices.length }} 台</text>
      </view>
      <view class="device-list" v-if="devices.length">
        <view class="device-card" v-for="d in devices" :key="d.id">
          <view class="device-icon" :style="{ background: d.color }"><zb-icon :name="d.icon" /></view>
          <view class="device-info">
            <text class="device-name">{{ d.name }}</text>
            <text class="device-model">{{ d.model }}</text>
            <view class="device-status-row">
              <text class="device-status" :class="{ online: d.online }">● {{ d.online ? '在线' : '离线' }}</text>
              <text class="device-battery"><zb-icon name="battery" /> {{ d.battery }}%</text>
            </view>
          </view>
          <view class="device-actions">
            <text class="action-link" @click="onDisconnect(d)">断开</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-device">
        <text class="empty-icon"><zb-icon name="watch" /></text>
        <text class="empty-text">暂未连接任何设备</text>
      </view>
    </view>

    <view class="add-section">
      <view class="section-title-row">
        <text class="section-title">添加设备</text>
      </view>
      <view class="device-types">
        <view class="type-card" v-for="t in deviceTypes" :key="t.id" @click="onAddDevice(t)">
          <view class="type-icon"><zb-icon :name="t.icon" /></view>
          <text class="type-name">{{ t.name }}</text>
          <text class="type-desc">{{ t.desc }}</text>
        </view>
      </view>
    </view>

    <view class="tips-section">
      <view class="tips-title"><zb-icon name="lightbulb" /> 连接提示</view>
      <view class="tips-list">
        <text class="tip-item">1. 确保手机蓝牙已开启</text>
        <text class="tip-item">2. 设备已充满电并处于配对模式</text>
        <text class="tip-item">3. 首次连接需在设备附近操作</text>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const devices = [
  { id: 1, name: '智能健康手环', model: 'Health Band Pro', icon: 'watch', color: '#e0f7f5', online: true, battery: 85 },
  { id: 2, name: '智能血压计', model: 'BP Monitor X1', icon: 'droplet', color: '#e8f4fd', online: false, battery: 42 }
];

const deviceTypes = [
  { id: 1, name: '智能手环', desc: '心率/血氧/睡眠监测', icon: 'watch' },
  { id: 2, name: '智能手表', desc: 'GPS/运动模式/ECG', icon: 'watch' },
  { id: 3, name: '血压计', desc: '上臂式/腕式', icon: 'droplet' },
  { id: 4, name: '血糖仪', desc: '家用采血测量', icon: 'droplet' },
  { id: 5, name: '体脂秤', desc: '体重/体脂/肌肉量', icon: 'scale' },
  { id: 6, name: '智能鞋垫', desc: '步态分析/足压监测', icon: 'run' }
];

const onDisconnect = (d: any) => {
  uni.showModal({
    title: '断开设备',
    content: `确定要断开「${d.name}」吗？`,
    success: (res) => {
      if (res.confirm) uni.showToast({ title: '已断开', icon: 'success' });
    }
  });
};

const onAddDevice = (t: any) => {
  uni.showLoading({ title: '搜索设备中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: `已开始搜索 ${t.name}`, icon: 'none' });
  }, 1500);
};
</script>

<style lang="scss" scoped>
.device-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-header { background: #fff; padding: 40rpx 32rpx; text-align: center; border-bottom: 1rpx solid $zb-border-light; }
.page-title { font-size: 36rpx; font-weight: 700; color: $zb-text-primary; display: block; }
.page-desc { font-size: 24rpx; color: $zb-text-tertiary; margin-top: 8rpx; display: block; }

.connected-section { margin: 24rpx 32rpx; background: #fff; border-radius: 20rpx; padding: 28rpx; }
.section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }
.connect-count { font-size: 24rpx; color: $zb-primary; background: $zb-primary-light; padding: 4rpx 16rpx; border-radius: 16rpx; }

.device-list { display: flex; flex-direction: column; gap: 16rpx; }
.device-card { display: flex; align-items: center; gap: 16rpx; padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.device-icon { width: 88rpx; height: 88rpx; border-radius: 20rpx; display: flex; align-items: center; justify-content: center; font-size: 44rpx; flex-shrink: 0; }
.device-info { flex: 1; }
.device-name { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.device-model { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; display: block; }
.device-status-row { display: flex; gap: 20rpx; margin-top: 8rpx; }
.device-status { font-size: 22rpx; color: $zb-text-tertiary; }
.device-status.online { color: $zb-success; }
.device-battery { font-size: 22rpx; color: $zb-text-secondary; }
.device-actions .action-link { font-size: 24rpx; color: #ff4d4f; }

.empty-device { display: flex; flex-direction: column; align-items: center; padding: 40rpx 0; }
.empty-icon { font-size: 64rpx; margin-bottom: 16rpx; }
.empty-text { font-size: 26rpx; color: $zb-text-tertiary; }

.add-section { margin: 24rpx 32rpx; background: #fff; border-radius: 20rpx; padding: 28rpx; }
.device-types { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20rpx; }
.type-card { padding: 24rpx 12rpx; background: $zb-bg-grey; border-radius: 16rpx; display: flex; flex-direction: column; align-items: center; }
.type-icon { font-size: 44rpx; margin-bottom: 12rpx; }
.type-name { font-size: 24rpx; font-weight: 500; color: $zb-text-primary; }
.type-desc { font-size: 18rpx; color: $zb-text-tertiary; margin-top: 4rpx; text-align: center; }

.tips-section { margin: 24rpx 32rpx; padding: 24rpx; background: #fffbe6; border-radius: 16rpx; border: 1rpx solid #ffe58f; }
.tips-title { font-size: 26rpx; font-weight: 600; color: $zb-warning; margin-bottom: 12rpx; }
.tips-list { display: flex; flex-direction: column; gap: 6rpx; }
.tip-item { font-size: 24rpx; color: $zb-text-secondary; line-height: 1.6; }

.bottom-space { height: 40rpx; }
</style>
