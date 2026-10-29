<template>
  <view class="search-page">
    <view class="search-header">
      <view class="search-box">
        <text class="search-icon"><zb-icon name="search" /></text>
        <input 
          v-model="keyword" 
          class="search-input" 
          placeholder="搜索服务、商品、酒店" 
          focus
          confirm-type="search"
          @confirm="onSearch"
        />
        <text v-if="keyword" class="clear-btn" @click="keyword = ''"><zb-icon name="closeX" /></text>
      </view>
      <text class="cancel-btn" @click="uni.navigateBack()">取消</text>
    </view>

    <view v-if="!keyword" class="search-content">
      <view class="section" v-if="history.length">
        <view class="section-header">
          <text class="section-title">历史搜索</text>
          <text class="clear-history" @click="history = []">清空</text>
        </view>
        <view class="tag-list">
          <view class="tag-item" v-for="(h, idx) in history" :key="idx" @click="keyword = h">{{ h }}</view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">热门搜索</text>
        </view>
        <view class="tag-list">
          <view class="tag-item hot" v-for="(h, idx) in hotKeywords" :key="idx" @click="keyword = h">{{ idx + 1 }}. {{ h }}</view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">分类搜索</text>
        </view>
        <view class="category-list">
          <view class="category-item" v-for="c in categories" :key="c.id" @click="onCategoryClick(c)">
            <zb-icon class="category-icon" :name="c.icon" />
            <text class="category-name">{{ c.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="search-results">
      <view class="result-tabs">
        <view v-for="tab in resultTabs" :key="tab.id" :class="['result-tab', { active: activeTab === tab.id }]" @click="activeTab = tab.id">
          {{ tab.name }} ({{ tab.count }})
        </view>
      </view>
      <view class="result-list">
        <view v-for="r in results" :key="r.id" class="result-card">
          <view class="result-image" :style="{ backgroundImage: `url(${r.image})` }"></view>
          <view class="result-info">
            <text class="result-name">{{ r.name }}</text>
            <text class="result-desc">{{ r.desc }}</text>
            <view class="result-bottom">
              <text class="result-price" v-if="r.price">¥{{ r.price }}</text>
              <view class="result-btn">查看</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const keyword = ref('');
const activeTab = ref('all');
const history = ref(['智能手环', '云南旅居', '中医理疗']);
const hotKeywords = ['智能健康手环', '云南康养', '艾灸套装', '体检套餐', '中药调理', '养生茶'];

const categories = [
  { id: 1, name: '康养服务', icon: 'hospital', path: '/pages/service/index' },
  { id: 2, name: '商城商品', icon: 'cart', path: '/pages/shop/index' },
  { id: 3, name: '旅居酒店', icon: 'mountain', path: '/modules/health-travel/index' },
  { id: 4, name: '健康资讯', icon: 'newspaper', path: '/modules/news/index' }
];

const resultTabs = [
  { id: 'all', name: '综合', count: 6 },
  { id: 'service', name: '服务', count: 3 },
  { id: 'product', name: '商品', count: 2 },
  { id: 'hotel', name: '酒店', count: 1 }
];

const results = [
  { id: 1, name: '智能健康手环 Pro', desc: '尊享版 · 曜石黑', price: 299, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
  { id: 2, name: '便携式血压计', desc: '上臂式 · 标准版', price: 188, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400' },
  { id: 3, name: '全面体检套餐', desc: '北京协和医院', price: 1680, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400' },
  { id: 4, name: '中医理疗套餐', desc: '推拿 + 艾灸 + 拔罐', price: 580, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400' }
];

const tabPaths = [
  '/pages/index/index',
  '/pages/service/index',
  '/pages/shop/index',
  '/pages/message/index',
  '/pages/mine/index'
];

const onCategoryClick = (c: any) => {
  if (tabPaths.includes(c.path)) {
    uni.switchTab({ url: c.path });
    return;
  }
  uni.navigateTo({ url: c.path });
};

const onSearch = () => {
  if (keyword.value.trim()) {
    history.value = [keyword.value, ...history.value.filter(h => h !== keyword.value)].slice(0, 10);
    uni.showToast({ title: `搜索「${keyword.value}」`, icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.search-page { min-height: 100%; background: $zb-bg-page; }
.search-header { display: flex; align-items: center; padding: 20rpx 32rpx; background: #fff; gap: 20rpx; padding-top: calc(20rpx + var(--status-bar-height, 44px)); }
.search-box { flex: 1; display: flex; align-items: center; background: $zb-bg-grey; border-radius: 36rpx; padding: 14rpx 24rpx; gap: 12rpx; }
.search-icon { font-size: 28rpx; }
.search-input { flex: 1; font-size: 28rpx; background: transparent; }
.clear-btn { font-size: 28rpx; color: $zb-text-tertiary; padding: 0 8rpx; }
.cancel-btn { font-size: 28rpx; color: $zb-text-secondary; }

.search-content { padding: 24rpx 32rpx; }
.section { margin-bottom: 32rpx; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; }
.clear-history { font-size: 24rpx; color: $zb-text-tertiary; }
.tag-list { display: flex; flex-wrap: wrap; gap: 16rpx; }
.tag-item { padding: 14rpx 28rpx; background: #fff; font-size: 26rpx; color: $zb-text-secondary; border-radius: 28rpx; }
.tag-item.hot { color: #ff4d4f; }

.category-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16rpx; }
.category-item { display: flex; align-items: center; gap: 16rpx; padding: 24rpx; background: #fff; border-radius: 16rpx; }
.category-icon { font-size: 36rpx; }
.category-name { font-size: 28rpx; color: $zb-text-primary; }

.search-results { padding: 24rpx 32rpx; }
.result-tabs { display: flex; gap: 24rpx; background: #fff; padding: 16rpx 24rpx; border-radius: 16rpx; margin-bottom: 20rpx; overflow-x: auto; }
.result-tab { flex-shrink: 0; font-size: 26rpx; color: $zb-text-secondary; }
.result-tab.active { color: $zb-primary; font-weight: 600; }

.result-list { display: flex; flex-direction: column; gap: 20rpx; }
.result-card { display: flex; gap: 20rpx; padding: 20rpx; background: #fff; border-radius: 16rpx; }
.result-image { width: 180rpx; height: 180rpx; border-radius: 12rpx; background-size: cover; background-position: center; flex-shrink: 0; }
.result-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.result-name { font-size: 28rpx; font-weight: 500; color: $zb-text-primary; }
.result-desc { font-size: 24rpx; color: $zb-text-tertiary; }
.result-bottom { display: flex; align-items: center; justify-content: space-between; }
.result-price { font-size: 32rpx; color: #ff4d4f; font-weight: 600; }
.result-btn { padding: 8rpx 24rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 22rpx; border-radius: 20rpx; }
</style>
