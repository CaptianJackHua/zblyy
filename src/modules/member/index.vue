<template>
  <view class="member-page">
    <!-- 会员卡片 -->
    <view class="member-card">
      <view class="card-bg"></view>
      <view class="card-content">
        <view class="card-top">
          <view class="user-info">
            <view class="user-avatar"><zb-icon name="user" /></view>
            <view class="user-detail">
              <text class="user-name">尊贵的会员</text>
              <text class="user-level"><zb-icon name="medal" /> 银卡会员</text>
            </view>
          </view>
          <view class="member-logo">
            <text class="logo-cn">中兵康养</text>
            <text class="logo-en">ZHONGBING WELLNESS</text>
          </view>
        </view>
        <view class="card-meta">
          <view class="meta-item">
            <text class="meta-label">有效期至</text>
            <text class="meta-value">2027-10-28</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">成长值</text>
            <text class="meta-value">2480 / 5000</text>
          </view>
        </view>
        <view class="progress-bar">
          <view class="progress-fill"></view>
        </view>
        <text class="progress-tip">再消费 ¥1260 即可升级金卡</text>
      </view>
    </view>

    <!-- 权益列表 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">会员特权</text>
      </view>
      <view class="benefits-grid">
        <view class="benefit-item" v-for="b in benefits" :key="b.id">
          <view class="benefit-icon"><zb-icon :name="b.icon" /></view>
          <text class="benefit-name">{{ b.name }}</text>
          <text class="benefit-desc">{{ b.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 积分 -->
    <view class="section">
      <view class="points-card" @click="uni.navigateTo({ url: '/modules/member/points' })">
        <view class="points-left">
          <text class="points-label">当前积分</text>
          <view class="points-value-row">
            <text class="points-value">1,280</text>
            <text class="points-unit">分</text>
          </view>
        </view>
        <view class="points-right">
          <text class="points-action">积分兑换</text>
          <text class="arrow"><zb-icon name="chevronRight" /></text>
        </view>
      </view>
    </view>

    <!-- 升级 -->
    <view class="upgrade-banner">
      <view class="upgrade-content">
        <view class="upgrade-info">
          <text class="upgrade-title">升级金卡会员</text>
          <text class="upgrade-desc">享 9 折优惠 · 优先预约 · 生日特权</text>
        </view>
        <view class="upgrade-btn">立即升级</view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const benefits = [
  { id: 1, name: '专属折扣', desc: '服务 9.5 折起', icon: 'wallet' },
  { id: 2, name: '优先预约', desc: '专家号优先', icon: 'ticket' },
  { id: 3, name: '生日特权', desc: '生日双倍积分', icon: 'cake' },
  { id: 4, name: '专属客服', desc: '1 对 1 服务', icon: 'user' },
  { id: 5, name: '康养课堂', desc: '免费学习', icon: 'book' },
  { id: 6, name: '亲友关怀', desc: '代亲友预约', icon: 'users' }
];
</script>

<style lang="scss" scoped>
.member-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.member-card { position: relative; margin: 24rpx 32rpx; border-radius: 24rpx; overflow: hidden; }
.card-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1a1a2e 0%, #2d3748 50%, #4a5568 100%); }
.card-bg::before { content: ''; position: absolute; top: -50%; right: -20%; width: 400rpx; height: 400rpx; background: radial-gradient(circle, rgba(46, 196, 182, 0.3) 0%, transparent 70%); }
.card-bg::after { content: ''; position: absolute; bottom: -30%; left: -10%; width: 300rpx; height: 300rpx; background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%); }
.card-content { position: relative; z-index: 1; padding: 32rpx; color: #fff; }
.card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.user-info { display: flex; align-items: center; gap: 16rpx; }
.user-avatar { width: 80rpx; height: 80rpx; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40rpx; border: 2rpx solid rgba(255,255,255,0.3); }
.user-detail { display: flex; flex-direction: column; }
.user-name { font-size: 28rpx; font-weight: 600; }
.user-level { font-size: 22rpx; color: rgba(255,255,255,0.7); margin-top: 4rpx; }
.member-logo { text-align: right; }
.logo-cn { font-size: 24rpx; font-weight: 700; display: block; }
.logo-en { font-size: 14rpx; color: rgba(255,255,255,0.5); letter-spacing: 1rpx; }
.card-meta { display: flex; gap: 48rpx; margin-top: 32rpx; }
.meta-item { display: flex; flex-direction: column; }
.meta-label { font-size: 20rpx; color: rgba(255,255,255,0.6); }
.meta-value { font-size: 24rpx; color: rgba(255,255,255,0.9); margin-top: 4rpx; }
.progress-bar { height: 8rpx; background: rgba(255,255,255,0.2); border-radius: 4rpx; margin-top: 16rpx; overflow: hidden; }
.progress-fill { width: 50%; height: 100%; background: linear-gradient(90deg, $zb-primary, #3b82f6); border-radius: 4rpx; }
.progress-tip { font-size: 20rpx; color: rgba(255,255,255,0.6); margin-top: 12rpx; display: block; }

.section { margin: 24rpx 32rpx; padding: 28rpx; background: #fff; border-radius: 20rpx; }
.section-header { margin-bottom: 24rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }

.benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20rpx; }
.benefit-item { display: flex; flex-direction: column; align-items: center; padding: 20rpx 8rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.benefit-icon { font-size: 36rpx; margin-bottom: 8rpx; }
.benefit-name { font-size: 24rpx; font-weight: 500; color: $zb-text-primary; text-align: center; }
.benefit-desc { font-size: 18rpx; color: $zb-text-tertiary; margin-top: 4rpx; text-align: center; }

.points-card { display: flex; justify-content: space-between; align-items: center; padding: 28rpx; background: linear-gradient(135deg, #fef3e2 0%, #fce4ec 100%); border-radius: 16rpx; }
.points-left { display: flex; flex-direction: column; }
.points-label { font-size: 24rpx; color: $zb-text-secondary; }
.points-value-row { display: flex; align-items: baseline; margin-top: 8rpx; }
.points-value { font-size: 48rpx; font-weight: 700; color: $zb-accent; }
.points-unit { font-size: 24rpx; color: $zb-text-secondary; margin-left: 6rpx; }
.points-right { display: flex; align-items: center; gap: 6rpx; }
.points-action { font-size: 26rpx; color: $zb-accent; font-weight: 500; }
.arrow { font-size: 32rpx; color: $zb-text-tertiary; }

.upgrade-banner { margin: 0 32rpx; background: linear-gradient(135deg, #d4a574 0%, #b8860b 100%); border-radius: 20rpx; padding: 28rpx; }
.upgrade-content { display: flex; justify-content: space-between; align-items: center; }
.upgrade-title { font-size: 30rpx; font-weight: 600; color: #fff; display: block; }
.upgrade-desc { font-size: 22rpx; color: rgba(255,255,255,0.8); margin-top: 6rpx; display: block; }
.upgrade-btn { padding: 14rpx 32rpx; background: rgba(255,255,255,0.25); color: #fff; font-size: 24rpx; border-radius: 24rpx; border: 1rpx solid rgba(255,255,255,0.4); }

.bottom-space { height: 40rpx; }
</style>
