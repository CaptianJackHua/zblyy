<template>
  <view class="shop-page" :class="{ 'cart-mode': mallUi.section === 'cart' }">
    <!-- 顶部 sticky 头部 -->
    <view class="shop-header">
      <view class="back-btn" @click="goHome">
        <zb-icon name="chevronLeft" />
      </view>
      <view class="search-box" @click="goSearch">
        <zb-icon name="search" class="search-icon" />
        <text class="search-placeholder">搜索商品</text>
      </view>
    </view>

    <!-- 商城板块 -->
    <view v-if="mallUi.section === 'mall'" class="section-mall">
      <scroll-view scroll-x class="category-bar" :show-scrollbar="false">
        <view class="category-list">
          <view
            v-for="cat in mallCategories"
            :key="cat"
            class="category-chip"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </view>
        </view>
      </scroll-view>

      <view class="mall-banner">
        <view class="banner-text">
          <text class="banner-title">中兵严选</text>
          <text class="banner-sub">正品保障 · 极速发货</text>
        </view>
        <view class="banner-deco"><zb-icon name="shoppingBag" /></view>
      </view>

      <view v-if="filteredProducts.length" class="product-grid">
        <view
          v-for="item in filteredProducts"
          :key="item.id"
          class="product-card"
          @click="goDetail(item.id)"
        >
          <view class="product-image" :style="{ backgroundImage: `url(${item.image})` }">
            <view v-if="item.tag" class="product-tag">{{ item.tag }}</view>
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-spec">{{ item.spec }}</text>
            <text class="product-sold">已售 {{ item.sold }}</text>
            <view class="product-bottom">
              <view class="product-price">
                <text class="currency">¥</text>
                <text class="price">{{ item.price }}</text>
                <text class="original">¥{{ item.originalPrice }}</text>
              </view>
              <view class="add-btn" @click.stop="onAddCart(item)">
                <zb-icon name="plus" />
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <view class="empty-icon"><zb-icon name="shoppingBag" /></view>
        <text class="empty-text">该分类暂无商品</text>
      </view>
    </view>

    <!-- 购物车板块 -->
    <view v-if="mallUi.section === 'cart'" class="section-cart">
      <view v-if="mallState.cart.length" class="cart-list">
        <view v-for="item in mallState.cart" :key="item.id" class="cart-item">
          <view class="select-dot" :class="{ active: item.selected }" @click="toggleCartItem(item.id)">
            <zb-icon v-if="item.selected" name="check" />
          </view>
          <view class="cart-image" :style="{ backgroundImage: `url(${item.image})` }"></view>
          <view class="cart-info">
            <text class="cart-name">{{ item.name }}</text>
            <text class="cart-spec">{{ item.spec }}</text>
            <view class="cart-row">
              <text class="cart-price">¥{{ item.price }}</text>
              <view class="stepper">
                <view class="step-btn" @click="onMinus(item.id, item.qty)">
                  <zb-icon name="minus" />
                </view>
                <text class="step-value">{{ item.qty }}</text>
                <view class="step-btn" @click="setCartQty(item.id, item.qty + 1)">
                  <zb-icon name="plus" />
                </view>
              </view>
            </view>
          </view>
          <view class="cart-delete" @click="onDelete(item.id)">
            <zb-icon name="trash" />
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <view class="empty-icon"><zb-icon name="shoppingBag" /></view>
        <text class="empty-text">购物车空空如也</text>
        <view class="empty-btn" @click="mallUi.section = 'mall'">去逛逛</view>
      </view>
    </view>

    <!-- 我的板块 -->
    <view v-if="mallUi.section === 'mine'" class="section-mine">
      <view class="mine-head">
        <text class="mine-title">我的订单</text>
      </view>
      <scroll-view scroll-x class="status-bar" :show-scrollbar="false">
        <view class="status-list">
          <view
            v-for="s in statusChips"
            :key="s.key"
            class="status-chip"
            :class="{ active: activeStatus === s.key }"
            @click="activeStatus = s.key"
          >
            {{ s.label }}
          </view>
        </view>
      </scroll-view>

      <view v-if="filteredOrders.length" class="order-list">
        <view v-for="order in filteredOrders" :key="order.id" class="order-card" @click="goOrder(order.id)">
          <view class="order-head">
            <text class="order-no">订单号 {{ order.no }}</text>
            <text class="order-status" :class="'st-' + order.status">{{ orderStatusText(order.status) }}</text>
          </view>
          <view class="order-body">
            <view class="order-thumbs">
              <view
                v-for="(it, idx) in order.items.slice(0, 3)"
                :key="idx"
                class="thumb"
                :style="{ backgroundImage: `url(${it.image})` }"
              ></view>
            </view>
            <view class="order-summary">
              <text class="order-count">共 {{ totalQty(order) }} 件</text>
              <text class="order-total">¥{{ order.total }}</text>
            </view>
          </view>
          <view class="order-foot">
            <text class="order-time">{{ formatTime(order.createdAt) }}</text>
            <view
              v-if="order.status === 'pending'"
              class="order-btn primary"
              @click.stop="onPayOrder(order)"
            >
              去支付
            </view>
            <view
              v-else-if="order.status === 'shipped'"
              class="order-btn primary"
              @click.stop="onReceive(order)"
            >
              确认收货
            </view>
            <view v-else class="order-btn" @click.stop="goOrder(order.id)">查看详情</view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <view class="empty-icon"><zb-icon name="receipt" /></view>
        <text class="empty-text">暂无订单</text>
      </view>

      <view class="info-card">
        <view class="info-title">我的信息</view>
        <view class="info-row" @click="onTodo">
          <zb-icon name="mapPin" class="info-icon" />
          <text class="info-label">收货地址</text>
          <zb-icon name="chevronRight" class="info-arrow" />
        </view>
        <view class="info-row" @click="goCoupons">
          <zb-icon name="gift" class="info-icon" />
          <text class="info-label">优惠券</text>
          <zb-icon name="chevronRight" class="info-arrow" />
        </view>
        <view class="info-row" @click="onTodo">
          <zb-icon name="star" class="info-icon" />
          <text class="info-label">我的收藏</text>
          <zb-icon name="chevronRight" class="info-arrow" />
        </view>
      </view>
    </view>

    <!-- 底部自定义栏 -->
    <view class="bottom-bar">
      <view v-if="mallUi.section === 'cart' && mallState.cart.length" class="settle-row">
        <view class="settle-all" @click="toggleAll">
          <view class="select-dot" :class="{ active: allSelected }">
            <zb-icon v-if="allSelected" name="check" />
          </view>
          <text class="settle-all-text">全选</text>
        </view>
        <view class="settle-total">
          <text class="settle-label">合计</text>
          <text class="settle-amount">¥{{ selectedTotal }}</text>
        </view>
        <view class="settle-btn" @click="goCheckout">结算({{ selectedCount }})</view>
      </view>
      <view class="nav-row">
        <view class="nav-item" :class="{ active: mallUi.section === 'mall' }" @click="mallUi.section = 'mall'">
          <zb-icon name="shoppingBag" class="nav-icon" />
          <text class="nav-text">商城</text>
        </view>
        <view class="nav-item" :class="{ active: mallUi.section === 'cart' }" @click="mallUi.section = 'cart'">
          <view class="nav-cart">
            <zb-icon name="cart" class="nav-icon" />
            <text v-if="cartNum > 0" class="nav-badge">{{ cartNum }}</text>
          </view>
          <text class="nav-text">购物车</text>
        </view>
        <view class="nav-item" :class="{ active: mallUi.section === 'mine' }" @click="mallUi.section = 'mine'">
          <zb-icon name="user" class="nav-icon" />
          <text class="nav-text">我的</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow, onHide } from '@dcloudio/uni-app';
import { mallCategories, products } from '@/data/mall';
import type { MallProduct } from '@/data/mall';
import type { MallOrder, OrderStatus } from '@/utils/mall-store';
import {
  mallState,
  mallUi,
  addToCart,
  removeFromCart,
  setCartQty,
  toggleCartItem,
  toggleAllCart,
  cartCount,
  selectedCartItems,
  selectedCartTotal,
  setCheckout,
  payOrder,
  finishOrder,
  orderStatusText
} from '@/utils/mall-store';

onShow(() => {
  uni.hideTabBar({ animation: false });
});
onHide(() => {
  uni.showTabBar({ animation: false });
});

const activeCategory = ref('全部');
const filteredProducts = computed(() =>
  activeCategory.value === '全部'
    ? products
    : products.filter((p) => p.category === activeCategory.value)
);

const statusChips: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'paid', label: '待发货' },
  { key: 'shipped', label: '待收货' },
  { key: 'done', label: '已完成' }
];
const activeStatus = ref<'all' | OrderStatus>('all');
const filteredOrders = computed(() =>
  activeStatus.value === 'all'
    ? mallState.orders
    : mallState.orders.filter((o) => o.status === activeStatus.value)
);

const cartNum = computed(() => cartCount());
const selectedTotal = computed(() => selectedCartTotal());
const selectedCount = computed(() => selectedCartItems().length);
const allSelected = computed(
  () => mallState.cart.length > 0 && mallState.cart.every((i) => i.selected)
);

const goHome = () => uni.switchTab({ url: '/pages/index/index' });
const goSearch = () => uni.navigateTo({ url: '/modules/search/index' });
const goDetail = (id: number) => uni.navigateTo({ url: `/modules/shop/detail?id=${id}` });

const onAddCart = (product: MallProduct) => {
  addToCart(product);
  uni.showToast({ title: '已加入购物车', icon: 'none' });
};

const onMinus = (id: number, qty: number) => {
  setCartQty(id, Math.max(1, qty - 1));
};

const onDelete = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这件商品吗？',
    success: (res) => {
      if (res.confirm) {
        removeFromCart(id);
        uni.showToast({ title: '已删除', icon: 'none' });
      }
    }
  });
};

const toggleAll = () => toggleAllCart(!allSelected.value);

const goCheckout = () => {
  const items = selectedCartItems();
  if (!items.length) {
    uni.showToast({ title: '请选择商品', icon: 'none' });
    return;
  }
  setCheckout(
    items.map((i) => ({
      id: i.id,
      name: i.name,
      spec: i.spec,
      price: i.price,
      image: i.image,
      qty: i.qty
    }))
  );
  uni.navigateTo({ url: '/modules/shop/checkout' });
};

const goOrder = (id: string) => uni.navigateTo({ url: `/modules/shop/order-detail?id=${id}` });
const goCoupons = () => uni.navigateTo({ url: '/modules/shop/coupons' });

const onPayOrder = (order: MallOrder) => {
  uni.showModal({
    title: '模拟支付',
    content: `确认支付 ¥${order.total}？`,
    success: (res) => {
      if (res.confirm) {
        payOrder(order.id);
        uni.showToast({ title: '支付成功', icon: 'none' });
      }
    }
  });
};

const onReceive = (order: MallOrder) => {
  finishOrder(order.id);
  uni.showToast({ title: '已确认收货', icon: 'none' });
};

const totalQty = (order: MallOrder) => order.items.reduce((sum, i) => sum + i.qty, 0);

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};

const onTodo = () => uni.showToast({ title: '功能开发中', icon: 'none' });
</script>

<style lang="scss" scoped>
.shop-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 200rpx; }
.shop-page.cart-mode { padding-bottom: 320rpx; }

/* 顶部头部 */
.shop-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 32rpx;
  background: #fff;
  box-shadow: $zb-shadow-sm;
}
.back-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: $zb-text-primary;
  flex-shrink: 0;
}
.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 14rpx 24rpx;
  background: $zb-bg-grey;
  border-radius: 32rpx;
}
.search-icon { font-size: 30rpx; color: $zb-text-tertiary; }
.search-placeholder { font-size: 26rpx; color: $zb-text-tertiary; }

/* 商城板块 */
.category-bar { background: #fff; white-space: nowrap; }
.category-list { display: inline-flex; gap: 16rpx; padding: 8rpx 32rpx 20rpx; }
.category-chip {
  padding: 10rpx 28rpx;
  border-radius: 28rpx;
  background: $zb-bg-grey;
  color: $zb-text-secondary;
  font-size: 24rpx;
}
.category-chip.active { background: $zb-primary-light; color: $zb-primary; font-weight: 600; }

.mall-banner {
  margin: 24rpx 32rpx;
  padding: 36rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #2ec4b6 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.banner-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.banner-sub { display: block; font-size: 24rpx; color: rgba(255, 255, 255, 0.85); margin-top: 8rpx; }
.banner-deco { font-size: 80rpx; color: rgba(255, 255, 255, 0.22); }

.product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20rpx; padding: 0 32rpx; }
.product-card { background: #fff; border-radius: 24rpx; overflow: hidden; box-shadow: $zb-shadow-sm; }
.product-image {
  width: 100%;
  height: 280rpx;
  background-size: cover;
  background-position: center;
  background-color: $zb-bg-grey;
  position: relative;
}
.product-tag {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  padding: 4rpx 14rpx;
  background: linear-gradient(90deg, #ff6b35, #ff4d4f);
  color: #fff;
  font-size: 20rpx;
  border-radius: 8rpx;
}
.product-info { padding: 16rpx 20rpx 20rpx; }
.product-name {
  display: block;
  font-size: 27rpx;
  font-weight: 600;
  color: $zb-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-spec { display: block; font-size: 22rpx; color: $zb-text-tertiary; margin-top: 6rpx; }
.product-sold { display: block; font-size: 20rpx; color: $zb-text-tertiary; margin-top: 8rpx; }
.product-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 12rpx; }
.product-price { display: flex; align-items: baseline; gap: 6rpx; min-width: 0; }
.currency { font-size: 20rpx; color: #ff4d4f; }
.price { font-size: 32rpx; color: #ff4d4f; font-weight: 700; }
.original { font-size: 20rpx; color: $zb-text-tertiary; text-decoration: line-through; }
.add-btn {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $zb-primary 0%, #4dcdc2 100%);
  color: #fff;
  font-size: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 购物车板块 */
.section-cart { padding: 24rpx 32rpx 0; }
.cart-list { display: flex; flex-direction: column; gap: 20rpx; }
.cart-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: $zb-shadow-sm;
}
.select-dot {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  border: 2rpx solid $zb-border-dark;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #fff;
  flex-shrink: 0;
}
.select-dot.active { background: $zb-primary; border-color: $zb-primary; }
.cart-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 16rpx;
  background-size: cover;
  background-position: center;
  background-color: $zb-bg-grey;
  flex-shrink: 0;
}
.cart-info { flex: 1; min-width: 0; }
.cart-name {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: $zb-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cart-spec { display: block; font-size: 22rpx; color: $zb-text-tertiary; margin-top: 6rpx; }
.cart-row { display: flex; align-items: center; justify-content: space-between; margin-top: 14rpx; gap: 12rpx; }
.cart-price { font-size: 28rpx; font-weight: 700; color: #ff4d4f; }
.stepper { display: flex; align-items: center; border: 1rpx solid $zb-border-light; border-radius: 8rpx; overflow: hidden; flex-shrink: 0; }
.step-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: $zb-text-secondary;
  background: $zb-bg-grey;
}
.step-value { min-width: 56rpx; text-align: center; font-size: 26rpx; color: $zb-text-primary; }
.cart-delete { font-size: 30rpx; color: $zb-text-tertiary; padding: 8rpx; flex-shrink: 0; }

/* 空态 */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0 60rpx; }
.empty-icon { font-size: 96rpx; color: $zb-border-dark; }
.empty-text { margin-top: 24rpx; font-size: 26rpx; color: $zb-text-tertiary; }
.empty-btn {
  margin-top: 32rpx;
  padding: 14rpx 60rpx;
  border-radius: 32rpx;
  background: $zb-primary;
  color: #fff;
  font-size: 26rpx;
}

/* 我的板块 */
.section-mine { padding: 24rpx 32rpx 0; }
.mine-head { display: flex; align-items: center; justify-content: space-between; }
.mine-title { font-size: 32rpx; font-weight: 700; color: $zb-text-primary; }
.status-bar { white-space: nowrap; margin-top: 20rpx; }
.status-list { display: inline-flex; gap: 16rpx; }
.status-chip {
  padding: 10rpx 28rpx;
  border-radius: 28rpx;
  background: #fff;
  color: $zb-text-secondary;
  font-size: 24rpx;
}
.status-chip.active { background: $zb-primary-light; color: $zb-primary; font-weight: 600; }

.order-list { display: flex; flex-direction: column; gap: 20rpx; margin-top: 20rpx; }
.order-card { padding: 24rpx; background: #fff; border-radius: 24rpx; box-shadow: $zb-shadow-sm; }
.order-head { display: flex; align-items: center; justify-content: space-between; }
.order-no { font-size: 22rpx; color: $zb-text-tertiary; }
.order-status { font-size: 24rpx; font-weight: 600; }
.st-pending { color: #ff6b35; }
.st-paid { color: $zb-primary; }
.st-shipped { color: #3b82f6; }
.st-done { color: $zb-text-tertiary; }
.order-body { display: flex; align-items: center; gap: 20rpx; margin-top: 20rpx; }
.order-thumbs { flex: 1; display: flex; gap: 10rpx; overflow: hidden; }
.thumb {
  width: 112rpx;
  height: 112rpx;
  border-radius: 12rpx;
  background-size: cover;
  background-position: center;
  background-color: $zb-bg-grey;
  flex-shrink: 0;
}
.order-summary { text-align: right; flex-shrink: 0; }
.order-count { display: block; font-size: 22rpx; color: $zb-text-tertiary; }
.order-total { display: block; font-size: 30rpx; font-weight: 700; color: $zb-text-primary; margin-top: 8rpx; }
.order-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid $zb-border-light;
}
.order-time { font-size: 22rpx; color: $zb-text-tertiary; }
.order-btn {
  padding: 10rpx 32rpx;
  border-radius: 30rpx;
  border: 1rpx solid $zb-border-dark;
  color: $zb-text-secondary;
  font-size: 24rpx;
}
.order-btn.primary { background: $zb-primary; border-color: $zb-primary; color: #fff; }

.info-card {
  margin-top: 24rpx;
  padding: 8rpx 24rpx 4rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: $zb-shadow-sm;
}
.info-title { padding: 20rpx 0 10rpx; font-size: 28rpx; font-weight: 700; color: $zb-text-primary; }
.info-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 26rpx 0;
  border-top: 1rpx solid $zb-border-light;
}
.info-icon { font-size: 34rpx; color: $zb-primary; }
.info-label { flex: 1; font-size: 26rpx; color: $zb-text-primary; }
.info-arrow { font-size: 28rpx; color: $zb-text-tertiary; }

/* 底部自定义栏 */
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(26, 26, 46, 0.08);
  padding-bottom: env(safe-area-inset-bottom);
}
.settle-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 18rpx 32rpx;
  border-bottom: 1rpx solid $zb-border-light;
}
.settle-all { display: flex; align-items: center; gap: 12rpx; flex-shrink: 0; }
.settle-all-text { font-size: 26rpx; color: $zb-text-secondary; }
.settle-total { flex: 1; text-align: right; }
.settle-label { font-size: 24rpx; color: $zb-text-secondary; }
.settle-amount { font-size: 32rpx; font-weight: 700; color: #ff4d4f; margin-left: 8rpx; }
.settle-btn {
  padding: 16rpx 44rpx;
  border-radius: 36rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff4d4f 100%);
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
  flex-shrink: 0;
}
.nav-row { display: flex; height: 104rpx; }
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: $zb-text-tertiary;
}
.nav-item.active { color: $zb-primary; }
.nav-icon { font-size: 40rpx; }
.nav-text { font-size: 22rpx; }
.nav-cart { position: relative; display: flex; }
.nav-badge {
  position: absolute;
  top: -10rpx;
  right: -18rpx;
  min-width: 30rpx;
  height: 30rpx;
  line-height: 30rpx;
  padding: 0 6rpx;
  border-radius: 15rpx;
  background: #ff4d4f;
  color: #fff;
  font-size: 18rpx;
  text-align: center;
}
</style>
