<template>
  <view class="news-page">
    <view class="page-header">
      <text class="page-title">健康资讯</text>
      <text class="page-desc">每日康养科普，守护健康生活</text>
    </view>

    <view class="filter-bar">
      <scroll-view scroll-x class="filter-scroll">
        <view 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="['filter-item', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </view>
      </scroll-view>
    </view>

    <view class="news-list">
      <view 
        v-for="news in filteredNews" 
        :key="news.id" 
        class="news-card"
        @click="goDetail(news)"
      >
        <view class="news-image" :style="{ backgroundImage: `url(${news.image})` }">
          <view class="news-category">{{ news.category }}</view>
        </view>
        <view class="news-info">
          <text class="news-title">{{ news.title }}</text>
          <text class="news-summary">{{ news.summary }}</text>
          <view class="news-meta">
            <text class="news-source">{{ news.source }}</text>
            <text class="news-time">{{ news.time }}</text>
            <text class="news-views"><zb-icon name="eye" /> {{ news.views }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="filteredNews.length === 0" class="empty-state">
      <text class="empty-icon"><zb-icon name="inbox" /></text>
      <text class="empty-text">暂无相关资讯</text>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tabs = [
  { id: 'all', name: '全部' },
  { id: 'health', name: '健康科普' },
  { id: 'preserve', name: '养生知识' },
  { id: 'disease', name: '疾病预防' },
  { id: 'news', name: '行业动态' }
];

const activeTab = ref('all');

const news = [
  { id: 1, category: '养生', title: '秋季养生：5 个小动作让你气血充盈', summary: '秋季是养生的黄金季节，中医推荐这几个简单的日常养生方法，帮助您调理身体，预防疾病。', source: '中兵康养', time: '2026-10-28', views: 1234, image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400', tab: 'preserve' },
  { id: 2, category: '疾病预防', title: '高血压患者的饮食注意事项', summary: '科学饮食对于控制血压至关重要，这些食物建议多吃，那些食物尽量少吃，一起来看看。', source: '健康时报', time: '2026-10-27', views: 2891, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', tab: 'disease' },
  { id: 3, category: '健康科普', title: '如何选择适合自己的运动方式', summary: '不同年龄、不同体质的人，运动方式的选择也大有讲究，快来看看怎么选。', source: '中兵康养', time: '2026-10-26', views: 1567, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400', tab: 'health' },
  { id: 4, category: '行业动态', title: '2026 中国康养产业发展报告发布', summary: '最新报告显示，中国康养产业市场规模已突破 10 万亿元，年增长率持续保持在 15% 以上。', source: '新华网', time: '2026-10-25', views: 3456, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', tab: 'news' },
  { id: 5, category: '养生', title: '冬季如何科学进补？中医给出 5 点建议', summary: '冬令进补是传统养生方法，但并非人人适合，科学进补才能事半功倍。', source: '中医养生', time: '2026-10-24', views: 2134, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', tab: 'preserve' },
  { id: 6, category: '健康科普', title: '睡眠不好？试试这 7 个改善睡眠的方法', summary: '好的睡眠是健康的基础，长期失眠会带来多种健康问题，一起来学习改善方法。', source: '中兵康养', time: '2026-10-23', views: 4521, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400', tab: 'health' }
];

const filteredNews = computed(() => {
  if (activeTab.value === 'all') return news;
  return news.filter(n => n.tab === activeTab.value);
});

const goDetail = (n: any) => uni.navigateTo({ url: `/modules/news/detail?id=${n.id}` });
</script>

<style lang="scss" scoped>
.news-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-header { background: linear-gradient(135deg, #2ec4b6 0%, #3b82f6 100%); padding: 60rpx 32rpx 40rpx; text-align: center; }
.page-title { font-size: 40rpx; font-weight: 700; color: #fff; display: block; }
.page-desc { font-size: 24rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.filter-bar { background: #fff; padding: 20rpx 0; }
.filter-scroll { white-space: nowrap; padding: 0 24rpx; }
.filter-item { display: inline-block; padding: 12rpx 28rpx; font-size: 26rpx; color: $zb-text-secondary; margin-right: 12rpx; border-radius: 24rpx; }
.filter-item.active { background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; }

.news-list { padding: 24rpx 32rpx; }
.news-card { display: flex; gap: 20rpx; padding: 20rpx; background: #fff; border-radius: 20rpx; margin-bottom: 20rpx; }
.news-image { width: 200rpx; height: 160rpx; border-radius: 12rpx; background-size: cover; background-position: center; flex-shrink: 0; position: relative; }
.news-category { position: absolute; top: 8rpx; left: 8rpx; padding: 2rpx 12rpx; background: rgba(0,0,0,0.5); color: #fff; font-size: 18rpx; border-radius: 6rpx; }
.news-info { flex: 1; display: flex; flex-direction: column; }
.news-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.news-summary { font-size: 24rpx; color: $zb-text-secondary; margin-top: 8rpx; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
.news-meta { display: flex; align-items: center; gap: 16rpx; margin-top: 12rpx; font-size: 22rpx; color: $zb-text-tertiary; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 80rpx 0; }
.empty-icon { font-size: 100rpx; margin-bottom: 24rpx; }
.empty-text { font-size: 28rpx; color: $zb-text-tertiary; }

.bottom-space { height: 40rpx; }
</style>
