<template>
  <view class="detail-page">
    <view class="detail-header" :style="{ backgroundImage: `url(${article.image})` }">
      <view class="header-back" @click="uni.navigateBack()">
        <text class="back-icon"><zb-icon name="chevronLeft" /></text>
      </view>
    </view>

    <view class="detail-content">
      <view class="article-header">
        <view class="article-category">{{ article.category }}</view>
        <text class="article-title">{{ article.title }}</text>
        <view class="article-meta">
          <text class="article-source">{{ article.source }}</text>
          <text class="article-time">{{ article.time }}</text>
          <text class="article-views"><zb-icon name="eye" /> {{ article.views }} 阅读</text>
        </view>
      </view>

      <view class="article-body">
        <p v-for="(p, idx) in article.content" :key="idx" class="article-paragraph">{{ p }}</p>
      </view>

      <view class="article-tags">
        <text v-for="tag in article.tags" :key="tag" class="article-tag">#{{ tag }}</text>
      </view>

      <view class="article-action">
        <view class="action-item" @click="onLike">
          <text class="action-icon">{{ liked ? '<zb-icon name="heart" />' : '<zb-icon name="heart" />' }}</text>
          <text class="action-text">点赞</text>
        </view>
        <view class="action-item" @click="onCollect">
          <text class="action-icon">{{ collected ? '<zb-icon name="star" />' : '<zb-icon name="star" />' }}</text>
          <text class="action-text">收藏</text>
        </view>
        <view class="action-item" @click="onShare">
          <text class="action-icon"><zb-icon name="arrowUpRight" /></text>
          <text class="action-text">分享</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const liked = ref(false);
const collected = ref(false);

const article = {
  id: 1,
  image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800',
  category: '养生',
  title: '秋季养生：5 个小动作让你气血充盈',
  source: '中兵康养',
  time: '2026-10-28',
  views: 1234,
  tags: ['秋季养生', '气血调理', '日常保健'],
  content: [
    '秋季是养生的黄金季节。随着天气转凉，人体的新陈代谢也会逐渐减缓，这个时候进行适当的养生调理，往往能起到事半功倍的效果。',
    '中医认为，秋主收，对应肺脏。秋季养生重在润肺养阴、调理气血。以下 5 个简单的日常小动作，坚持做可以帮助您气血充盈、身体健康：',
    '1. 晨起干洗脸：清晨起床后，用双手搓热，然后轻轻干洗脸 30 次。这个动作可以促进面部血液循环，提神醒脑，同时有助于预防感冒。',
    '2. 叩齿咽津：每天早晚各叩齿 36 次，然后将产生的唾液缓缓咽下。唾液中含有多种有益成分，叩齿咽津可以固齿健脾、延年益寿。',
    '3. 按摩足三里：足三里穴位于膝盖外侧下方 3 寸处。每天用拇指按揉 5 分钟，可以调理脾胃、增强免疫力，是日常保健的"万能穴"。',
    '4. 睡前泡脚：睡前用温水（40℃ 左右）泡脚 15-20 分钟，可以促进睡眠、缓解疲劳。可根据体质加入艾叶、花椒等，效果更佳。',
    '5. 每日散步：每天坚持 30 分钟左右的轻松散步，可以促进血液循环、增强心肺功能，还能帮助消化。秋季气候宜人，是户外运动的好时节。',
    '以上这些方法简单易行，关键在于坚持。建议每天花 20-30 分钟进行养生调理，久而久之一定能看到效果。同时保持心情舒畅、饮食均衡、作息规律，才是健康的根本。'
  ]
};

const onLike = () => {
  liked.value = !liked.value;
  uni.showToast({ title: liked.value ? '已点赞' : '取消点赞', icon: 'none' });
};
const onCollect = () => {
  collected.value = !collected.value;
  uni.showToast({ title: collected.value ? '已收藏' : '取消收藏', icon: 'none' });
};
const onShare = () => uni.showToast({ title: '分享成功', icon: 'success' });
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100%; background: #fff; }
.detail-header { height: 450rpx; background-size: cover; background-position: center; position: relative; }
.header-back { position: absolute; top: 60rpx; left: 32rpx; width: 72rpx; height: 72rpx; background: rgba(0,0,0,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.back-icon { font-size: 48rpx; color: #fff; }

.detail-content { padding: 32rpx; }
.article-header { margin-bottom: 32rpx; }
.article-category { display: inline-block; padding: 6rpx 20rpx; background: $zb-primary-light; color: $zb-primary; font-size: 22rpx; border-radius: 6rpx; margin-bottom: 16rpx; }
.article-title { font-size: 40rpx; font-weight: 700; color: $zb-text-primary; line-height: 1.4; }
.article-meta { display: flex; gap: 24rpx; margin-top: 20rpx; font-size: 24rpx; color: $zb-text-tertiary; }

.article-body { margin-bottom: 32rpx; }
.article-paragraph { font-size: 30rpx; color: $zb-text-secondary; line-height: 1.9; margin-bottom: 24rpx; text-indent: 2em; }

.article-tags { display: flex; flex-wrap: wrap; gap: 16rpx; margin-bottom: 32rpx; padding-bottom: 32rpx; border-bottom: 1rpx solid $zb-border-light; }
.article-tag { font-size: 24rpx; color: $zb-primary; }

.article-action { display: flex; justify-content: space-around; padding: 24rpx 0; }
.action-item { display: flex; flex-direction: column; align-items: center; gap: 6rpx; }
.action-icon { font-size: 40rpx; }
.action-text { font-size: 24rpx; color: $zb-text-tertiary; }
</style>
