<template>
  <view class="detail-page">
    <view class="detail-header" :style="{ backgroundImage: `url(${item.image})` }">
      <view class="header-back" @click="uni.navigateBack()">
        <text class="back-icon"><zb-icon name="chevronLeft" /></text>
      </view>
      <view class="header-share" @click="onShare">
        <text class="share-icon"><zb-icon name="arrowUpRight" /></text>
      </view>
      <view class="header-overlay">
        <view class="header-tag">{{ item.tag }}</view>
      </view>
    </view>

    <view class="detail-content">
      <view class="title-section">
        <text class="item-title">{{ item.title }}</text>
        <text class="item-desc">{{ item.desc }}</text>
        <view class="item-meta">
          <text><zb-icon name="mapPin" /> {{ item.location }}</text>
          <text><zb-icon name="timer" /> {{ item.duration }}</text>
          <text><zb-icon name="users" /> {{ item.minPeople }} 人起订</text>
        </view>
      </view>

      <view class="price-section">
        <view class="price-row">
          <view class="price-main">
            <text class="currency">¥</text>
            <text class="price">{{ item.price }}</text>
            <text class="unit">/人</text>
          </view>
          <view class="price-original">
            <text class="original-label">原价</text>
            <text class="original-value">¥{{ item.originalPrice }}</text>
          </view>
        </view>
        <view class="discount-tag">
          <text class="discount">-{{ Math.round((1 - item.price / item.originalPrice) * 100) }}%</text>
          <text class="discount-text">限时特惠</text>
        </view>
      </view>

      <view class="section">
        <text class="section-title">套餐包含</text>
        <view class="include-list">
          <view class="include-item" v-for="(inc, idx) in item.includes" :key="idx">
            <text class="include-check"><zb-icon name="check" /></text>
            <text class="include-text">{{ inc }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">行程安排</text>
        <view class="schedule-list">
          <view class="schedule-item" v-for="(s, idx) in item.schedule" :key="idx">
            <view class="schedule-day">
              <text class="day-num">Day {{ idx + 1 }}</text>
            </view>
            <view class="schedule-content">
              <text class="schedule-title">{{ s.title }}</text>
              <text class="schedule-desc">{{ s.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">用户评价</text>
        <view class="review-summary">
          <view class="summary-left">
            <text class="summary-score">4.9</text>
            <text class="summary-label">综合评分</text>
          </view>
          <view class="summary-right">
            <view class="star-row">
              <text class="stars"><zb-icon name="star" /><zb-icon name="star" /><zb-icon name="star" /><zb-icon name="star" /><zb-icon name="star" /></text>
              <text class="review-count">已有 {{ item.reviewCount }} 人评价</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="detail-bottom">
      <view class="bottom-left">
        <view class="bottom-action" @click="onCollect">
          <text class="action-icon">{{ collected ? '<zb-icon name="heart" />' : '<zb-icon name="heart" />' }}</text>
          <text class="action-text">收藏</text>
        </view>
        <view class="bottom-action" @click="onContact">
          <text class="action-icon"><zb-icon name="chat" /></text>
          <text class="action-text">咨询</text>
        </view>
      </view>
      <view class="bottom-right">
        <view class="btn-cart" @click="onCart">加入购物车</view>
        <view class="btn-buy" @click="onBuy">立即预订</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const collected = ref(false);

const item = {
  id: 1,
  image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
  tag: '限时特惠',
  title: '云南大理 7 天 6 晚康养之旅',
  desc: '苍山洱海 · 静心康养 · 白族风情体验',
  location: '云南大理',
  duration: '7 天 6 晚',
  minPeople: 2,
  price: 6880,
  originalPrice: 8880,
  include: [
    '大理精品民宿 6 晚住宿',
    '每日营养早餐 + 指定正餐',
    '机场/高铁接送服务',
    '专业领队全程陪同',
    '苍山索道 + 洱海游船票',
    '2 次中医理疗体验',
    '白族三道茶 + 扎染体验',
    '旅游保险全覆盖'
  ],
  schedule: [
    { title: '抵达大理', desc: '机场/高铁站接机，入住民宿，自由活动' },
    { title: '苍山一日游', desc: '乘索道登顶苍山，游览感通索道' },
    { title: '洱海环线', desc: '租电动车环游洱海，打卡网红景点' },
    { title: '古镇体验', desc: '游览大理古城、崇圣寺三塔' },
    { title: '理疗养生', desc: '中医理疗 + 药膳调理课程' },
    { title: '文化体验', desc: '扎染体验 + 白族三道茶表演' },
    { title: '返程', desc: '早餐后退房，送机/送站' }
  ],
  reviewCount: 238
};

const onShare = () => uni.showToast({ title: '分享活动', icon: 'none' });
const onCollect = () => {
  collected.value = !collected.value;
  uni.showToast({ title: collected.value ? '已收藏' : '取消收藏', icon: 'none' });
};
const onContact = () => uni.navigateTo({ url: '/modules/xiaoyi/chat' });
const onCart = () => uni.showToast({ title: '已加入购物车', icon: 'success' });
const onBuy = () => {
  uni.showModal({
    title: '预订确认',
    content: `确定预订「${item.title}」吗？共 ¥${item.price}`,
    success: (res) => {
      if (res.confirm) uni.showToast({ title: '预订成功！', icon: 'success' });
    }
  });
};
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 160rpx; }
.detail-header { height: 500rpx; background-size: cover; background-position: center; position: relative; }
.header-back { position: absolute; top: 60rpx; left: 32rpx; width: 72rpx; height: 72rpx; background: rgba(0,0,0,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10; }
.back-icon { font-size: 48rpx; color: #fff; }
.header-share { position: absolute; top: 60rpx; right: 32rpx; width: 72rpx; height: 72rpx; background: rgba(0,0,0,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10; }
.share-icon { font-size: 36rpx; color: #fff; }
.header-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 24rpx 32rpx; background: linear-gradient(180deg, transparent, rgba(0,0,0,0.5)); }
.header-tag { padding: 6rpx 20rpx; background: #ff4d4f; color: #fff; font-size: 22rpx; border-radius: 6rpx; align-self: flex-start; }

.detail-content { padding: 32rpx; }
.title-section { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; }
.item-title { font-size: 36rpx; font-weight: 700; color: $zb-text-primary; display: block; line-height: 1.3; }
.item-desc { font-size: 26rpx; color: $zb-text-secondary; margin-top: 12rpx; display: block; }
.item-meta { display: flex; gap: 24rpx; margin-top: 16rpx; font-size: 22rpx; color: $zb-text-tertiary; }

.price-section { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; }
.price-row { display: flex; justify-content: space-between; align-items: flex-end; }
.price-main { display: flex; align-items: baseline; gap: 4rpx; }
.currency { font-size: 28rpx; color: #ff4d4f; font-weight: 500; }
.price { font-size: 56rpx; color: #ff4d4f; font-weight: 700; }
.unit { font-size: 24rpx; color: $zb-text-tertiary; margin-left: 8rpx; }
.price-original { display: flex; gap: 8rpx; align-items: baseline; }
.original-label { font-size: 22rpx; color: $zb-text-tertiary; }
.original-value { font-size: 26rpx; color: $zb-text-tertiary; text-decoration: line-through; }
.discount-tag { margin-top: 16rpx; display: flex; gap: 12rpx; align-items: center; }
.discount { padding: 4rpx 12rpx; background: #fff1f0; color: #ff4d4f; font-size: 22rpx; border-radius: 6rpx; font-weight: 600; }
.discount-text { font-size: 22rpx; color: #ff4d4f; }

.section { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; margin-bottom: 20rpx; display: block; }

.include-list { display: flex; flex-direction: column; gap: 12rpx; }
.include-item { display: flex; gap: 12rpx; align-items: flex-start; }
.include-check { color: $zb-success; font-size: 24rpx; font-weight: 700; margin-top: 4rpx; }
.include-text { font-size: 26rpx; color: $zb-text-secondary; flex: 1; }

.schedule-list { display: flex; flex-direction: column; }
.schedule-item { display: flex; gap: 20rpx; padding: 16rpx 0; border-bottom: 1rpx solid $zb-border-light; }
.schedule-item:last-child { border-bottom: none; }
.schedule-day { width: 100rpx; flex-shrink: 0; }
.day-num { font-size: 24rpx; font-weight: 600; color: $zb-primary; background: $zb-primary-light; padding: 6rpx 12rpx; border-radius: 6rpx; }
.schedule-content { flex: 1; }
.schedule-title { font-size: 26rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.schedule-desc { font-size: 24rpx; color: $zb-text-secondary; margin-top: 6rpx; display: block; }

.review-summary { display: flex; justify-content: space-between; align-items: center; }
.summary-left { text-align: center; }
.summary-score { font-size: 48rpx; font-weight: 700; color: #faad14; display: block; }
.summary-label { font-size: 22rpx; color: $zb-text-tertiary; }
.summary-right { flex: 1; margin-left: 40rpx; }
.star-row { display: flex; flex-direction: column; gap: 6rpx; }
.stars { font-size: 24rpx; letter-spacing: 2rpx; }
.review-count { font-size: 22rpx; color: $zb-text-tertiary; }

.detail-bottom { position: fixed; bottom: 0; left: 0; right: 0; display: flex; align-items: center; padding: 16rpx 32rpx; background: #fff; box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08); padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); z-index: 100; }
.bottom-left { display: flex; gap: 40rpx; }
.bottom-action { display: flex; flex-direction: column; align-items: center; gap: 2rpx; }
.action-icon { font-size: 32rpx; }
.action-text { font-size: 18rpx; color: $zb-text-tertiary; }
.bottom-right { flex: 1; display: flex; gap: 16rpx; margin-left: 40rpx; }
.btn-cart { flex: 1; padding: 20rpx 0; text-align: center; background: $zb-primary-light; color: $zb-primary; font-size: 26rpx; border-radius: 36rpx; font-weight: 500; }
.btn-buy { flex: 1; padding: 20rpx 0; text-align: center; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 26rpx; border-radius: 36rpx; font-weight: 600; }
</style>
