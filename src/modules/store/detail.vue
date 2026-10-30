<template>
  <view v-if="store" class="store-detail">
    <view class="hero">
      <view class="hero-deco"><zb-icon name="hospital" /></view>
      <view class="hero-main">
        <view class="hero-name-row">
          <text class="hero-name">{{ store.name }}</text>
          <view v-if="store.tag" class="hero-tag">{{ store.tag }}</view>
        </view>
        <view class="hero-rate">
          <zb-icon name="star" color="#ff9f0a" />
          <text class="rate-num">{{ store.rating }}</text>
          <text class="hero-distance">距您 {{ store.distance }} km</text>
        </view>
      </view>
    </view>

    <view class="card info-card">
      <view class="info-row">
        <zb-icon name="mapPin" class="info-icon" />
        <text class="info-text">{{ store.address }}</text>
      </view>
      <view class="info-row">
        <zb-icon name="clock" class="info-icon" />
        <text class="info-text">营业时间 {{ store.hours }}</text>
      </view>
      <view class="info-row">
        <zb-icon name="phone" class="info-icon" />
        <text class="info-text">{{ store.tel }}</text>
      </view>
      <text class="store-intro">{{ store.intro }}</text>
    </view>

    <view class="section-title">门店服务</view>
    <view class="service-list">
      <view v-for="svc in store.services" :key="svc.id" class="service-card">
        <view class="svc-icon"><zb-icon :name="svc.icon" /></view>
        <view class="svc-info">
          <text class="svc-name">{{ svc.name }}</text>
          <text class="svc-desc">{{ svc.desc }}</text>
          <view class="svc-meta">
            <text class="svc-price">¥{{ svc.price }}</text>
            <text class="svc-duration">/ 次 · {{ svc.duration }}</text>
          </view>
        </view>
        <view class="svc-btn" @click="openPicker(svc)">预约</view>
      </view>
    </view>

    <view class="bottom-space"></view>

    <view class="bottom-bar">
      <view class="bar-btn" @click="onCall">
        <zb-icon name="phone" />
        <text>电话</text>
      </view>
      <view class="bar-btn" @click="onNavigate">
        <zb-icon name="mapPin" />
        <text>导航</text>
      </view>
      <view class="bar-main" @click="openPicker(store.services[0])">立即预约到店服务</view>
    </view>

    <!-- 预约弹层 -->
    <view v-if="picker.visible" class="mask" @click="picker.visible = false">
      <view class="picker" @click.stop>
        <view class="picker-head">
          <text class="picker-title">预约 {{ picker.service?.name }}</text>
          <zb-icon name="close" class="picker-close" @click="picker.visible = false" />
        </view>
        <text class="picker-sub">选择到店时间</text>
        <view class="date-row">
          <view
            v-for="d in dates"
            :key="d.key"
            class="date-chip"
            :class="{ active: picker.date === d.key }"
            @click="picker.date = d.key"
          >
            {{ d.label }}
          </view>
        </view>
        <scroll-view scroll-y class="time-scroll">
          <view class="time-grid">
            <view
              v-for="t in timeSlots"
              :key="t"
              class="time-chip"
              :class="{ active: picker.time === t }"
              @click="picker.time = t"
            >
              {{ t }}
            </view>
          </view>
        </scroll-view>
        <view class="picker-foot">
          <text class="picker-price">¥{{ picker.service?.price }}</text>
          <view class="picker-confirm" @click="confirmBooking">确认预约</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getStore, storeServices } from '@/data/stores';
import type { Store, StoreService } from '@/data/stores';

const store = ref<Store | undefined>();
const picker = reactive<{ visible: boolean; service?: StoreService; date: string; time: string }>({
  visible: false,
  service: undefined,
  date: 'today',
  time: ''
});

const dates = [
  { key: 'today', label: '今天' },
  { key: 'tomorrow', label: '明天' },
  { key: 'after', label: '后天' }
];

const timeSlots = ['10:00', '11:00', '13:30', '15:00', '16:30', '18:00', '19:30'];

onLoad((options: any) => {
  store.value = getStore(Number(options?.id || 1));
  const svcName = options?.service ? decodeURIComponent(options.service) : '';
  const matched = store.value?.services.find((s) => s.name === svcName);
  if (matched) openPicker(matched);
});

const openPicker = (svc?: StoreService) => {
  if (!svc) return;
  picker.service = svc || storeServices[0];
  picker.date = 'today';
  picker.time = timeSlots[0];
  picker.visible = true;
};

const dateLabel = () => dates.find((d) => d.key === picker.date)?.label || '今天';

const confirmBooking = () => {
  if (!picker.time) {
    uni.showToast({ title: '请选择到店时间', icon: 'none' });
    return;
  }
  picker.visible = false;
  uni.showModal({
    title: '预约成功',
    content: `${dateLabel()} ${picker.time} · ${picker.service?.name}，届时请准时到店`,
    showCancel: false,
    confirmText: '知道了'
  });
};

const onCall = () => {
  if (!store.value) return;
  uni.showModal({ title: '拨打电话', content: `确定拨打 ${store.value.tel} 吗？` });
};

const onNavigate = () => {
  if (!store.value) return;
  uni.showToast({ title: `导航到 ${store.value.name}`, icon: 'none' });
};
</script>

<style lang="scss" scoped>
.store-detail { min-height: 100%; background: $zb-bg-page; padding: 24rpx 32rpx 200rpx; }

.hero { position: relative; display: flex; align-items: center; padding: 36rpx; border-radius: 24rpx; background: linear-gradient(135deg, #e0f7f5 0%, #e8f4fd 100%); overflow: hidden; }
.hero-deco { position: absolute; right: 24rpx; bottom: 12rpx; font-size: 120rpx; color: rgba(46, 196, 182, 0.18); }
.hero-main { position: relative; z-index: 1; }
.hero-name-row { display: flex; align-items: center; gap: 10rpx; }
.hero-name { font-size: 32rpx; font-weight: 700; color: $zb-text-primary; }
.hero-tag { padding: 2rpx 10rpx; background: $zb-primary; color: #fff; font-size: 18rpx; border-radius: 6rpx; }
.hero-rate { display: flex; align-items: center; gap: 6rpx; margin-top: 12rpx; font-size: 22rpx; }
.rate-num { color: #ff9f0a; font-weight: 600; }
.hero-distance { color: $zb-text-tertiary; }

.card { margin-top: 20rpx; padding: 28rpx; background: #fff; border-radius: 24rpx; box-shadow: $zb-shadow-sm; }
.info-row { display: flex; align-items: flex-start; gap: 12rpx; margin-bottom: 14rpx; font-size: 24rpx; color: $zb-text-secondary; }
.info-icon { font-size: 28rpx; color: $zb-primary; }
.info-text { flex: 1; line-height: 1.5; }
.store-intro { display: block; margin-top: 6rpx; font-size: 24rpx; color: $zb-text-tertiary; line-height: 1.6; }

.section-title { margin: 32rpx 0 20rpx; font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }

.service-list { display: flex; flex-direction: column; gap: 20rpx; }
.service-card { display: flex; align-items: center; gap: 20rpx; padding: 24rpx; background: #fff; border-radius: 24rpx; box-shadow: $zb-shadow-sm; }
.svc-icon { width: 84rpx; height: 84rpx; border-radius: 20rpx; background: $zb-primary-light; color: $zb-primary; font-size: 40rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.svc-info { flex: 1; min-width: 0; }
.svc-name { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.svc-desc { display: block; margin-top: 6rpx; font-size: 22rpx; color: $zb-text-tertiary; }
.svc-meta { display: flex; align-items: baseline; gap: 8rpx; margin-top: 10rpx; }
.svc-price { font-size: 30rpx; font-weight: 700; color: #ff6b35; }
.svc-duration { font-size: 22rpx; color: $zb-text-tertiary; }
.svc-btn { padding: 12rpx 28rpx; border-radius: 28rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 24rpx; flex-shrink: 0; }

.bottom-space { height: 40rpx; }

.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 100; display: flex; align-items: center; gap: 16rpx; padding: 14rpx 32rpx calc(14rpx + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -4rpx 20rpx rgba(26, 26, 46, 0.08); }
.bar-btn { display: flex; flex-direction: column; align-items: center; gap: 2rpx; font-size: 22rpx; color: $zb-text-secondary; padding: 0 10rpx; }
.bar-btn .zb-icon { font-size: 34rpx; color: $zb-primary; }
.bar-main { flex: 1; height: 76rpx; display: flex; align-items: center; justify-content: center; border-radius: 38rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 28rpx; font-weight: 600; }

.mask { position: fixed; inset: 0; z-index: 200; background: rgba(0, 0, 0, 0.45); display: flex; align-items: flex-end; }
.picker { width: 100%; background: #fff; border-radius: 28rpx 28rpx 0 0; padding: 32rpx 32rpx calc(24rpx + env(safe-area-inset-bottom)); }
.picker-head { display: flex; align-items: center; justify-content: space-between; }
.picker-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }
.picker-close { font-size: 32rpx; color: $zb-text-tertiary; }
.picker-sub { display: block; margin: 24rpx 0 16rpx; font-size: 24rpx; color: $zb-text-tertiary; }
.date-row { display: flex; gap: 16rpx; }
.date-chip { flex: 1; text-align: center; padding: 16rpx 0; border-radius: 16rpx; background: $zb-bg-grey; font-size: 26rpx; color: $zb-text-secondary; }
.date-chip.active { background: $zb-primary-light; color: $zb-primary; font-weight: 600; }
.time-scroll { max-height: 300rpx; margin-top: 20rpx; }
.time-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14rpx; }
.time-chip { text-align: center; padding: 14rpx 0; border-radius: 14rpx; background: $zb-bg-grey; font-size: 24rpx; color: $zb-text-secondary; }
.time-chip.active { background: $zb-primary-light; color: $zb-primary; font-weight: 600; }
.picker-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 28rpx; }
.picker-price { font-size: 34rpx; font-weight: 700; color: #ff6b35; }
.picker-confirm { padding: 18rpx 56rpx; border-radius: 40rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 28rpx; font-weight: 600; }
</style>
