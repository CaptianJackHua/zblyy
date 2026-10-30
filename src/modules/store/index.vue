<template>
  <view class="store-page">
    <view class="page-header">
      <view class="search-box" @click="goSearch">
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
          <view v-for="(s, idx) in stores.slice(0, 3)" :key="s.id" class="pin" :class="'pin-' + (idx + 1)">
            <zb-icon name="mapPin" /><text>{{ s.name.replace('中兵康养中心', '').replace(/（|）/g, '') }}</text>
          </view>
        </view>
      </view>
      <view class="map-controls">
        <view class="ctrl-btn" @click="zoom(1)">＋</view>
        <view class="ctrl-btn" @click="zoom(-1)">－</view>
        <view class="ctrl-btn"><zb-icon name="target" /></view>
      </view>
    </view>

    <view class="list-header">
      <text class="list-title">门店服务</text>
      <text class="list-count">共 {{ stores.length }} 家门店</text>
    </view>

    <view class="store-list">
      <view v-for="store in stores" :key="store.id" class="store-card" @click="goDetail(store.id)">
        <view class="store-top">
          <view class="store-icon"><zb-icon name="hospital" /></view>
          <view class="store-info">
            <view class="store-name-row">
              <text class="store-name">{{ store.name }}</text>
              <view v-if="store.tag" class="store-tag">{{ store.tag }}</view>
            </view>
            <view class="store-rate">
              <zb-icon name="star" color="#ff9f0a" />
              <text class="rate-num">{{ store.rating }}</text>
              <text class="store-distance">· 距您 {{ store.distance }} km</text>
            </view>
          </view>
        </view>

        <view class="svc-tags">
          <text v-for="svc in store.services.slice(0, 4)" :key="svc.id" class="svc-tag">{{ svc.name }}</text>
        </view>

        <text class="store-addr"><zb-icon name="mapPin" /> {{ store.address }}</text>
        <view class="store-foot">
          <text class="store-hours"><zb-icon name="clock" /> {{ store.hours }}</text>
          <view class="store-actions">
            <view class="action-btn ghost" @click.stop="onCall(store)">电话</view>
            <view class="action-btn" @click.stop="goDetail(store.id)">进店</view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { stores } from '@/data/stores';

const goSearch = () => uni.navigateTo({ url: '/modules/search/index' });
const goDetail = (id: number) => uni.navigateTo({ url: `/modules/store/detail?id=${id}` });
const onCall = (s: { tel: string; name: string }) =>
  uni.showModal({ title: '拨打电话', content: `确定拨打 ${s.tel} 吗？` });
const zoom = (n: number) => uni.showToast({ title: n > 0 ? '已放大' : '已缩小', icon: 'none' });
</script>

<style lang="scss" scoped>
.store-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-header { display: flex; align-items: center; padding: 20rpx 32rpx; background: #fff; gap: 16rpx; }
.search-box { flex: 1; display: flex; align-items: center; background: $zb-bg-grey; border-radius: 36rpx; padding: 14rpx 24rpx; gap: 12rpx; }
.search-icon { font-size: 28rpx; color: $zb-text-tertiary; }
.search-placeholder { flex: 1; font-size: 26rpx; color: $zb-text-tertiary; }
.location-btn { display: flex; align-items: center; gap: 6rpx; padding: 14rpx 20rpx; background: $zb-primary-light; border-radius: 20rpx; }
.loc-icon { font-size: 24rpx; color: $zb-primary; }
.loc-text { font-size: 24rpx; color: $zb-primary; font-weight: 500; }

.map-section { position: relative; height: 320rpx; margin: 0 32rpx; border-radius: 20rpx; overflow: hidden; }
.map-bg { width: 100%; height: 100%; background: linear-gradient(135deg, #e0f7f5 0%, #e8f4fd 50%, #fef3e2 100%); position: relative; }
.map-emoji { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 80rpx; color: $zb-primary; opacity: 0.25; }
.map-pins { position: absolute; inset: 0; }
.pin { position: absolute; font-size: 26rpx; color: #ff4d4f; display: flex; align-items: center; gap: 4rpx; }
.pin text { font-size: 20rpx; color: $zb-text-secondary; background: #fff; padding: 2rpx 8rpx; border-radius: 8rpx; }
.pin-1 { top: 56rpx; left: 60rpx; }
.pin-2 { top: 130rpx; right: 80rpx; }
.pin-3 { bottom: 56rpx; left: 170rpx; }
.map-controls { position: absolute; right: 16rpx; bottom: 16rpx; display: flex; flex-direction: column; gap: 8rpx; }
.ctrl-btn { width: 56rpx; height: 56rpx; background: #fff; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 26rpx; color: $zb-text-secondary; box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08); }

.list-header { display: flex; justify-content: space-between; align-items: center; padding: 32rpx; }
.list-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }
.list-count { font-size: 24rpx; color: $zb-text-tertiary; }

.store-list { padding: 0 32rpx; display: flex; flex-direction: column; gap: 20rpx; }
.store-card { padding: 24rpx; background: #fff; border-radius: 24rpx; box-shadow: $zb-shadow-sm; }
.store-top { display: flex; gap: 20rpx; }
.store-icon { width: 88rpx; height: 88rpx; background: $zb-primary-light; border-radius: 20rpx; display: flex; align-items: center; justify-content: center; font-size: 44rpx; color: $zb-primary; flex-shrink: 0; }
.store-info { flex: 1; min-width: 0; }
.store-name-row { display: flex; align-items: center; gap: 10rpx; }
.store-name { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.store-tag { padding: 2rpx 10rpx; background: linear-gradient(90deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 18rpx; border-radius: 6rpx; flex-shrink: 0; }
.store-rate { display: flex; align-items: center; gap: 6rpx; margin-top: 8rpx; font-size: 22rpx; }
.rate-num { color: #ff9f0a; font-weight: 600; }
.store-distance { color: $zb-text-tertiary; }

.svc-tags { display: flex; flex-wrap: wrap; gap: 10rpx; margin-top: 18rpx; }
.svc-tag { padding: 6rpx 16rpx; background: $zb-bg-grey; color: $zb-primary; font-size: 22rpx; border-radius: 20rpx; }

.store-addr { display: flex; align-items: center; gap: 6rpx; margin-top: 14rpx; font-size: 24rpx; color: $zb-text-secondary; }
.store-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 16rpx; }
.store-hours { display: flex; align-items: center; gap: 6rpx; font-size: 22rpx; color: $zb-text-tertiary; }
.store-actions { display: flex; gap: 12rpx; }
.action-btn { padding: 10rpx 24rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 24rpx; border-radius: 24rpx; }
.action-btn.ghost { background: $zb-bg-grey; color: $zb-text-secondary; }

.bottom-space { height: 40rpx; }
</style>
