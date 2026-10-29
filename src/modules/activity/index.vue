<template>
  <view class="activity-list-page">
    <view class="page-header">
      <view class="search-box">
        <text class="search-icon"><zb-icon name="search" /></text>
        <input class="search-input" placeholder="搜索活动/套餐" />
      </view>
    </view>

    <view class="filter-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.id" 
        :class="['tab-item', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </view>
    </view>

    <view class="banner-card" @click="goDetail(1)">
      <view class="banner-bg"></view>
      <view class="banner-content">
        <text class="banner-tag">限时特惠</text>
        <text class="banner-title">秋季康养节</text>
        <text class="banner-desc">全场理疗 8 折起，旅居套餐立减 2000 元</text>
        <view class="banner-btn">立即参与 <zb-icon name="chevronRight" /></view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">全部活动</text>
      </view>
      <view class="activity-list">
        <view 
          v-for="item in filteredActivities" 
          :key="item.id" 
          class="activity-card"
          @click="goDetail(item.id)"
        >
          <view class="activity-image" :style="{ backgroundImage: `url(${item.image})` }">
            <view class="activity-tag">{{ item.tag }}</view>
          </view>
          <view class="activity-info">
            <text class="activity-title">{{ item.title }}</text>
            <text class="activity-desc">{{ item.desc }}</text>
            <view class="activity-meta">
              <text class="activity-date"><zb-icon name="calendar" /> {{ item.date }}</text>
              <text class="activity-limit" v-if="item.limit">限量 {{ item.limit }} 份</text>
            </view>
            <view class="activity-bottom">
              <view class="activity-price">
                <text class="currency">¥</text>
                <text class="price">{{ item.price }}</text>
                <text class="original">¥{{ item.originalPrice }}</text>
              </view>
              <view class="activity-btn">立即抢购</view>
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

const tabs = [
  { id: 'all', name: '全部' },
  { id: 'travel', name: '旅居套餐' },
  { id: 'hotel', name: '特色住宿' },
  { id: 'preserve', name: '养生体验' }
];
const activeTab = ref('all');

const activities = [
  { id: 1, title: '云南大理 7 天 6 晚康养之旅', desc: '苍山洱海 · 静心康养 · 白族风情', date: '2026-11-01 ~ 11-07', price: 6880, originalPrice: 8880, tag: '限时特惠', limit: 50, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', type: 'travel' },
  { id: 2, title: '安吉竹海养生套餐', desc: '精品民宿 · 中医理疗 · 茶禅一味', date: '2026-11-15 起', price: 4980, originalPrice: 6580, tag: '热销', limit: 30, image: 'https://images.unsplash.com/photo-1544737151-6e4b999de2a7?w=400', type: 'travel' },
  { id: 3, title: '三亚滨海康养行', desc: '海景房 · 温泉 SPA · 热带秘境', date: '2026-12-01 起', price: 12880, originalPrice: 15880, tag: '新品', limit: 20, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', type: 'travel' },
  { id: 4, title: '艾灸养生 10 次卡', desc: '温经散寒 · 调理气血', date: '有效期 1 年', price: 998, originalPrice: 1580, tag: '养生', image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400', type: 'preserve' }
];

const filteredActivities = computed(() => {
  if (activeTab.value === 'all') return activities;
  return activities.filter(a => a.type === activeTab.value);
});

const goDetail = (id: number) => uni.navigateTo({ url: `/modules/activity/detail?id=${id}` });
</script>

<style lang="scss" scoped>
.activity-list-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-header { padding: 20rpx 32rpx; background: #fff; padding-top: calc(20rpx + var(--status-bar-height, 44px)); }
.search-box { display: flex; align-items: center; background: $zb-bg-grey; border-radius: 36rpx; padding: 14rpx 24rpx; gap: 12rpx; }
.search-icon { font-size: 28rpx; }
.search-input { flex: 1; font-size: 26rpx; background: transparent; }

.filter-tabs { display: flex; padding: 20rpx 32rpx; background: #fff; gap: 24rpx; border-bottom: 1rpx solid $zb-border-light; overflow-x: auto; }
.tab-item { flex-shrink: 0; font-size: 26rpx; color: $zb-text-secondary; padding-bottom: 8rpx; position: relative; }
.tab-item.active { color: $zb-text-primary; font-weight: 600; }
.tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 36rpx; height: 4rpx; background: $zb-primary; border-radius: 2rpx; }

.banner-card { margin: 24rpx 32rpx; position: relative; border-radius: 24rpx; overflow: hidden; }
.banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #ff4d4f 0%, #faad14 100%); }
.banner-bg::before { content: ''; position: absolute; top: -60%; right: -10%; width: 300rpx; height: 300rpx; background: rgba(255,255,255,0.15); border-radius: 50%; }
.banner-content { position: relative; z-index: 1; padding: 40rpx 32rpx; color: #fff; }
.banner-tag { display: inline-block; padding: 4rpx 16rpx; background: rgba(255,255,255,0.25); font-size: 22rpx; border-radius: 6rpx; margin-bottom: 12rpx; }
.banner-title { font-size: 40rpx; font-weight: 700; display: block; }
.banner-desc { font-size: 24rpx; opacity: 0.9; margin-top: 8rpx; display: block; }
.banner-btn { margin-top: 24rpx; padding: 12rpx 28rpx; background: rgba(255,255,255,0.25); border-radius: 24rpx; font-size: 24rpx; }

.section { padding: 24rpx 32rpx; }
.section-header { margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }

.activity-list { display: flex; flex-direction: column; gap: 20rpx; }
.activity-card { background: #fff; border-radius: 20rpx; overflow: hidden; }
.activity-image { width: 100%; height: 280rpx; background-size: cover; background-position: center; position: relative; }
.activity-tag { position: absolute; top: 16rpx; left: 0; padding: 4rpx 16rpx; background: linear-gradient(90deg, #ff4d4f, #ff7875); color: #fff; font-size: 22rpx; border-radius: 0 12rpx 12rpx 0; }
.activity-info { padding: 20rpx 24rpx 24rpx; }
.activity-title { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.activity-desc { font-size: 24rpx; color: $zb-text-secondary; margin-top: 6rpx; display: block; }
.activity-meta { display: flex; gap: 20rpx; margin-top: 12rpx; font-size: 22rpx; color: $zb-text-tertiary; }
.activity-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 16rpx; }
.activity-price .currency { font-size: 22rpx; color: #ff4d4f; }
.activity-price .price { font-size: 40rpx; color: #ff4d4f; font-weight: 700; }
.activity-price .original { font-size: 22rpx; color: $zb-text-tertiary; text-decoration: line-through; margin-left: 8rpx; }
.activity-btn { padding: 14rpx 32rpx; background: linear-gradient(135deg, #ff4d4f, #ff7875); color: #fff; font-size: 26rpx; border-radius: 28rpx; font-weight: 500; }

.bottom-space { height: 40rpx; }
</style>
