<template>
  <view class="checkout-page">
    <view class="address-card">
      <view class="address-icon"><zb-icon name="mapPin" /></view>
      <view class="address-main">
        <text class="address-name">张先生  138****8888</text>
        <text class="address-detail">北京市朝阳区建国路 88 号中兵康养中心</text>
      </view>
      <view class="address-arrow" @click="onAddress">
        <zb-icon name="chevronRight" />
      </view>
    </view>

    <view class="card">
      <view class="card-title">商品清单</view>
      <view v-for="item in items" :key="item.id" class="goods-row">
        <view class="goods-image" :style="{ backgroundImage: `url(${item.image})` }"></view>
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-spec">{{ item.spec }}</text>
          <view class="goods-bottom">
            <text class="goods-price">¥{{ item.price }}</text>
            <text class="goods-qty">x{{ item.qty }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card remark-card">
      <text class="remark-label">订单备注</text>
      <input
        v-model="remark"
        class="remark-input"
        placeholder="选填，请先和商家协商一致"
        placeholder-class="remark-placeholder"
      />
    </view>

    <view class="card">
      <view class="card-title">支付方式</view>
      <view class="pay-row" @click="payMethod = 'wechat'">
        <view class="pay-left">
          <zb-icon name="chat" class="pay-icon wechat" />
          <text class="pay-name">微信支付</text>
        </view>
        <view class="radio" :class="{ active: payMethod === 'wechat' }">
          <zb-icon v-if="payMethod === 'wechat'" name="check" />
        </view>
      </view>
      <view class="pay-row" @click="payMethod = 'alipay'">
        <view class="pay-left">
          <zb-icon name="wallet" class="pay-icon alipay" />
          <text class="pay-name">支付宝</text>
        </view>
        <view class="radio" :class="{ active: payMethod === 'alipay' }">
          <zb-icon v-if="payMethod === 'alipay'" name="check" />
        </view>
      </view>
    </view>

    <view class="card">
      <view class="amount-row">
        <text class="amount-label">商品合计</text>
        <text class="amount-value">¥{{ total }}</text>
      </view>
      <view class="amount-row">
        <text class="amount-label">运费</text>
        <text class="amount-free">免运费</text>
      </view>
      <view class="amount-row total-row">
        <text class="amount-label">实付金额</text>
        <text class="amount-final">¥{{ total }}</text>
      </view>
    </view>

    <view class="bottom-space"></view>

    <view v-if="items.length" class="checkout-bottom">
      <view class="bottom-total">
        <text class="bottom-label">合计</text>
        <text class="bottom-amount">¥{{ total }}</text>
      </view>
      <view class="submit-btn" @click="submit">提交订单并支付</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import {
  mallState,
  checkoutTotal,
  createOrder,
  payOrder,
  removeFromCart
} from '@/utils/mall-store';

const ADDRESS = '张先生 138****8888 北京市朝阳区建国路 88 号中兵康养中心';

const items = computed(() => mallState.checkout);
const total = computed(() => checkoutTotal());
const remark = ref('');
const payMethod = ref<'wechat' | 'alipay'>('wechat');
const submitting = ref(false);

onLoad(() => {
  if (!mallState.checkout.length) {
    uni.showToast({ title: '请选择商品', icon: 'none' });
    setTimeout(() => {
      uni.navigateBack({
        fail: () => uni.switchTab({ url: '/pages/shop/index' })
      });
    }, 800);
  }
});

const onAddress = () => uni.showToast({ title: '地址管理开发中', icon: 'none' });

const submit = () => {
  if (submitting.value || !items.value.length) return;
  submitting.value = true;
  const order = createOrder(ADDRESS);
  uni.showLoading({ title: '支付中...', mask: true });
  setTimeout(() => {
    uni.hideLoading();
    payOrder(order.id);
    items.value.forEach((item) => {
      if (mallState.cart.some((c) => c.id === item.id)) {
        removeFromCart(item.id);
      }
    });
    submitting.value = false;
    uni.redirectTo({ url: `/modules/shop/order-detail?id=${order.id}` });
  }, 800);
};
</script>

<style lang="scss" scoped>
.checkout-page { min-height: 100%; background: $zb-bg-page; padding: 24rpx 32rpx 180rpx; }

.address-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: $zb-shadow-sm;
}
.address-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: $zb-primary-light;
  color: $zb-primary;
  font-size: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.address-main { flex: 1; min-width: 0; }
.address-name { display: block; font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.address-detail { display: block; margin-top: 8rpx; font-size: 24rpx; color: $zb-text-secondary; line-height: 1.5; }
.address-arrow { font-size: 28rpx; color: $zb-text-tertiary; flex-shrink: 0; }

.card {
  margin-top: 20rpx;
  padding: 28rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: $zb-shadow-sm;
}
.card-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; margin-bottom: 20rpx; }

.goods-row { display: flex; gap: 20rpx; padding: 16rpx 0; }
.goods-image {
  width: 144rpx;
  height: 144rpx;
  border-radius: 16rpx;
  background-size: cover;
  background-position: center;
  background-color: $zb-bg-grey;
  flex-shrink: 0;
}
.goods-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.goods-name {
  font-size: 27rpx;
  font-weight: 600;
  color: $zb-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods-spec { display: block; margin-top: 8rpx; font-size: 22rpx; color: $zb-text-tertiary; }
.goods-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
.goods-price { font-size: 28rpx; font-weight: 700; color: #ff4d4f; }
.goods-qty { font-size: 24rpx; color: $zb-text-tertiary; }

.remark-card { display: flex; align-items: center; gap: 20rpx; }
.remark-label { font-size: 27rpx; color: $zb-text-primary; flex-shrink: 0; }
.remark-input { flex: 1; font-size: 26rpx; color: $zb-text-primary; text-align: right; }
.remark-placeholder { color: $zb-text-tertiary; font-size: 24rpx; }

.pay-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0;
}
.pay-row + .pay-row { border-top: 1rpx solid $zb-border-light; }
.pay-left { display: flex; align-items: center; gap: 16rpx; }
.pay-icon { font-size: 36rpx; }
.pay-icon.wechat { color: #07c160; }
.pay-icon.alipay { color: #1677ff; }
.pay-name { font-size: 27rpx; color: $zb-text-primary; }
.radio {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  border: 2rpx solid $zb-border-dark;
  color: #fff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radio.active { background: $zb-primary; border-color: $zb-primary; }

.amount-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  font-size: 26rpx;
  color: $zb-text-secondary;
}
.amount-label { color: $zb-text-secondary; }
.amount-value { color: $zb-text-primary; }
.amount-free { color: $zb-success; }
.total-row { margin-top: 8rpx; padding-top: 20rpx; border-top: 1rpx solid $zb-border-light; }
.total-row .amount-label { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.amount-final { font-size: 32rpx; font-weight: 700; color: #ff4d4f; }

.bottom-space { height: 40rpx; }

.checkout-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 16rpx 32rpx calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(26, 26, 46, 0.08);
}
.bottom-total { flex: 1; text-align: right; }
.bottom-label { font-size: 24rpx; color: $zb-text-secondary; }
.bottom-amount { margin-left: 10rpx; font-size: 34rpx; font-weight: 700; color: #ff4d4f; }
.submit-btn {
  padding: 22rpx 44rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff4d4f 100%);
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  flex-shrink: 0;
}
</style>
