<template>
  <view class="smart-health-page">
    <view class="page-banner">
      <view class="banner-bg"></view>
      <view class="banner-content">
        <text class="banner-title">智慧健康</text>
        <text class="banner-sub">AI 守护 · 智能管理</text>
      </view>
    </view>

    <view class="ai-card" @click="goChat">
      <view class="ai-left">
        <view class="ai-avatar"><zb-icon name="bot" /></view>
        <view class="ai-info">
          <text class="ai-title">中兵 AI 健康助手</text>
          <text class="ai-desc">智能问诊 · 健康建议 · 报告解读</text>
        </view>
      </view>
      <view class="ai-btn">立即咨询 <zb-icon name="chevronRight" /></view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">核心功能</text>
      </view>
      <view class="func-grid">
        <view class="func-item" v-for="f in functions" :key="f.id" @click="onFuncClick(f)">
          <view class="func-icon" :style="{ background: f.bgColor }"><zb-icon :name="f.icon" /></view>
          <text class="func-name">{{ f.name }}</text>
          <text class="func-desc">{{ f.desc }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">我的健康数据</text>
      </view>
      <view class="health-data-grid">
        <view class="data-card">
          <view class="data-icon"><zb-icon name="heart" /></view>
          <text class="data-value">72</text>
          <text class="data-unit">bpm</text>
          <text class="data-label">心率</text>
        </view>
        <view class="data-card">
          <view class="data-icon"><zb-icon name="droplet" /></view>
          <text class="data-value">118/76</text>
          <text class="data-unit">mmHg</text>
          <text class="data-label">血压</text>
        </view>
        <view class="data-card">
          <view class="data-icon"><zb-icon name="moon" /></view>
          <text class="data-value">7.5</text>
          <text class="data-unit">小时</text>
          <text class="data-label">睡眠</text>
        </view>
        <view class="data-card">
          <view class="data-icon"><zb-icon name="run" /></view>
          <text class="data-value">6820</text>
          <text class="data-unit">步</text>
          <text class="data-label">步数</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">智能测评</text>
        <text class="section-more" @click="goTo('/modules/health-assessment/index')">全部 <zb-icon name="chevronRight" /></text>
      </view>
      <view class="assessment-list">
        <view class="assess-card" v-for="a in assessments" :key="a.id">
          <view class="assess-icon"><zb-icon :name="a.icon" /></view>
          <view class="assess-info">
            <text class="assess-name">{{ a.name }}</text>
            <text class="assess-desc">{{ a.desc }}</text>
          </view>
          <view class="assess-btn">开始</view>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const functions = [
  { id: 1, name: 'AI 健康管理', desc: '个性化健康方案', icon: 'brain', bgColor: '#e0f7f5', path: '/modules/xiaoyi/chat' },
  { id: 2, name: '智能测评', desc: '多维度健康评估', icon: 'edit', bgColor: '#e8f4fd', path: '/modules/health-assessment/index' },
  { id: 3, name: '智能穿戴', desc: '设备数据同步', icon: 'watch', bgColor: '#fef3e2', path: '/modules/device-manage/index' },
  { id: 4, name: '健康档案', desc: '个人数据中心', icon: 'clipboard', bgColor: '#fce4ec', path: '/modules/health-archive/index' }
];

const assessments = [
  { id: 1, name: '心脑血管风险评估', desc: '5 分钟 · 20 题', icon: 'heart' },
  { id: 2, name: '睡眠质量测评', desc: '3 分钟 · 15 题', icon: 'moon' },
  { id: 3, name: '心理健康评估', desc: '8 分钟 · 30 题', icon: 'leaf' }
];

const goChat = () => uni.navigateTo({ url: '/modules/xiaoyi/chat' });
const goTo = (url: string) => uni.navigateTo({ url });
const onFuncClick = (f: any) => uni.navigateTo({ url: f.path });
</script>

<style lang="scss" scoped>
.smart-health-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-banner { position: relative; height: 240rpx; }
.banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1a1a2e 0%, #2ec4b6 100%); }
.banner-content { position: relative; z-index: 1; padding: 60rpx 32rpx; }
.banner-title { font-size: 44rpx; font-weight: 700; color: #fff; display: block; }
.banner-sub { font-size: 26rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.ai-card { display: flex; align-items: center; justify-content: space-between; margin: -40rpx 32rpx 0; padding: 28rpx; background: #fff; border-radius: 20rpx; box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08); position: relative; z-index: 2; }
.ai-left { display: flex; align-items: center; gap: 20rpx; }
.ai-avatar { width: 88rpx; height: 88rpx; background: linear-gradient(135deg, $zb-primary, #3b82f6); border-radius: 24rpx; display: flex; align-items: center; justify-content: center; font-size: 44rpx; }
.ai-info { display: flex; flex-direction: column; }
.ai-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.ai-desc { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 6rpx; }
.ai-btn { padding: 12rpx 24rpx; background: $zb-primary-light; color: $zb-primary; font-size: 24rpx; border-radius: 20rpx; font-weight: 500; }

.section { margin: 24rpx 32rpx; padding: 28rpx; background: #fff; border-radius: 20rpx; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }
.section-more { font-size: 24rpx; color: $zb-text-tertiary; }

.func-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20rpx; }
.func-item { padding: 24rpx; background: $zb-bg-grey; border-radius: 16rpx; display: flex; flex-direction: column; }
.func-icon { width: 72rpx; height: 72rpx; border-radius: 20rpx; display: flex; align-items: center; justify-content: center; font-size: 36rpx; margin-bottom: 12rpx; }
.func-name { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.func-desc { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; }

.health-data-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.data-card { display: flex; flex-direction: column; align-items: center; padding: 20rpx 8rpx; background: $zb-bg-grey; border-radius: 16rpx; position: relative; }
.data-icon { font-size: 32rpx; margin-bottom: 6rpx; }
.data-value { font-size: 28rpx; font-weight: 700; color: $zb-text-primary; }
.data-unit { font-size: 18rpx; color: $zb-text-tertiary; margin-left: 4rpx; }
.data-label { font-size: 20rpx; color: $zb-text-tertiary; margin-top: 4rpx; }

.assessment-list { display: flex; flex-direction: column; gap: 16rpx; }
.assess-card { display: flex; align-items: center; gap: 16rpx; padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.assess-icon { font-size: 40rpx; width: 72rpx; height: 72rpx; background: #fff; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; }
.assess-info { flex: 1; }
.assess-name { font-size: 26rpx; font-weight: 500; color: $zb-text-primary; display: block; }
.assess-desc { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; display: block; }
.assess-btn { padding: 10rpx 24rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 24rpx; border-radius: 20rpx; }

.bottom-space { height: 40rpx; }
</style>
