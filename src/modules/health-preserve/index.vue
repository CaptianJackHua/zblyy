<template>
  <view class="preserve-page">
    <view class="page-banner">
      <view class="banner-bg"></view>
      <view class="banner-content">
        <text class="banner-title">养生体验</text>
        <text class="banner-sub">回归自然 · 身心调养</text>
      </view>
    </view>

    <view class="filter-bar">
      <view 
        v-for="cat in categories" 
        :key="cat.id" 
        :class="['filter-item', { active: activeCat === cat.id }]"
        @click="activeCat = cat.id"
      >
        {{ cat.name }}
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">热门项目</text>
      </view>
      <view class="project-list">
        <view v-for="p in filteredProjects" :key="p.id" class="project-card" @click="onBook(p)">
          <view class="project-image" :style="{ backgroundImage: `url(${p.image})` }">
            <view class="project-tag">{{ p.tag }}</view>
          </view>
          <view class="project-info">
            <text class="project-name">{{ p.name }}</text>
            <text class="project-desc">{{ p.desc }}</text>
            <view class="project-meta">
              <text class="project-duration"><zb-icon name="timer" /> {{ p.duration }}</text>
              <text class="project-location"><zb-icon name="mapPin" /> {{ p.location }}</text>
            </view>
            <view class="project-bottom">
              <view class="project-price">
                <text class="currency">¥</text>
                <text class="price">{{ p.price }}</text>
                <text class="original">¥{{ p.originalPrice }}</text>
              </view>
              <view class="book-btn">立即预约</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const categories = [
  { id: 0, name: '全部' },
  { id: 1, name: '中医理疗' },
  { id: 2, name: '艾灸养生' },
  { id: 3, name: '推拿按摩' },
  { id: 4, name: '药膳调理' }
];

const activeCat = ref(0);

const projects = [
  { id: 1, name: '古法艾灸套餐', desc: '温经散寒 · 调理气血', duration: '60 分钟', location: '全国门店', price: 288, originalPrice: 388, tag: '热销', category: 2, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400' },
  { id: 2, name: '专业推拿按摩', desc: '放松肌肉 · 缓解疲劳', duration: '90 分钟', location: '全国门店', price: 398, originalPrice: 528, tag: '推荐', category: 3, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400' },
  { id: 3, name: '经络调理套餐', desc: '疏通经络 · 改善睡眠', duration: '120 分钟', location: '北京/上海', price: 688, originalPrice: 888, tag: '新品', category: 1, image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400' },
  { id: 4, name: '四季药膳定制', desc: '根据体质 · 科学调养', duration: '30 分钟', location: '线上服务', price: 199, originalPrice: 299, tag: '限时', category: 4, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }
];

const filteredProjects = computed(() => {
  if (activeCat.value === 0) return projects;
  return projects.filter(p => p.category === activeCat.value);
});

const onBook = (p: any) => {
  uni.showModal({
    title: '预约确认',
    content: `确定要预约「${p.name}」吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '预约成功！', icon: 'success' });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.preserve-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-banner { position: relative; height: 220rpx; }
.banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #f59e0b 0%, #2ec4b6 100%); }
.banner-content { position: relative; z-index: 1; padding: 60rpx 32rpx; }
.banner-title { font-size: 44rpx; font-weight: 700; color: #fff; display: block; }
.banner-sub { font-size: 26rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.filter-bar { display: flex; padding: 24rpx 32rpx; gap: 16rpx; background: #fff; overflow-x: auto; }
.filter-item { flex-shrink: 0; padding: 12rpx 28rpx; font-size: 26rpx; color: $zb-text-secondary; background: $zb-bg-grey; border-radius: 24rpx; }
.filter-item.active { background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; }

.section { margin: 24rpx 32rpx; }
.section-header { margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }

.project-list { display: flex; flex-direction: column; gap: 24rpx; }
.project-card { background: #fff; border-radius: 20rpx; overflow: hidden; }
.project-image { width: 100%; height: 280rpx; background-size: cover; background-position: center; position: relative; }
.project-tag { position: absolute; top: 16rpx; left: 0; padding: 4rpx 16rpx; background: linear-gradient(90deg, #ff4d4f, #ff7875); color: #fff; font-size: 22rpx; border-radius: 0 12rpx 12rpx 0; }
.project-info { padding: 24rpx; }
.project-name { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.project-desc { font-size: 24rpx; color: $zb-text-secondary; margin-top: 8rpx; display: block; }
.project-meta { display: flex; gap: 24rpx; margin-top: 12rpx; }
.project-meta text { font-size: 22rpx; color: $zb-text-tertiary; }
.project-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 16rpx; }
.project-price { display: flex; align-items: baseline; gap: 6rpx; }
.project-price .currency { font-size: 24rpx; color: #ff4d4f; }
.project-price .price { font-size: 40rpx; color: #ff4d4f; font-weight: 700; }
.project-price .original { font-size: 22rpx; color: $zb-text-tertiary; text-decoration: line-through; }
.book-btn { padding: 16rpx 36rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 26rpx; border-radius: 28rpx; }

.bottom-space { height: 40rpx; }
</style>
