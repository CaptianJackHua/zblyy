<template>
  <view class="coupon-page">
    <view class="tabs">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: active === t.key }"
        @click="active = t.key"
      >
        {{ t.label }}
      </view>
    </view>

    <view class="coupon-list">
      <view
        v-for="c in list"
        :key="c.id"
        class="coupon-card"
        :class="{ disabled: c.status !== 'available' }"
      >
        <view class="coupon-left">
          <view class="coupon-amount">
            <text class="yen">¥</text>
            <text class="num">{{ c.amount }}</text>
          </view>
          <text class="coupon-threshold">满 {{ c.threshold }} 可用</text>
        </view>
        <view class="coupon-divider"></view>
        <view class="coupon-right">
          <text class="coupon-title">{{ c.title }}</text>
          <text class="coupon-scope">{{ c.scope }}</text>
          <text class="coupon-expire">有效期至 {{ c.expire }}</text>
        </view>
        <view v-if="c.status === 'available'" class="coupon-use" @click="useCoupon">去使用</view>
        <view v-else class="coupon-status">{{ c.status === 'used' ? '已使用' : '已过期' }}</view>
      </view>
    </view>

    <view v-if="!list.length" class="empty">
      <zb-icon name="gift" class="empty-icon" />
      <text class="empty-text">暂无优惠券</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { coupons } from '@/data/coupons';
import { mallUi } from '@/utils/mall-store';

const tabs = [
  { key: 'available', label: '可用' },
  { key: 'used', label: '已使用' },
  { key: 'expired', label: '已过期' }
];

const active = ref<'available' | 'used' | 'expired'>('available');

const list = computed(() => coupons.filter((c) => c.status === active.value));

const useCoupon = () => {
  mallUi.section = 'mall';
  uni.switchTab({ url: '/pages/shop/index' });
};
</script>

<style lang="scss" scoped>
.coupon-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }

.tabs { display: flex; background: #fff; }
.tab { flex: 1; text-align: center; padding: 26rpx 0; font-size: 28rpx; color: $zb-text-secondary; position: relative; }
.tab.active { color: $zb-text-primary; font-weight: 700; }
.tab.active::after { content: ''; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 52rpx; height: 6rpx; border-radius: 6rpx; background: $zb-primary; }

.coupon-list { padding: 24rpx 32rpx; display: flex; flex-direction: column; gap: 20rpx; }
.coupon-card {
  position: relative;
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: $zb-shadow-sm;
  padding: 28rpx 24rpx;
}
.coupon-card.disabled { opacity: 0.55; }
.coupon-left { width: 180rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; background: $zb-primary-light; border-radius: 16rpx; padding: 12rpx 0; }
.coupon-amount { display: flex; align-items: baseline; color: #ff6b35; }
.yen { font-size: 24rpx; font-weight: 600; }
.num { font-size: 52rpx; font-weight: 700; line-height: 1; }
.coupon-threshold { margin-top: 8rpx; font-size: 20rpx; color: $zb-text-tertiary; }
.coupon-divider { width: 1rpx; margin: 0 24rpx; background: $zb-border-light; }
.coupon-right { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
.coupon-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.coupon-scope { margin-top: 8rpx; font-size: 22rpx; color: $zb-text-secondary; }
.coupon-expire { margin-top: 8rpx; font-size: 20rpx; color: $zb-text-tertiary; }
.coupon-use { align-self: center; padding: 12rpx 24rpx; border-radius: 24rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 24rpx; flex-shrink: 0; }
.coupon-status { align-self: center; font-size: 24rpx; color: $zb-text-tertiary; flex-shrink: 0; }

.empty { padding: 140rpx 0; display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
.empty-icon { font-size: 80rpx; color: $zb-border-dark; }
.empty-text { font-size: 26rpx; color: $zb-text-tertiary; }
</style>
