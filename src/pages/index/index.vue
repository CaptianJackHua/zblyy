<template>
  <view class="home-page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="logo-wrap" @click="goHome">
          <view class="logo-icon"><zb-icon name="hospital" color="#ffffff" /></view>
          <view class="logo-text">
            <text class="logo-title">中兵康养</text>
            <text class="logo-sub">ZHONGBING WELLNESS</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Banner + 搜索 -->
    <view class="banner-section">
      <swiper class="banner-swiper" :autoplay="true" :interval="4000" :circular="true" :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
        <swiper-item v-for="item in bannerList" :key="item.id">
          <view class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
            <view class="banner-overlay">
              <view class="banner-tag">{{ item.tag }}</view>
              <view class="banner-title">{{ item.title }}</view>
              <view class="banner-subtitle">{{ item.subtitle }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <!-- 搜索框 -->
      <view class="search-bar" @click="goSearch">
        <zb-icon class="search-icon" name="search" color="#999999" />
        <text class="search-placeholder">搜索服务、商品、门店</text>
        <text class="search-btn">搜索</text>
      </view>
    </view>

    <!-- 中兵小医 + 我的健康 -->
    <view class="duo-cards">
      <view class="ai-card" @click="navigateTo('/modules/xiaoyi/chat')">
        <view class="ai-top">
          <view class="ai-avatar"><zb-icon name="bot" color="#ffffff" /></view>
          <view class="ai-info">
            <text class="ai-name">中兵小医</text>
            <text class="ai-desc">智能健康顾问 · 24 小时在线</text>
          </view>
        </view>
        <view class="ai-btn">立即咨询</view>
      </view>
      <view class="myhealth-card" @click="navigateTo('/modules/health-archive/index')">
        <view class="mh-icon"><zb-icon name="clipboard" color="#2ec4b6" /></view>
        <text class="mh-name">我的健康</text>
        <text class="mh-desc">病历档案 · 一键查看</text>
      </view>
    </view>

    <!-- 快捷入口 8 宫格 -->
    <view class="quick-entry">
      <view class="entry-grid">
        <view
          v-for="item in quickEntries"
          :key="item.id"
          class="entry-item"
          @click="openEntry(item)"
        >
          <view class="entry-icon" :style="{ backgroundColor: item.color }">
            <zb-icon class="entry-emoji" :name="item.icon" :color="item.textColor" />
          </view>
          <text class="entry-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 健康数据 -->
    <view class="section">
      <view class="section-header">
        <view class="header-left">
          <text class="section-title">健康数据</text>
          <text class="section-subtitle">Health Data</text>
        </view>
        <view class="header-more" @click="navigateTo('/modules/device-manage/index')">
          <text>更多</text>
          <zb-icon class="arrow" name="chevronRight" color="#999999" />
        </view>
      </view>
      <view class="data-content">
        <view class="device-card" @click="navigateTo(healthDevice.path)">
          <view class="device-icon"><zb-icon name="watch" color="#ffffff" /></view>
          <view class="device-info">
            <view class="device-name-row">
              <text class="device-name">{{ healthDevice.name }}</text>
              <view v-if="healthDevice.connected" class="device-connected">已连接</view>
            </view>
            <text class="device-sync">{{ healthDevice.synced }}</text>
          </view>
          <view class="device-battery">
            <text class="battery-value">{{ healthDevice.battery }}%</text>
            <view class="battery-bar">
              <view class="battery-fill" :style="{ width: healthDevice.battery + '%' }"></view>
            </view>
          </view>
        </view>

        <view class="heart-card">
          <view class="heart-head">
            <text class="heart-title">心率</text>
            <view class="status-tag">{{ heartRate.status }}</view>
          </view>
          <view class="heart-body">
            <view class="heart-main">
              <view class="heart-value-row">
                <text class="heart-value">{{ heartRate.value }}</text>
                <text class="heart-unit">{{ heartRate.unit }}</text>
              </view>
              <text class="heart-ref">{{ heartRate.reference }}</text>
            </view>
            <view class="bar-chart">
              <view
                v-for="(h, i) in heartRate.bars"
                :key="i"
                class="bar"
                :class="{ active: i === heartRate.bars.length - 1 }"
                :style="{ height: h + '%' }"
              ></view>
            </view>
          </view>
        </view>

        <view class="metric-grid">
          <view v-for="m in healthMetrics" :key="m.id" class="metric-card">
            <view class="metric-head">
              <text class="metric-name">{{ m.name }}</text>
              <view class="metric-dot"></view>
            </view>
            <view class="metric-value-row">
              <text class="metric-value">{{ m.value }}</text>
              <text class="metric-unit">{{ m.unit }}</text>
            </view>
            <view class="metric-bars">
              <view v-for="(h, i) in m.bars" :key="i" class="m-bar" :style="{ height: h + '%' }"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 健康产品 -->
    <view class="section">
      <view class="section-header">
        <view class="header-left">
          <text class="section-title">健康产品</text>
          <text class="section-subtitle">Health Products</text>
        </view>
        <view class="header-more" @click="switchTab('/pages/shop/index')">
          <text>查看全部</text>
          <zb-icon class="arrow" name="chevronRight" color="#999999" />
        </view>
      </view>
      <view class="shop-grid">
        <view
          v-for="item in shopProducts"
          :key="item.id"
          class="shop-item"
          @click="navigateTo(`/modules/shop/detail?id=${item.id}`)"
        >
          <view class="shop-image" :style="{ backgroundImage: `url(${item.image})` }">
            <view v-if="item.tag" class="shop-tag">{{ item.tag }}</view>
          </view>
          <view class="shop-info">
            <text class="shop-name">{{ item.name }}</text>
            <text class="shop-spec">{{ item.spec }}</text>
            <view class="shop-bottom">
              <view class="shop-price">
                <text class="currency">¥</text>
                <text class="price">{{ item.price }}</text>
                <text class="original-price">¥{{ item.originalPrice }}</text>
              </view>
              <view class="shop-cart" @click.stop="addToCart(item)">
                <zb-icon name="cart" color="#2ec4b6" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 附近门店 -->
    <view class="section">
      <view class="section-header">
        <view class="header-left">
          <text class="section-title">附近门店</text>
          <text class="section-subtitle">Nearby Stores</text>
        </view>
        <view class="header-more" @click="navigateTo('/modules/store/index')">
          <text>查看全部</text>
          <zb-icon class="arrow" name="chevronRight" color="#999999" />
        </view>
      </view>
      <view class="store-map">
        <view class="map-placeholder">
          <zb-icon class="map-bg" name="map" color="#2ec4b6" />
          <view class="map-pins">
            <view class="pin pin-1"><zb-icon name="mapPin" color="#ff4d4f" /><text>2.3km</text></view>
            <view class="pin pin-2"><zb-icon name="mapPin" color="#ff4d4f" /><text>5.8km</text></view>
          </view>
        </view>
      </view>
      <view class="store-list-mini">
        <view
          v-for="store in storeList.slice(0, 2)"
          :key="store.id"
          class="store-mini-item"
          @click="navigateTo(`/modules/store/detail?id=${store.id}`)"
        >
          <view class="store-icon"><zb-icon name="hospital" color="#2ec4b6" /></view>
          <view class="store-info">
            <text class="store-name">{{ store.name }}</text>
            <text class="store-addr">{{ store.address }}</text>
          </view>
          <view class="store-dist">
            <text class="dist-num">{{ store.distance }}</text>
            <text class="dist-unit">km</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 健康资讯 -->
    <view class="section news-section">
      <view class="section-header">
        <view class="header-left">
          <text class="section-title">健康资讯</text>
          <text class="section-subtitle">Health News</text>
        </view>
        <view class="header-more" @click="navigateTo('/modules/news/index')">
          <text>查看更多</text>
          <zb-icon class="arrow" name="chevronRight" color="#999999" />
        </view>
      </view>
      <scroll-view scroll-x class="news-tabs" :show-scrollbar="false">
        <view class="tabs-row">
          <view
            v-for="t in newsTabs"
            :key="t"
            class="news-tab"
            :class="{ active: newsTab === t }"
            @click="newsTab = t"
          >
            {{ t }}
          </view>
        </view>
      </scroll-view>
      <view class="news-list">
        <view
          v-for="news in filteredNews"
          :key="news.id"
          class="news-item"
          @click="navigateTo(`/modules/news/detail?id=${news.id}`)"
        >
          <view class="news-image" :style="{ backgroundImage: `url(${news.image})` }"></view>
          <view class="news-info">
            <text class="news-title">{{ news.title }}</text>
            <text class="news-summary">{{ news.summary }}</text>
            <view class="news-meta">
              <text class="news-time">{{ news.time }}</text>
              <view class="news-views">
                <zb-icon name="eye" :size="22" color="#999999" />
                <text>{{ news.views }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { bannerList, quickEntries, healthDevice, heartRate, healthMetrics, shopProducts, newsTabs, newsList, storeList } from '@/data/home';

onShow(() => {
  uni.showTabBar({ animation: false });
});

const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};

const switchTab = (url: string) => {
  uni.switchTab({ url });
};

const goHome = () => {
  uni.showToast({ title: '返回首页顶部', icon: 'none' });
};

const goSearch = () => {
  navigateTo('/modules/search/index');
};

const openEntry = (item: any) => {
  if (item.tab) {
    uni.switchTab({ url: item.tab });
    return;
  }
  navigateTo(item.path);
};

const addToCart = (item: any) => {
  uni.showToast({ title: `${item.name} 已加入购物车`, icon: 'success' });
};

const newsTab = ref('推荐');
const filteredNews = computed(() =>
  newsTab.value === '推荐' ? newsList : newsList.filter((n) => n.category === newsTab.value)
);
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100%;
  background: $zb-bg-page;
  padding-bottom: 120rpx;
}

/* 自定义导航栏 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 100%);
  backdrop-filter: blur(10px);
  padding-top: var(--status-bar-height, 44px);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  height: 88rpx;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.logo-icon {
  font-size: 44rpx;
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $zb-primary 0%, lighten($zb-primary, 8%) 100%);
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(46, 196, 182, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $zb-text-primary;
}

.logo-sub {
  font-size: 18rpx;
  color: $zb-text-tertiary;
  letter-spacing: 1rpx;
}

/* Banner 区域 */
.banner-section {
  padding-top: calc(var(--status-bar-height, 0px) + 128rpx);
  position: relative;
}

.banner-swiper {
  width: 100%;
  height: 400rpx;
}

.banner-item {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 48rpx 40rpx;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%);
}

.banner-tag {
  display: inline-block;
  padding: 6rpx 16rpx;
  background: rgba(255,255,255,0.25);
  border-radius: 8rpx;
  color: #fff;
  font-size: 22rpx;
  margin-bottom: 12rpx;
}

.banner-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.banner-subtitle {
  font-size: 28rpx;
  color: rgba(255,255,255,0.85);
  margin-top: 8rpx;
}

/* 搜索框 */
.search-bar {
  position: absolute;
  bottom: -44rpx;
  left: 32rpx;
  right: 32rpx;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 48rpx;
  padding: 16rpx 8rpx 16rpx 28rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.1);
  z-index: 10;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.search-placeholder {
  flex: 1;
  font-size: 26rpx;
  color: $zb-text-tertiary;
}

.search-btn {
  padding: 12rpx 32rpx;
  background: linear-gradient(135deg, $zb-primary 0%, lighten($zb-primary, 8%) 100%);
  color: #fff;
  font-size: 26rpx;
  border-radius: 36rpx;
}

/* 中兵小医 + 我的健康 双卡 */
.duo-cards {
  display: flex;
  gap: 20rpx;
  margin: 76rpx 32rpx 0;
}

.ai-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  background: linear-gradient(135deg, #134e4a 0%, #0f766e 100%);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 118, 110, 0.25);
}

.ai-top {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.ai-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, $zb-primary 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  flex-shrink: 0;
}

.ai-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ai-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.ai-desc {
  font-size: 19rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4rpx;
}

.ai-btn {
  align-self: flex-end;
  margin-top: 20rpx;
  padding: 10rpx 28rpx;
  background: linear-gradient(135deg, $zb-primary 0%, lighten($zb-primary, 8%) 100%);
  border-radius: 32rpx;
  color: #fff;
  font-size: 22rpx;
  font-weight: 500;
}

.myhealth-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: $zb-shadow-sm;
}

.mh-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: $zb-primary-light;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.mh-name {
  margin-top: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: $zb-text-primary;
}

.mh-desc {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: $zb-text-tertiary;
}

/* 快捷入口 8 宫格 */
.quick-entry {
  margin: 24rpx 32rpx 0;
  padding: 36rpx 12rpx 32rpx;
  background: #fff;
  border-radius: 28rpx;
  box-shadow: 0 8rpx 28rpx rgba(26, 26, 46, 0.06);
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 32rpx;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.entry-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.entry-emoji {
  font-size: 44rpx;
}

.entry-name {
  font-size: 24rpx;
  font-weight: 500;
  color: $zb-text-primary;
}

/* 通用 Section */
.section {
  margin: 24rpx 32rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 24rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $zb-text-primary;
}

.section-subtitle {
  font-size: 22rpx;
  color: $zb-text-tertiary;
  margin-top: 4rpx;
  letter-spacing: 1rpx;
}

.header-more {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 26rpx;
  color: $zb-text-tertiary;
}

.arrow {
  font-size: 28rpx;
}

/* 健康数据 */
.data-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.device-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, #33584a 0%, #1f3d33 100%);
  border-radius: 20rpx;
}

.device-icon {
  width: 76rpx;
  height: 76rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  flex-shrink: 0;
}

.device-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.device-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.device-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.device-connected {
  display: flex;
  align-items: center;
  padding: 2rpx 12rpx;
  background: rgba(110, 231, 183, 0.18);
  border-radius: 8rpx;
  font-size: 18rpx;
  color: #86efac;
  flex-shrink: 0;
}

.device-sync {
  margin-top: 8rpx;
  font-size: 21rpx;
  color: rgba(255, 255, 255, 0.55);
}

.device-battery {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
  flex-shrink: 0;
}

.battery-value {
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
}

.battery-bar {
  width: 96rpx;
  height: 8rpx;
  border-radius: 4rpx;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.battery-fill {
  height: 100%;
  border-radius: 4rpx;
  background: #86efac;
}

.heart-card {
  padding: 24rpx;
  background: #f6f8f8;
  border-radius: 20rpx;
}

.heart-head {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.heart-title {
  font-size: 26rpx;
  font-weight: 600;
  color: $zb-text-primary;
}

.status-tag {
  padding: 2rpx 12rpx;
  background: rgba(46, 196, 182, 0.14);
  border-radius: 8rpx;
  font-size: 19rpx;
  color: $zb-primary;
  font-weight: 500;
}

.heart-body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 14rpx;
}

.heart-main {
  display: flex;
  flex-direction: column;
}

.heart-value-row {
  display: flex;
  align-items: baseline;
}

.heart-value {
  font-size: 68rpx;
  font-weight: 700;
  color: #1f3d33;
  line-height: 1.1;
}

.heart-unit {
  margin-left: 8rpx;
  font-size: 22rpx;
  color: $zb-text-secondary;
}

.heart-ref {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: $zb-text-tertiary;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8rpx;
  height: 120rpx;
  flex-shrink: 0;
}

.bar {
  width: 12rpx;
  border-radius: 6rpx;
  background: #d7e0dd;
}

.bar.active {
  background: $zb-primary;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
}

.metric-card {
  display: flex;
  flex-direction: column;
  padding: 20rpx 16rpx;
  background: #f6f8f8;
  border-radius: 16rpx;
  min-width: 0;
}

.metric-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6rpx;
}

.metric-name {
  font-size: 22rpx;
  color: $zb-text-secondary;
  white-space: nowrap;
}

.metric-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: $zb-primary;
  flex-shrink: 0;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  margin-top: 10rpx;
  min-width: 0;
}

.metric-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #1f3d33;
  white-space: nowrap;
}

.metric-unit {
  margin-left: 4rpx;
  font-size: 18rpx;
  color: $zb-text-tertiary;
  white-space: nowrap;
}

.metric-bars {
  display: flex;
  align-items: flex-end;
  gap: 5rpx;
  height: 40rpx;
  margin-top: 12rpx;
}

.m-bar {
  flex: 1;
  border-radius: 3rpx;
  background: #d7e0dd;
}

/* 健康产品 */
.shop-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.shop-item {
  background: $zb-bg-grey;
  border-radius: 20rpx;
  overflow: hidden;
}

.shop-image {
  width: 100%;
  height: 260rpx;
  background-size: cover;
  background-position: center;
  background-color: #fff;
  position: relative;
}

.shop-tag {
  position: absolute;
  top: 12rpx;
  left: 0;
  padding: 4rpx 14rpx;
  background: linear-gradient(90deg, #ff6b35 0%, #ff4d4f 100%);
  color: #fff;
  font-size: 18rpx;
  border-radius: 0 12rpx 12rpx 0;
}

.shop-info {
  padding: 16rpx;
}

.shop-name {
  font-size: 26rpx;
  font-weight: 500;
  color: $zb-text-primary;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shop-spec {
  font-size: 22rpx;
  color: $zb-text-tertiary;
  margin-top: 6rpx;
}

.shop-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}

.shop-price {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.currency {
  font-size: 22rpx;
  color: #ff4d4f;
  font-weight: 500;
}

.price {
  font-size: 36rpx;
  color: #ff4d4f;
  font-weight: 700;
}

.original-price {
  font-size: 20rpx;
  color: $zb-text-tertiary;
  text-decoration: line-through;
}

.shop-cart {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  font-size: 28rpx;
  box-shadow: $zb-shadow-sm;
  flex-shrink: 0;
}

/* 门店 */
.store-map {
  margin-bottom: 24rpx;
}

.map-placeholder {
  width: 100%;
  height: 280rpx;
  background: linear-gradient(135deg, #e0f7f5 0%, #e8f4fd 100%);
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
}

.map-bg {
  font-size: 80rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.3;
}

.map-pins {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.pin {
  position: absolute;
  font-size: 28rpx;

  text {
    margin-left: 4rpx;
    font-size: 20rpx;
    background: #fff;
    padding: 2rpx 8rpx;
    border-radius: 8rpx;
    color: $zb-text-secondary;
  }
}

.pin-1 {
  top: 80rpx;
  left: 100rpx;
}

.pin-2 {
  bottom: 60rpx;
  right: 120rpx;
}

.store-list-mini {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.store-mini-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: $zb-bg-grey;
  border-radius: 16rpx;
}

.store-icon {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 16rpx;
  font-size: 32rpx;
}

.store-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.store-name {
  font-size: 26rpx;
  font-weight: 500;
  color: $zb-text-primary;
}

.store-addr {
  font-size: 22rpx;
  color: $zb-text-tertiary;
  margin-top: 4rpx;
}

.store-dist {
  display: flex;
  align-items: baseline;
  color: $zb-primary;
}

.dist-num {
  font-size: 32rpx;
  font-weight: 700;
}

.dist-unit {
  font-size: 20rpx;
}

/* 健康资讯 */
.news-tabs {
  margin-bottom: 24rpx;
  white-space: nowrap;
}

.tabs-row {
  display: flex;
  gap: 16rpx;
}

.news-tab {
  padding: 10rpx 30rpx;
  background: $zb-bg-grey;
  border-radius: 32rpx;
  font-size: 24rpx;
  color: $zb-text-secondary;
  white-space: nowrap;
  flex-shrink: 0;
}

.news-tab.active {
  background: linear-gradient(135deg, $zb-primary 0%, lighten($zb-primary, 8%) 100%);
  color: #fff;
  font-weight: 600;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.news-item {
  display: flex;
  gap: 20rpx;
}

.news-image {
  width: 180rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.news-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-title {
  font-size: 28rpx;
  font-weight: 500;
  color: $zb-text-primary;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-summary {
  font-size: 22rpx;
  color: $zb-text-tertiary;
  margin-top: 8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: $zb-text-tertiary;
}

.news-views {
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: $zb-text-tertiary;
}

/* 底部占位 */
.bottom-space {
  height: 40rpx;
}
</style>
