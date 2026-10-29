<template>
  <view class="order-page">
    <template v-if="order">
      <view class="status-hero" :class="'hero-' + order.status">
        <text class="status-title">{{ statusTitle }}</text>
        <text class="status-desc">{{ statusDesc }}</text>
      </view>

      <view class="content">
        <view class="card address-card">
          <view class="address-icon"><zb-icon name="mapPin" /></view>
          <view class="address-main">
            <text class="address-title">收货信息</text>
            <text class="address-text">{{ order.address }}</text>
          </view>
        </view>

        <view class="card">
          <view class="card-title">商品清单</view>
          <view v-for="item in order.items" :key="item.id" class="goods-row">
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
          <view class="goods-total">
            <text class="goods-total-label">实付款</text>
            <text class="goods-total-value">¥{{ order.total }}</text>
          </view>
        </view>

        <view class="card">
          <view class="card-title">订单信息</view>
          <view class="info-row">
            <text class="info-label">订单编号</text>
            <text class="info-value">{{ order.no }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">下单时间</text>
            <text class="info-value">{{ formatTime(order.createdAt) }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">支付方式</text>
            <text class="info-value">微信支付</text>
          </view>
        </view>

        <view class="bottom-space"></view>

        <view class="order-bottom">
          <view v-if="order.status === 'pending'" class="action-btn primary" @click="onPay">去支付</view>
          <view v-else-if="order.status === 'paid'" class="action-btn" @click="onRemind">提醒发货</view>
          <view v-else-if="order.status === 'shipped'" class="action-btn primary" @click="onFinish">
            确认收货
          </view>
          <view v-else class="action-btn primary" @click="onBuyAgain">再次购买</view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import type { OrderStatus } from '@/utils/mall-store';
import {
  getOrder,
  payOrder,
  shipOrder,
  finishOrder,
  orderStatusText,
  setCheckout
} from '@/utils/mall-store';

const orderId = ref('');
const order = computed(() => getOrder(orderId.value));

onLoad((q: any) => {
  orderId.value = String(q?.id || '');
  if (!getOrder(orderId.value)) {
    uni.showToast({ title: '订单不存在', icon: 'none' });
    setTimeout(() => {
      uni.navigateBack({
        fail: () => uni.switchTab({ url: '/pages/shop/index' })
      });
    }, 800);
  }
});

const statusTitle = computed(() => (order.value ? orderStatusText(order.value.status) : ''));

const statusDesc = computed(() => {
  if (!order.value) return '';
  const map: Record<OrderStatus, string> = {
    pending: '订单已创建，请尽快完成支付',
    paid: '商家正在备货，请耐心等待发货',
    shipped: '商品已发出，请注意查收',
    done: '订单已完成，感谢您的支持'
  };
  return map[order.value.status];
});

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};

const onPay = () => {
  if (!order.value) return;
  payOrder(order.value.id);
  uni.showToast({ title: '支付成功', icon: 'none' });
};

const onRemind = () => {
  if (!order.value) return;
  shipOrder(order.value.id);
  uni.showToast({ title: '商家已发货，请留意物流', icon: 'none' });
};

const onFinish = () => {
  if (!order.value) return;
  finishOrder(order.value.id);
  uni.showToast({ title: '已确认收货', icon: 'none' });
};

const onBuyAgain = () => {
  if (!order.value) return;
  setCheckout(order.value.items);
  uni.navigateTo({ url: '/modules/shop/checkout' });
};
</script>

<style lang="scss" scoped>
.order-page { min-height: 100%; background: $zb-bg-page; }

.status-hero { padding: 40rpx 32rpx 48rpx; color: #fff; }
.hero-pending { background: linear-gradient(135deg, #ff9a3d 0%, #ff4d4f 100%); }
.hero-paid { background: linear-gradient(135deg, #2ec4b6 0%, #25a095 100%); }
.hero-shipped { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.hero-done { background: linear-gradient(135deg, #8e9aaf 0%, #5c677d 100%); }
.status-title { display: block; font-size: 40rpx; font-weight: 700; }
.status-desc { display: block; margin-top: 12rpx; font-size: 24rpx; opacity: 0.88; }

.content { padding: 24rpx 32rpx 180rpx; margin-top: -24rpx; }

.card {
  margin-bottom: 20rpx;
  padding: 28rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: $zb-shadow-sm;
}
.card-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; margin-bottom: 20rpx; }

.address-card { display: flex; align-items: flex-start; gap: 20rpx; }
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
.address-title { display: block; font-size: 26rpx; font-weight: 600; color: $zb-text-primary; }
.address-text { display: block; margin-top: 8rpx; font-size: 24rpx; color: $zb-text-secondary; line-height: 1.6; }

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
.goods-total {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid $zb-border-light;
}
.goods-total-label { font-size: 24rpx; color: $zb-text-secondary; }
.goods-total-value { font-size: 32rpx; font-weight: 700; color: #ff4d4f; }

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  font-size: 25rpx;
}
.info-label { color: $zb-text-tertiary; flex-shrink: 0; }
.info-value { color: $zb-text-primary; text-align: right; }

.bottom-space { height: 20rpx; }

.order-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  padding: 16rpx 32rpx calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(26, 26, 46, 0.08);
}
.action-btn {
  padding: 20rpx 56rpx;
  border-radius: 40rpx;
  border: 1rpx solid $zb-border-dark;
  color: $zb-text-secondary;
  font-size: 27rpx;
}
.action-btn.primary {
  border-color: transparent;
  background: linear-gradient(135deg, #ff6b35 0%, #ff4d4f 100%);
  color: #fff;
  font-weight: 600;
}
</style>
