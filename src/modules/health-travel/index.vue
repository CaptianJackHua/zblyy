<template>
  <view class="travel-page">
    <view class="page-banner">
      <view class="banner-bg"></view>
      <view class="banner-content">
        <text class="banner-title">康养旅居</text>
        <text class="banner-sub">山水之间 · 身心共养</text>
      </view>
    </view>

    <view class="category-nav">
      <view class="nav-item active"><zb-icon name="mountain" /> 旅居套餐</view>
      <view class="nav-item"><zb-icon name="home" /> 特色住宿</view>
      <view class="nav-item"><zb-icon name="user" /> 老年康养</view>
    </view>

    <view class="hero-card">
      <view class="hero-bg" :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800)` }">
        <view class="hero-overlay">
          <text class="hero-tag">限时特惠</text>
          <text class="hero-title">云南大理 7 天 6 晚</text>
          <text class="hero-desc">苍山洱海 · 静心康养之旅</text>
          <view class="hero-bottom">
            <view class="hero-price">
              <text class="currency">¥</text>
              <text class="price">6880</text>
              <text class="original">¥8880</text>
            </view>
            <view class="hero-btn">立即预订</view>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">精选目的地</text>
      </view>
      <view class="dest-grid">
        <view v-for="d in destinations" :key="d.id" class="dest-card">
          <view class="dest-image" :style="{ backgroundImage: `url(${d.image})` }">
            <text class="dest-name">{{ d.name }}</text>
          </view>
          <text class="dest-desc">{{ d.desc }}</text>
          <text class="dest-count">{{ d.count }} 个套餐</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">全部套餐</text>
      </view>
      <view class="package-list">
        <view v-for="p in packages" :key="p.id" class="package-card" @click="onBook(p)">
          <view class="package-image" :style="{ backgroundImage: `url(${p.image})` }"></view>
          <view class="package-info">
            <text class="package-title">{{ p.title }}</text>
            <text class="package-location"><zb-icon name="mapPin" /> {{ p.location }}</text>
            <view class="package-tags">
              <text v-for="tag in p.tags" :key="tag" class="package-tag">{{ tag }}</text>
            </view>
            <view class="package-bottom">
              <view class="package-price">
                <text class="currency">¥</text>
                <text class="price">{{ p.price }}</text>
                <text class="unit">起</text>
              </view>
              <text class="package-days">{{ p.days }} 天</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const destinations = [
  { id: 1, name: '云南大理', desc: '苍山洱海 · 白族风情', count: 8, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400' },
  { id: 2, name: '浙江安吉', desc: '竹海深处 · 茶禅一味', count: 5, image: 'https://images.unsplash.com/photo-1544737151-6e4b999de2a7?w=400' },
  { id: 3, name: '海南三亚', desc: '椰风海韵 · 热带秘境', count: 12, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { id: 4, name: '四川成都', desc: '天府之国 · 慢生活', count: 6, image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400' }
];

const packages = [
  { id: 1, title: '大理静心康养之旅', location: '云南大理', days: 7, price: 6880, tags: ['含住宿', '含三餐', '含理疗'], image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400' },
  { id: 2, title: '安吉竹海养生套餐', location: '浙江安吉', days: 5, price: 4980, tags: ['精品民宿', '中医理疗'], image: 'https://images.unsplash.com/photo-1544737151-6e4b999de2a7?w=400' },
  { id: 3, title: '三亚滨海康养行', location: '海南三亚', days: 10, price: 12880, tags: ['海景房', '温泉SPA'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { id: 4, title: '成都慢生活体验', location: '四川成都', days: 5, price: 3880, tags: ['民宿', '文化体验'], image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400' }
];

const onBook = (p: any) => {
  uni.showToast({ title: `预订 ${p.title}`, icon: 'none' });
};
</script>

<style lang="scss" scoped>
.travel-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-banner { position: relative; height: 240rpx; }
.banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0f766e 0%, #2ec4b6 50%, #3b82f6 100%); }
.banner-content { position: relative; z-index: 1; padding: 70rpx 32rpx; }
.banner-title { font-size: 44rpx; font-weight: 700; color: #fff; display: block; }
.banner-sub { font-size: 26rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.category-nav { display: flex; margin: -30rpx 32rpx 0; position: relative; z-index: 2; background: #fff; border-radius: 20rpx; padding: 12rpx; box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.08); }
.nav-item { flex: 1; text-align: center; padding: 16rpx 0; font-size: 26rpx; color: $zb-text-secondary; border-radius: 16rpx; }
.nav-item.active { background: $zb-primary-light; color: $zb-primary; font-weight: 600; }

.hero-card { margin: 24rpx 32rpx; }
.hero-bg { width: 100%; height: 360rpx; background-size: cover; background-position: center; border-radius: 24rpx; overflow: hidden; position: relative; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%); padding: 32rpx; display: flex; flex-direction: column; justify-content: flex-end; }
.hero-tag { padding: 4rpx 16rpx; background: #ff4d4f; color: #fff; font-size: 22rpx; border-radius: 6rpx; align-self: flex-start; }
.hero-title { font-size: 36rpx; font-weight: 700; color: #fff; margin-top: 12rpx; }
.hero-desc { font-size: 24rpx; color: rgba(255,255,255,0.8); margin-top: 6rpx; }
.hero-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 20rpx; }
.hero-price .currency { font-size: 24rpx; color: #ff4d4f; }
.hero-price .price { font-size: 48rpx; color: #ff4d4f; font-weight: 700; }
.hero-price .original { font-size: 24rpx; color: rgba(255,255,255,0.6); text-decoration: line-through; margin-left: 8rpx; }
.hero-btn { padding: 16rpx 40rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 26rpx; border-radius: 28rpx; }

.section { margin: 24rpx 32rpx; background: #fff; border-radius: 20rpx; padding: 28rpx; }
.section-header { margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }

.dest-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20rpx; }
.dest-card { background: $zb-bg-grey; border-radius: 16rpx; overflow: hidden; }
.dest-image { height: 180rpx; background-size: cover; background-position: center; display: flex; align-items: flex-end; padding: 12rpx; }
.dest-name { font-size: 28rpx; font-weight: 600; color: #fff; text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.5); }
.dest-desc { font-size: 22rpx; color: $zb-text-secondary; padding: 12rpx 16rpx 4rpx; display: block; }
.dest-count { font-size: 20rpx; color: $zb-primary; padding: 0 16rpx 12rpx; display: block; }

.package-list { display: flex; flex-direction: column; gap: 24rpx; }
.package-card { display: flex; gap: 20rpx; padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.package-image { width: 200rpx; height: 200rpx; border-radius: 16rpx; background-size: cover; background-position: center; flex-shrink: 0; }
.package-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.package-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.package-location { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; }
.package-tags { display: flex; gap: 8rpx; margin-top: 8rpx; flex-wrap: wrap; }
.package-tag { font-size: 20rpx; color: $zb-primary; background: $zb-primary-light; padding: 4rpx 12rpx; border-radius: 6rpx; }
.package-bottom { display: flex; align-items: center; justify-content: space-between; }
.package-price .currency { font-size: 20rpx; color: #ff4d4f; }
.package-price .price { font-size: 36rpx; color: #ff4d4f; font-weight: 700; }
.package-price .unit { font-size: 20rpx; color: $zb-text-tertiary; }
.package-days { font-size: 22rpx; color: $zb-text-tertiary; }

.bottom-space { height: 40rpx; }
</style>
