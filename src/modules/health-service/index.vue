<template>
  <view class="health-service-page">
    <view class="page-banner">
      <view class="banner-bg"></view>
      <view class="banner-content">
        <text class="banner-title">健康服务</text>
        <text class="banner-sub">专业医疗 · 贴心守护</text>
      </view>
    </view>

    <view class="entry-grid">
      <view class="entry-card" @click="goExperts">
        <view class="entry-icon"><zb-icon name="stethoscope" /></view>
        <text class="entry-title">专家咨询</text>
        <text class="entry-desc">图文/电话/视频咨询</text>
      </view>
      <view class="entry-card" @click="goTo('/modules/store/index')">
        <view class="entry-icon"><zb-icon name="hospital" /></view>
        <text class="entry-title">门店服务</text>
        <text class="entry-desc">针灸 · 推拿 · 艾灸</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">热门服务</text>
      </view>
      <view class="dept-grid">
        <view
          v-for="d in services"
          :key="d.id"
          class="dept-item"
          @click="goTo(`/modules/store/detail?id=1&service=${d.name}`)"
        >
          <view class="dept-icon"><zb-icon :name="d.icon" /></view>
          <text class="dept-name">{{ d.name }}</text>
          <text class="dept-count">{{ d.desc }}</text>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const services = [
  { id: 1, name: '针灸调理', icon: 'sparkles', desc: '¥168 / 次' },
  { id: 2, name: '推拿按摩', icon: 'heart', desc: '¥198 / 次' },
  { id: 3, name: '艾灸温养', icon: 'leaf', desc: '¥128 / 次' },
  { id: 4, name: '拔罐祛湿', icon: 'shield', desc: '¥88 / 次' }
];

const goTo = (url: string) => uni.navigateTo({ url });
const goExperts = () => uni.switchTab({ url: '/pages/service/index' });
</script>

<style lang="scss" scoped>
.health-service-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-banner { position: relative; height: 220rpx; }
.banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #3b82f6 0%, #2ec4b6 100%); }
.banner-content { position: relative; z-index: 1; padding: 60rpx 32rpx; }
.banner-title { font-size: 44rpx; font-weight: 700; color: #fff; display: block; }
.banner-sub { font-size: 26rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.entry-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20rpx; margin: -40rpx 32rpx 0; position: relative; z-index: 2; }
.entry-card { background: #fff; border-radius: 20rpx; padding: 32rpx 24rpx; box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06); display: flex; flex-direction: column; align-items: center; }
.entry-icon { font-size: 56rpx; margin-bottom: 12rpx; }
.entry-title { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; }
.entry-desc { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 6rpx; }

.section { margin: 24rpx 32rpx; padding: 28rpx; background: #fff; border-radius: 20rpx; }
.section-header { margin-bottom: 24rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }

.dept-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20rpx; }
.dept-item { display: flex; flex-direction: column; align-items: center; padding: 16rpx 8rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.dept-icon { font-size: 40rpx; margin-bottom: 6rpx; }
.dept-name { font-size: 24rpx; font-weight: 500; color: $zb-text-primary; }
.dept-count { font-size: 20rpx; color: $zb-text-tertiary; margin-top: 4rpx; }

.bottom-space { height: 40rpx; }
</style>
