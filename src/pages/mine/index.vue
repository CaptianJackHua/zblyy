<template>
  <view class="mine-page">
    <view class="user-header">
      <view class="header-bg"></view>
      <view class="user-content">
        <view class="user-avatar"><zb-icon name="user" /></view>
        <view class="user-info">
          <view class="user-name-row">
            <text class="user-name" @click="goLogin">点击登录</text>
            <view class="user-level">
              <text>银卡会员</text>
              <text class="arrow"><zb-icon name="chevronRight" /></text>
            </view>
          </view>
          <text class="user-desc">登录后查看完整健康档案</text>
        </view>
      </view>
    </view>

    <view class="stats-card">
      <view v-for="stat in stats" :key="stat.label" class="stat-item" @click="onStat(stat)">
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
      </view>
    </view>

    <view class="section-group">
      <view class="menu-section">
        <view class="menu-item" v-for="item in healthMenu" :key="item.path" @click="goTo(item.path)">
          <view class="menu-left">
            <zb-icon class="menu-icon" :name="item.icon" />
            <text class="menu-name">{{ item.name }}</text>
          </view>
          <text class="menu-arrow"><zb-icon name="chevronRight" /></text>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-item" v-for="item in serviceMenu" :key="item.path" @click="goTo(item.path)">
          <view class="menu-left">
            <zb-icon class="menu-icon" :name="item.icon" />
            <text class="menu-name">{{ item.name }}</text>
          </view>
          <text class="menu-arrow"><zb-icon name="chevronRight" /></text>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-item" v-for="item in otherMenu" :key="item.name">
          <view class="menu-left">
            <zb-icon class="menu-icon" :name="item.icon" />
            <text class="menu-name">{{ item.name }}</text>
          </view>
          <text class="menu-arrow"><zb-icon name="chevronRight" /></text>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { mallState, mallUi } from '@/utils/mall-store';
import { expertState } from '@/utils/expert-store';

const stats = computed(() => [
  { label: '健康档案', value: '3', path: '/modules/health-archive/index' },
  { label: '预约记录', value: String(expertState.appointments.length), path: '/modules/expert/appointments' },
  { label: '我的订单', value: String(mallState.orders.length), section: 'mine' as const },
  { label: '积分', value: '1280', path: '/modules/member/points' }
]);

const onStat = (stat: { path?: string; section?: 'mall' | 'cart' | 'mine' }) => {
  if (stat.section) {
    mallUi.section = stat.section;
    uni.switchTab({ url: '/pages/shop/index' });
    return;
  }
  if (stat.path) uni.navigateTo({ url: stat.path });
};

const healthMenu = [
  { icon: 'clipboard', name: '健康档案', path: '/modules/health-archive/index' },
  { icon: 'chart', name: '健康评估', path: '/modules/health-assessment/index' },
  { icon: 'watch', name: '设备管理', path: '/modules/device-manage/index' },
  { icon: 'file', name: '我的报告', path: '/modules/health-report/index' }
];

const serviceMenu = [
  { icon: 'card', name: '我的会员', path: '/modules/member/index' },
  { icon: 'gift', name: '亲友关怀', path: '/modules/member/family-care' },
  { icon: 'star', name: '积分与礼遇', path: '/modules/member/points' },
  { icon: 'mapPin', name: '附近门店', path: '/modules/store/index' }
];

const otherMenu = [
  { icon: 'phone', name: '联系客服' },
  { icon: 'settings', name: '设置' },
  { icon: 'info', name: '关于我们' }
];

const goTo = (url: string) => uni.navigateTo({ url });
const goLogin = () => uni.navigateTo({ url: '/modules/login/index' });
</script>

<style lang="scss" scoped>
.mine-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 120rpx; }
.user-header { position: relative; height: 320rpx; }
.header-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #2ec4b6 0%, #3b82f6 100%); }
.user-content { position: relative; z-index: 1; padding: 100rpx 32rpx 0; display: flex; align-items: center; gap: 24rpx; }
.user-avatar { width: 120rpx; height: 120rpx; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 60rpx; border: 4rpx solid rgba(255,255,255,0.5); }
.user-info { flex: 1; }
.user-name-row { display: flex; align-items: center; gap: 16rpx; }
.user-name { font-size: 36rpx; font-weight: 700; color: #fff; }
.user-level { display: flex; align-items: center; gap: 4rpx; padding: 6rpx 16rpx; background: rgba(255,255,255,0.25); border-radius: 16rpx; font-size: 22rpx; color: #fff; }
.user-desc { display: block; font-size: 24rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; }

.stats-card { display: flex; margin: -50rpx 32rpx 0; background: #fff; border-radius: 20rpx; padding: 32rpx 0; position: relative; z-index: 2; box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08); }
.stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.stat-value { font-size: 36rpx; font-weight: 700; color: $zb-text-primary; }
.stat-label { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; }

.section-group { padding: 24rpx 32rpx 0; }
.menu-section { background: #fff; border-radius: 20rpx; margin-bottom: 24rpx; overflow: hidden; }
.menu-item { display: flex; align-items: center; justify-content: space-between; padding: 28rpx 32rpx; border-bottom: 1rpx solid $zb-border-light; }
.menu-item:last-child { border-bottom: none; }
.menu-left { display: flex; align-items: center; gap: 16rpx; }
.menu-icon { font-size: 36rpx; width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center; background: $zb-bg-grey; border-radius: 16rpx; }
.menu-name { font-size: 28rpx; color: $zb-text-primary; }
.menu-arrow { font-size: 36rpx; color: $zb-text-tertiary; }

.bottom-space { height: 40rpx; }
</style>
