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
      <swiper class="banner-swiper" :autoplay="true" :interval="4000" :circular="true" :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" @change="onBannerChange">
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
        <text class="search-placeholder">搜索服务、商品、酒店</text>
        <text class="search-btn">搜索</text>
      </view>
    </view>

    <!-- 快捷入口 4 宫格 -->
    <view class="quick-entry">
      <view class="entry-grid">
        <view 
          v-for="item in quickEntries" 
          :key="item.id" 
          class="entry-item"
          @click="navigateTo(item.path)"
        >
          <view class="entry-icon" :style="{ backgroundColor: item.color }">
            <zb-icon class="entry-emoji" :name="item.icon" :color="item.textColor" />
          </view>
          <text class="entry-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 中兵小医 AI 助手 -->
    <view class="xiaoyi-card" @click="navigateTo('/modules/xiaoyi/chat')">
      <view class="xiaoyi-left">
        <view class="xiaoyi-avatar"><zb-icon name="bot" color="#ffffff" /></view>
        <view class="xiaoyi-info">
          <view class="xiaoyi-name">
            <text class="name-cn">中兵小医</text>
            <text class="name-en">ZHONGBING AI DOCTOR</text>
          </view>
          <text class="xiaoyi-desc">智能健康顾问 · 24 小时在线</text>
        </view>
      </view>
      <view class="xiaoyi-btn">
        <text class="btn-text">立即咨询</text>
      </view>
    </view>

    <!-- 内容 Banner 轮播 -->
    <view class="content-banner-section">
      <swiper class="content-swiper" :autoplay="true" :interval="5000" :circular="true" @click="onContentBannerClick">
        <swiper-item v-for="item in contentBanners" :key="item.id">
          <view class="content-banner" :style="{ backgroundImage: `url(${item.image})` }">
            <view class="content-banner-overlay">
              <view class="content-banner-title">{{ item.title }}</view>
              <view class="content-banner-desc">{{ item.desc }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 我的健康模块 -->
    <view class="section">
      <view class="section-header">
        <view class="header-left">
          <text class="section-title">我的健康</text>
          <text class="section-subtitle">My Health Space</text>
        </view>
        <view class="header-more" @click="navigateTo('/modules/health-archive/index')">
          <text>个人健康空间</text>
          <zb-icon class="arrow" name="chevronRight" color="#999999" />
        </view>
      </view>
      <view class="health-grid">
        <view 
          v-for="item in healthModules" 
          :key="item.id" 
          class="health-item"
          @click="navigateTo(item.path)"
        >
          <view class="health-icon-wrap">
            <zb-icon class="health-icon" :name="item.icon" color="#2ec4b6" />
          </view>
          <text class="health-name">{{ item.name }}</text>
          <text class="health-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 会员权益模块 -->
    <view class="section member-section">
      <view class="section-header">
        <view class="header-left">
          <text class="section-title">会员权益</text>
          <text class="section-subtitle">Member Benefits</text>
        </view>
      </view>
      <view class="member-content">
        <view class="member-left">
          <view 
            v-for="item in memberBenefits" 
            :key="item.id" 
            class="member-item"
            @click="navigateTo(item.path)"
          >
            <view class="member-item-info">
              <text class="member-item-name">{{ item.name }}</text>
              <text class="member-item-desc">{{ item.desc }}</text>
            </view>
            <zb-icon class="member-item-arrow" name="chevronRight" color="#999999" />
          </view>
        </view>
        <view class="member-card" @click="navigateTo('/modules/member/index')">
          <view class="card-decoration"></view>
          <view class="card-content">
            <text class="card-title">礼遇升级</text>
            <text class="card-sub">家庭康养会员卡</text>
            <view class="card-btn">立即查看</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 活动优惠模块 -->
    <view class="section">
      <view class="section-header">
        <view class="header-left">
          <text class="section-title">活动优惠</text>
          <text class="section-subtitle">Special Offers</text>
        </view>
        <view class="header-more" @click="navigateTo('/modules/activity/index')">
          <text>查看更多</text>
          <zb-icon class="arrow" name="chevronRight" color="#999999" />
        </view>
      </view>
      <view class="activity-list">
        <view 
          v-for="item in activityCards" 
          :key="item.id" 
          class="activity-card"
          @click="navigateTo(item.path)"
        >
          <view class="activity-image" :style="{ backgroundImage: `url(${item.image})` }">
            <view class="activity-tag">{{ item.tag }}</view>
          </view>
          <view class="activity-info">
            <view class="activity-type">{{ item.title }}</view>
            <view class="activity-desc">{{ item.desc }}</view>
            <view class="activity-price-row">
              <view class="price-wrap">
                <text class="currency">¥</text>
                <text class="price">{{ item.price }}</text>
                <text class="original-price">¥{{ item.originalPrice }}</text>
              </view>
              <view class="activity-btn">立即抢购</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 商城模块 -->
    <view class="section">
      <view class="section-header">
        <view class="header-left">
          <text class="section-title">商城</text>
          <text class="section-subtitle">Shop</text>
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
          <view class="shop-image" :style="{ backgroundImage: `url(${item.image})` }"></view>
          <view class="shop-info">
            <text class="shop-name">{{ item.name }}</text>
            <text class="shop-spec">{{ item.spec }}</text>
            <view class="shop-bottom">
              <view class="shop-price">
                <text class="currency">¥</text>
                <text class="price">{{ item.price }}</text>
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
          @click="navigateTo('/modules/store/index')"
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
      <view class="news-list">
        <view 
          v-for="news in newsList" 
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
import { onShow } from '@dcloudio/uni-app';
import { bannerList, quickEntries, contentBanners, healthModules, memberBenefits, activityCards, shopProducts, newsList, storeList } from '@/data/home';

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

const onBannerChange = (e: any) => {
  console.log('Banner 切换:', e.detail.current);
};

const onContentBannerClick = () => {
  uni.showToast({ title: '跳转活动详情', icon: 'none' });
};

const addToCart = (item: any) => {
  uni.showToast({ title: `${item.name} 已加入购物车`, icon: 'success' });
};
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

/* 快捷入口 */
.quick-entry {
  margin: 72rpx 24rpx 0;
  padding: 36rpx 12rpx 32rpx;
  background: #fff;
  border-radius: 28rpx;
  box-shadow: 0 8rpx 28rpx rgba(26, 26, 46, 0.06);
}

.entry-grid {
  display: flex;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 18rpx;
}

.entry-icon {
  width: 104rpx;
  height: 104rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.entry-emoji {
  font-size: 48rpx;
}

.entry-name {
  font-size: 26rpx;
  font-weight: 500;
  color: $zb-text-primary;
  letter-spacing: 0.5rpx;
}

/* 中兵小医卡片 */
.xiaoyi-card {
  margin: 24rpx 32rpx;
  padding: 28rpx;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8rpx 32rpx rgba(26, 26, 46, 0.2);
}

.xiaoyi-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
  min-width: 0;
}

.xiaoyi-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, $zb-primary 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}

.xiaoyi-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.xiaoyi-name {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  min-width: 0;
}

.name-cn {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  flex-shrink: 0;
}

.name-en {
  font-size: 18rpx;
  color: rgba(255,255,255,0.5);
  letter-spacing: 1rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.xiaoyi-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.6);
  margin-top: 6rpx;
}

.xiaoyi-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, $zb-primary 0%, lighten($zb-primary, 8%) 100%);
  border-radius: 36rpx;
  flex-shrink: 0;
}

.btn-text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 500;
  white-space: nowrap;
}

.btn-arrow {
  color: #fff;
  font-size: 26rpx;
}

/* 内容 Banner */
.content-banner-section {
  margin: 0 32rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.content-swiper {
  width: 100%;
  height: 240rpx;
}

.content-banner {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 24rpx;
  position: relative;
}

.content-banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%);
}

.content-banner-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
}

.content-banner-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.85);
  margin-top: 6rpx;
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

/* 我的健康 - 4 按钮组 */
.health-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.health-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 8rpx;
  background: $zb-bg-grey;
  border-radius: 16rpx;
}

.health-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  margin-bottom: 12rpx;
  box-shadow: $zb-shadow-sm;
}

.health-icon {
  font-size: 32rpx;
}

.health-name {
  font-size: 24rpx;
  font-weight: 500;
  color: $zb-text-regular;
}

.health-desc {
  font-size: 20rpx;
  color: $zb-text-tertiary;
  margin-top: 4rpx;
}

/* 会员权益 */
.member-content {
  display: flex;
  gap: 20rpx;
}

.member-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $zb-border-light;
  
  &:last-child {
    border-bottom: none;
  }
}

.member-item-info {
  display: flex;
  flex-direction: column;
}

.member-item-name {
  font-size: 28rpx;
  font-weight: 500;
  color: $zb-text-regular;
}

.member-item-desc {
  font-size: 22rpx;
  color: $zb-text-tertiary;
  margin-top: 4rpx;
}

.member-item-arrow {
  font-size: 32rpx;
  color: $zb-text-tertiary;
}

.member-card {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, #2ec4b6 0%, #3b82f6 100%);
  border-radius: 20rpx;
  position: relative;
  overflow: hidden;
  padding: 20rpx;
}

.card-decoration {
  position: absolute;
  top: -40rpx;
  right: -40rpx;
  width: 120rpx;
  height: 120rpx;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

.card-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
}

.card-sub {
  font-size: 20rpx;
  color: rgba(255,255,255,0.8);
  margin-top: 4rpx;
}

.card-btn {
  margin-top: 12rpx;
  padding: 6rpx 16rpx;
  background: rgba(255,255,255,0.25);
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #fff;
  text-align: center;
}

/* 活动优惠 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.activity-card {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: $zb-bg-grey;
  border-radius: 20rpx;
}

.activity-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 16rpx;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}

.activity-tag {
  position: absolute;
  top: 12rpx;
  left: 0;
  padding: 4rpx 12rpx;
  background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
  color: #fff;
  font-size: 20rpx;
  border-radius: 0 12rpx 12rpx 0;
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.activity-type {
  font-size: 26rpx;
  font-weight: 600;
  color: $zb-text-primary;
}

.activity-desc {
  font-size: 24rpx;
  color: $zb-text-secondary;
  margin: 8rpx 0;
  flex: 1;
}

.activity-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
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
  font-size: 22rpx;
  color: $zb-text-tertiary;
  text-decoration: line-through;
}

.activity-btn {
  padding: 12rpx 24rpx;
  background: linear-gradient(135deg, $zb-primary 0%, lighten($zb-primary, 8%) 100%);
  color: #fff;
  font-size: 24rpx;
  border-radius: 24rpx;
}

/* 商城 */
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
