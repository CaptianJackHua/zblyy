<template>
  <view class="points-page">
    <view class="points-card">
      <view class="card-bg"></view>
      <view class="card-content">
        <text class="points-label">当前积分</text>
        <view class="points-row">
          <text class="points-value">1,280</text>
          <text class="points-unit">分</text>
        </view>
        <view class="points-hint">
          <text>积分即将到期：</text>
          <text class="hint-date">2027-12-31 前到期 200 分</text>
        </view>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-card" @click="onExchange">
        <text class="action-icon"><zb-icon name="gift" /></text>
        <text class="action-name">积分兑换</text>
      </view>
      <view class="action-card" @click="onHistory">
        <text class="action-icon"><zb-icon name="chart" /></text>
        <text class="action-name">积分明细</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">积分礼遇</text>
        <text class="section-subtitle">使用积分兑换心仪好物</text>
      </view>
      <view class="gift-grid">
        <view v-for="g in gifts" :key="g.id" class="gift-card" @click="onExchangeGift(g)">
          <view class="gift-image" :style="{ backgroundImage: `url(${g.image})` }"></view>
          <text class="gift-name">{{ g.name }}</text>
          <view class="gift-price">
            <text class="gift-points">{{ g.points }}</text>
            <text class="gift-unit">积分</text>
          </view>
          <view class="gift-btn" :class="{ disabled: g.points > 1280 }">{{ g.points > 1280 ? '积分不足' : '立即兑换' }}</view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">如何获取积分</text>
      </view>
      <view class="earn-list">
        <view v-for="e in earnMethods" :key="e.title" class="earn-item">
          <view class="earn-icon"><zb-icon :name="e.icon" /></view>
          <view class="earn-info">
            <text class="earn-title">{{ e.title }}</text>
            <text class="earn-desc">{{ e.desc }}</text>
          </view>
          <text class="earn-points">+{{ e.points }}</text>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const gifts = [
  { id: 1, name: '智能健康手环', points: 2000, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300' },
  { id: 2, name: '艾灸养生套装', points: 800, image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=300' },
  { id: 3, name: '养生茶礼盒', points: 500, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300' },
  { id: 4, name: '电子血压计', points: 1500, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300' },
  { id: 5, name: '按摩靠垫', points: 1200, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300' },
  { id: 6, name: '100 元服务券', points: 300, image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=300' }
];

const earnMethods = [
  { icon: 'cart', title: '消费获积分', desc: '每消费 1 元获 1 积分', points: '1/元' },
  { icon: 'edit', title: '完善健康档案', desc: '首次完成赠送', points: '50' },
  { icon: 'star', title: '评价服务', desc: '每次评价赠送', points: '20' },
  { icon: 'users', title: '邀请好友', desc: '成功邀请赠送', points: '100' },
  { icon: 'cake', title: '生日特权', desc: '生日当月双倍积分', points: '×2' }
];

const onExchange = () => uni.showToast({ title: '积分兑换中心', icon: 'none' });
const onHistory = () => uni.showToast({ title: '积分明细', icon: 'none' });
const onExchangeGift = (g: any) => {
  if (g.points > 1280) {
    uni.showToast({ title: '积分不足', icon: 'none' });
    return;
  }
  uni.showModal({
    title: '积分兑换',
    content: `使用 ${g.points} 积分兑换「${g.name}」？`,
    success: (res) => {
      if (res.confirm) uni.showToast({ title: '兑换成功！', icon: 'success' });
    }
  });
};
</script>

<style lang="scss" scoped>
.points-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.points-card { position: relative; margin: 24rpx 32rpx; border-radius: 24rpx; overflow: hidden; }
.card-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%); }
.card-bg::before { content: ''; position: absolute; top: -80%; right: -20%; width: 300rpx; height: 300rpx; background: rgba(255,255,255,0.15); border-radius: 50%; }
.card-content { position: relative; z-index: 1; padding: 32rpx; color: #fff; }
.points-label { font-size: 26rpx; opacity: 0.9; }
.points-row { display: flex; align-items: baseline; margin-top: 12rpx; }
.points-value { font-size: 72rpx; font-weight: 700; }
.points-unit { font-size: 26rpx; margin-left: 8rpx; }
.points-hint { display: flex; align-items: center; gap: 8rpx; margin-top: 16rpx; font-size: 22rpx; opacity: 0.9; }
.hint-date { color: #fff; font-weight: 500; }

.quick-actions { display: flex; gap: 20rpx; margin: 0 32rpx; }
.action-card { flex: 1; display: flex; align-items: center; gap: 16rpx; padding: 20rpx 24rpx; background: #fff; border-radius: 16rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04); }
.action-icon { font-size: 36rpx; }
.action-name { font-size: 26rpx; color: $zb-text-primary; font-weight: 500; }

.section { margin: 24rpx 32rpx; background: #fff; border-radius: 20rpx; padding: 24rpx; }
.section-header { margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; display: block; }
.section-subtitle { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; display: block; }

.gift-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16rpx; }
.gift-card { background: $zb-bg-grey; border-radius: 16rpx; overflow: hidden; }
.gift-image { width: 100%; height: 200rpx; background-size: cover; background-position: center; }
.gift-name { font-size: 24rpx; font-weight: 500; color: $zb-text-primary; padding: 12rpx 16rpx 4rpx; display: block; }
.gift-price { display: flex; align-items: baseline; gap: 4rpx; padding: 0 16rpx; }
.gift-points { font-size: 32rpx; font-weight: 700; color: #ff4d4f; }
.gift-unit { font-size: 20rpx; color: #ff4d4f; }
.gift-btn { margin: 12rpx; padding: 10rpx 0; text-align: center; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 22rpx; border-radius: 20rpx; }
.gift-btn.disabled { background: $zb-border-dark; }

.earn-list { display: flex; flex-direction: column; }
.earn-item { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 0; border-bottom: 1rpx solid $zb-border-light; }
.earn-item:last-child { border-bottom: none; }
.earn-icon { font-size: 32rpx; width: 64rpx; height: 64rpx; background: $zb-bg-grey; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.earn-info { flex: 1; }
.earn-title { font-size: 26rpx; font-weight: 500; color: $zb-text-primary; display: block; }
.earn-desc { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; display: block; }
.earn-points { font-size: 24rpx; color: $zb-primary; font-weight: 600; }

.bottom-space { height: 40rpx; }
</style>
