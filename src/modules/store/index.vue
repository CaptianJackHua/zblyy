<template>
  <view class="store-page">
    <view class="page-header">
      <view class="search-box" @click="uni.navigateTo({ url: '/modules/search/index' })">
        <text class="search-icon"><zb-icon name="search" /></text>
        <text class="search-placeholder">搜索门店名称或地址</text>
      </view>
      <view class="location-btn">
        <text class="loc-icon"><zb-icon name="mapPin" /></text>
        <text class="loc-text">当前位置</text>
      </view>
    </view>

    <view class="map-section">
      <view class="map-bg">
        <text class="map-emoji"><zb-icon name="map" /></text>
        <view class="map-pins">
          <view class="pin pin-1"><zb-icon name="mapPin" /><text>朝阳店</text></view>
          <view class="pin pin-2"><zb-icon name="mapPin" /><text>海淀店</text></view>
          <view class="pin pin-3"><zb-icon name="mapPin" /><text>东城店</text></view>
        </view>
      </view>
      <view class="map-controls">
        <view class="ctrl-btn">＋</view>
        <view class="ctrl-btn">－</view>
        <view class="ctrl-btn"><zb-icon name="target" /></view>
      </view>
    </view>

    <view class="list-header">
      <text class="list-title">附近门店</text>
      <text class="list-count">共 {{ stores.length }} 家</text>
    </view>

    <view class="store-list">
      <view class="store-card" v-for="store in stores" :key="store.id">
        <view class="store-icon"><zb-icon name="hospital" /></view>
        <view class="store-info">
          <view class="store-top">
            <text class="store-name">{{ store.name }}</text>
            <view class="store-tag" v-if="store.tag">{{ store.tag }}</view>
          </view>
          <text class="store-addr"><zb-icon name="mapPin" /> {{ store.address }}</text>
          <view class="store-meta">
            <text class="store-distance">距您 {{ store.distance }} km</text>
            <text class="store-tel"><zb-icon name="phone" /> {{ store.tel }}</text>
          </view>
          <text class="store-hours"><zb-icon name="clock" /> 营业时间: {{ store.hours }}</text>
        </view>
        <view class="store-action">
          <view class="action-btn" @click="onNavigate(store)">导航</view>
          <view class="action-btn ghost" @click="onCall(store)">电话</view>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const stores = [
  { id: 1, name: '中兵康养中心（朝阳店）', address: '北京市朝阳区建国路 88 号 SOHO 现代城 A 座', distance: 2.3, tel: '010-88888888', hours: '09:00 - 21:00', tag: '旗舰店' },
  { id: 2, name: '中兵康养中心（海淀店）', address: '北京市海淀区中关村大街 1 号海龙大厦 3 层', distance: 5.8, tel: '010-66666666', hours: '09:00 - 20:00', tag: '' },
  { id: 3, name: '中兵康养中心（东城店）', address: '北京市东城区东长安街 100 号东方广场 B 座', distance: 8.1, tel: '010-77777777', hours: '09:00 - 19:00', tag: '' },
  { id: 4, name: '中兵康养中心（西城店）', address: '北京市西城区金融大街 8 号', distance: 10.5, tel: '010-55555555', hours: '09:00 - 20:00', tag: '新店' }
];

const onNavigate = (s: any) => uni.showToast({ title: `导航到 ${s.name}`, icon: 'none' });
const onCall = (s: any) => uni.showModal({ title: '拨打电话', content: `确定拨打 ${s.tel} 吗？` });
</script>

<style lang="scss" scoped>
.store-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-header { display: flex; align-items: center; padding: 20rpx 32rpx; background: #fff; gap: 16rpx; padding-top: calc(20rpx + var(--status-bar-height, 44px)); }
.search-box { flex: 1; display: flex; align-items: center; background: $zb-bg-grey; border-radius: 36rpx; padding: 14rpx 24rpx; gap: 12rpx; }
.search-icon { font-size: 28rpx; }
.search-placeholder { flex: 1; font-size: 26rpx; color: $zb-text-tertiary; }
.location-btn { display: flex; align-items: center; gap: 6rpx; padding: 14rpx 20rpx; background: $zb-primary-light; border-radius: 20rpx; }
.loc-icon { font-size: 24rpx; }
.loc-text { font-size: 24rpx; color: $zb-primary; font-weight: 500; }

.map-section { position: relative; height: 360rpx; margin: 0 32rpx; border-radius: 20rpx; overflow: hidden; }
.map-bg { width: 100%; height: 100%; background: linear-gradient(135deg, #e0f7f5 0%, #e8f4fd 50%, #fef3e2 100%); position: relative; }
.map-emoji { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 80rpx; opacity: 0.3; }
.map-pins { position: absolute; inset: 0; }
.pin { position: absolute; font-size: 28rpx; }
.pin text { margin-left: 4rpx; font-size: 20rpx; background: #fff; padding: 2rpx 8rpx; border-radius: 8rpx; }
.pin-1 { top: 60rpx; left: 80rpx; }
.pin-2 { top: 140rpx; right: 100rpx; }
.pin-3 { bottom: 60rpx; left: 200rpx; }
.map-controls { position: absolute; right: 16rpx; bottom: 16rpx; display: flex; flex-direction: column; gap: 8rpx; }
.ctrl-btn { width: 56rpx; height: 56rpx; background: #fff; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1); }

.list-header { display: flex; justify-content: space-between; align-items: center; padding: 32rpx; }
.list-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }
.list-count { font-size: 24rpx; color: $zb-text-tertiary; }

.store-list { padding: 0 32rpx; }
.store-card { display: flex; gap: 20rpx; padding: 24rpx; background: #fff; border-radius: 20rpx; margin-bottom: 20rpx; }
.store-icon { width: 88rpx; height: 88rpx; background: $zb-primary-light; border-radius: 20rpx; display: flex; align-items: center; justify-content: center; font-size: 44rpx; flex-shrink: 0; }
.store-info { flex: 1; min-width: 0; }
.store-top { display: flex; align-items: center; gap: 12rpx; }
.store-name { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.store-tag { padding: 2rpx 12rpx; background: linear-gradient(90deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 18rpx; border-radius: 6rpx; }
.store-addr { font-size: 24rpx; color: $zb-text-secondary; margin-top: 8rpx; display: block; }
.store-meta { display: flex; gap: 20rpx; margin-top: 6rpx; }
.store-meta text { font-size: 22rpx; color: $zb-text-tertiary; }
.store-hours { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; display: block; }

.store-action { display: flex; flex-direction: column; gap: 12rpx; }
.action-btn { padding: 12rpx 20rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 24rpx; border-radius: 16rpx; text-align: center; }
.action-btn.ghost { background: $zb-bg-grey; color: $zb-text-secondary; }

.bottom-space { height: 40rpx; }
</style>
