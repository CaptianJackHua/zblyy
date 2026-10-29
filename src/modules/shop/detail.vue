<template>
  <view class="detail-page">
    <view class="product-hero" :style="{ backgroundImage: `url(${product.image})` }">
      <view v-if="product.tag" class="hero-tag">{{ product.tag }}</view>
    </view>

    <view class="price-card">
      <view class="price-row">
        <view class="price-main">
          <text class="currency">¥</text>
          <text class="price">{{ product.price }}</text>
        </view>
        <text class="price-original">¥{{ product.originalPrice }}</text>
        <text v-if="product.tag" class="price-tag">{{ product.tag }}</text>
      </view>
      <text class="product-name">{{ product.name }}</text>
      <view class="meta-row">
        <text class="meta-spec">{{ product.spec }}</text>
        <text class="meta-sold">已售 {{ product.sold }}</text>
      </view>
    </view>

    <view class="card">
      <view class="card-title">商品介绍</view>
      <text class="desc">{{ product.desc }}</text>
      <view class="feature-list">
        <view v-for="(feature, idx) in product.features" :key="idx" class="feature">
          <zb-icon name="check" class="feature-icon" />
          <text class="feature-text">{{ feature }}</text>
        </view>
      </view>
    </view>

    <view class="card service-card">
      <view class="service-item"><zb-icon name="check" class="service-icon" /><text>正品保障</text></view>
      <view class="service-item"><zb-icon name="check" class="service-icon" /><text>7 天无理由</text></view>
      <view class="service-item"><zb-icon name="check" class="service-icon" /><text>极速发货</text></view>
    </view>

    <view class="bottom-space"></view>

    <view class="detail-bottom">
      <view class="cart-action" @click="goCart">
        <zb-icon name="cart" class="cart-icon" />
        <text class="cart-text">购物车</text>
        <text v-if="cartNum > 0" class="cart-badge">{{ cartNum }}</text>
      </view>
      <view class="btn-cart" @click="onAddCart">加入购物车</view>
      <view class="btn-buy" @click="onBuyNow">立即购买</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { products, getProduct } from '@/data/mall';
import type { MallProduct } from '@/data/mall';
import { addToCart, setCheckout, mallUi, cartCount } from '@/utils/mall-store';

const product = ref<MallProduct>(products[0]);

onLoad((q: any) => {
  product.value = getProduct(Number(q?.id)) || products[0];
});

const cartNum = computed(() => cartCount());

const goCart = () => {
  mallUi.section = 'cart';
  uni.switchTab({ url: '/pages/shop/index' });
};

const onAddCart = () => {
  addToCart(product.value);
  uni.showToast({ title: '已加入购物车', icon: 'none' });
};

const onBuyNow = () => {
  const p = product.value;
  setCheckout([
    { id: p.id, name: p.name, spec: p.spec, price: p.price, image: p.image, qty: 1 }
  ]);
  uni.navigateTo({ url: '/modules/shop/checkout' });
};
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 180rpx; }

.product-hero {
  position: relative;
  height: 640rpx;
  background-size: cover;
  background-position: center;
  background-color: $zb-bg-grey;
}
.hero-tag {
  position: absolute;
  left: 32rpx;
  bottom: 32rpx;
  padding: 8rpx 20rpx;
  background: linear-gradient(90deg, #ff6b35, #ff4d4f);
  color: #fff;
  font-size: 22rpx;
  border-radius: 8rpx;
}

.price-card { background: #fff; padding: 28rpx 32rpx; }
.price-row { display: flex; align-items: center; gap: 16rpx; }
.price-main { display: flex; align-items: baseline; }
.currency { font-size: 28rpx; color: #ff4d4f; font-weight: 600; }
.price { font-size: 60rpx; color: #ff4d4f; font-weight: 700; }
.price-original { font-size: 26rpx; color: $zb-text-tertiary; text-decoration: line-through; }
.price-tag { padding: 4rpx 14rpx; background: #fff1f0; color: #ff4d4f; font-size: 20rpx; border-radius: 8rpx; }
.product-name { display: block; margin-top: 16rpx; font-size: 34rpx; font-weight: 700; color: $zb-text-primary; line-height: 1.4; }
.meta-row { display: flex; align-items: center; justify-content: space-between; margin-top: 16rpx; }
.meta-spec { font-size: 24rpx; color: $zb-text-secondary; }
.meta-sold { font-size: 22rpx; color: $zb-text-tertiary; }

.card { margin-top: 20rpx; background: #fff; padding: 28rpx 32rpx; }
.card-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; margin-bottom: 20rpx; }
.desc { display: block; font-size: 26rpx; color: $zb-text-secondary; line-height: 1.8; }
.feature-list { display: flex; flex-direction: column; gap: 16rpx; margin-top: 20rpx; }
.feature { display: flex; align-items: center; gap: 12rpx; }
.feature-icon { font-size: 30rpx; color: $zb-primary; }
.feature-text { font-size: 26rpx; color: $zb-text-regular; }

.service-card { display: flex; flex-wrap: wrap; gap: 20rpx 32rpx; }
.service-item { display: flex; align-items: center; gap: 8rpx; font-size: 24rpx; color: $zb-success; }
.service-icon { font-size: 28rpx; }

.bottom-space { height: 40rpx; }

.detail-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 32rpx calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(26, 26, 46, 0.08);
}
.cart-action {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20rpx 0 4rpx;
  color: $zb-text-secondary;
  flex-shrink: 0;
}
.cart-icon { font-size: 40rpx; }
.cart-text { font-size: 20rpx; color: $zb-text-tertiary; margin-top: 2rpx; }
.cart-badge {
  position: absolute;
  top: -8rpx;
  right: 12rpx;
  min-width: 28rpx;
  height: 28rpx;
  line-height: 28rpx;
  padding: 0 6rpx;
  border-radius: 14rpx;
  background: #ff4d4f;
  color: #fff;
  font-size: 18rpx;
  text-align: center;
}
.btn-cart {
  flex: 1;
  padding: 22rpx 0;
  text-align: center;
  border-radius: 40rpx;
  background: #ffd666;
  color: $zb-text-primary;
  font-size: 26rpx;
  font-weight: 600;
}
.btn-buy {
  flex: 1;
  padding: 22rpx 0;
  text-align: center;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff4d4f 100%);
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
}
</style>

