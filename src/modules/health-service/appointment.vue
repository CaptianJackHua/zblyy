<template>
  <view class="appointment-page">
    <view class="page-header">
      <text class="page-title">服务预约</text>
      <text class="page-desc">体检、理疗、上门服务一键预约</text>
    </view>

    <view class="section">
      <view class="service-types">
        <view 
          v-for="type in serviceTypes" 
          :key="type.id" 
          :class="['type-card', { active: activeType === type.id }]"
          @click="activeType = type.id"
        >
          <zb-icon class="type-icon" :name="type.icon" />
          <text class="type-name">{{ type.name }}</text>
          <text class="type-count">{{ type.count }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">选择服务</text>
      </view>
      <view class="service-list">
        <view v-for="s in services" :key="s.id" class="service-card">
          <view class="service-image" :style="{ backgroundImage: `url(${s.image})` }"></view>
          <view class="service-info">
            <text class="service-name">{{ s.name }}</text>
            <text class="service-desc">{{ s.desc }}</text>
            <view class="service-meta">
              <text class="service-duration"><zb-icon name="timer" /> {{ s.duration }}</text>
              <text class="service-location"><zb-icon name="mapPin" /> {{ s.location }}</text>
            </view>
            <view class="service-bottom">
              <view class="service-price">
                <text class="currency">¥</text>
                <text class="price">{{ s.price }}</text>
              </view>
              <view class="service-btn" @click="onBook(s)">立即预约</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">我的预约</text>
        <text class="section-more" @click="onMyAppointment">查看全部 <zb-icon name="chevronRight" /></text>
      </view>
      <view class="my-appointments" v-if="myAppointments.length">
        <view v-for="a in myAppointments" :key="a.id" class="appointment-mini">
          <view class="apt-icon"><zb-icon :name="a.icon" /></view>
          <view class="apt-info">
            <text class="apt-name">{{ a.name }}</text>
            <text class="apt-time"><zb-icon name="calendar" /> {{ a.time }}</text>
          </view>
          <text class="apt-status" :class="a.status">{{ a.statusText }}</text>
        </view>
      </view>
      <view v-else class="no-appointment">
        <text class="no-apt-text">暂无预约记录</text>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeType = ref(1);

const serviceTypes = [
  { id: 1, name: '体检套餐', icon: 'clipboard', count: 12 },
  { id: 2, name: '中医理疗', icon: 'leaf', count: 8 },
  { id: 3, name: '上门服务', icon: 'home', count: 5 },
  { id: 4, name: '专项检查', icon: 'microscope', count: 6 }
];

const services = [
  { id: 1, name: '全面体检套餐', desc: '含核磁/CT/肿瘤筛查等全面检查', duration: '约 4 小时', location: '全国门店', price: 1680, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400' },
  { id: 2, name: '中医理疗套餐', desc: '推拿 + 艾灸 + 拔罐组合', duration: '90 分钟', location: '全国门店', price: 580, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400' },
  { id: 3, name: '上门打针服务', desc: '专业护士上门，安全便捷', duration: '30 分钟', location: '北京/上海', price: 150, image: 'https://images.unsplash.com/photo-1559757148-6c3203a5bd3a?w=400' }
];

const myAppointments = [
  { id: 1, name: '全面体检套餐', time: '2026-11-05 09:00', status: 'pending', statusText: '待服务', icon: 'clipboard' },
  { id: 2, name: '中医理疗', time: '2026-11-08 14:00', status: 'confirmed', statusText: '已确认', icon: 'leaf' }
];

const onBook = (s: any) => {
  uni.showModal({
    title: '预约确认',
    content: `预约「${s.name}」，费用 ¥${s.price}`,
    success: (res) => {
      if (res.confirm) uni.showToast({ title: '预约成功！', icon: 'success' });
    }
  });
};
const onMyAppointment = () => uni.showToast({ title: '查看我的预约', icon: 'none' });
</script>

<style lang="scss" scoped>
.appointment-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-header { background: linear-gradient(135deg, #3b82f6 0%, #2ec4b6 100%); padding: 60rpx 32rpx 40rpx; text-align: center; }
.page-title { font-size: 40rpx; font-weight: 700; color: #fff; display: block; }
.page-desc { font-size: 24rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.section { margin: 24rpx 32rpx; background: #fff; border-radius: 16rpx; padding: 24rpx; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.section-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.section-more { font-size: 24rpx; color: $zb-text-tertiary; }

.service-types { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.type-card { display: flex; flex-direction: column; align-items: center; padding: 24rpx 8rpx; background: $zb-bg-grey; border-radius: 16rpx; border: 2rpx solid transparent; }
.type-card.active { background: $zb-primary-light; border-color: $zb-primary; }
.type-icon { font-size: 40rpx; margin-bottom: 8rpx; }
.type-name { font-size: 24rpx; font-weight: 500; color: $zb-text-primary; }
.type-count { font-size: 20rpx; color: $zb-text-tertiary; margin-top: 2rpx; }

.service-list { display: flex; flex-direction: column; gap: 20rpx; }
.service-card { display: flex; gap: 20rpx; padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.service-image { width: 180rpx; height: 180rpx; border-radius: 12rpx; background-size: cover; background-position: center; flex-shrink: 0; }
.service-info { flex: 1; display: flex; flex-direction: column; }
.service-name { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.service-desc { font-size: 24rpx; color: $zb-text-secondary; margin-top: 6rpx; }
.service-meta { display: flex; gap: 20rpx; margin-top: 12rpx; }
.service-meta text { font-size: 22rpx; color: $zb-text-tertiary; }
.service-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12rpx; }
.service-price .currency { font-size: 22rpx; color: #ff4d4f; }
.service-price .price { font-size: 36rpx; color: #ff4d4f; font-weight: 700; }
.service-btn { padding: 12rpx 28rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 24rpx; border-radius: 24rpx; }

.my-appointments { display: flex; flex-direction: column; gap: 12rpx; }
.appointment-mini { display: flex; align-items: center; gap: 16rpx; padding: 16rpx; background: $zb-bg-grey; border-radius: 12rpx; }
.apt-icon { font-size: 36rpx; width: 64rpx; height: 64rpx; background: #fff; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; }
.apt-info { flex: 1; }
.apt-name { font-size: 26rpx; font-weight: 500; color: $zb-text-primary; display: block; }
.apt-time { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; display: block; }
.apt-status { font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 6rpx; }
.apt-status.pending { color: $zb-warning; background: #fef3e2; }
.apt-status.confirmed { color: $zb-success; background: #e0f7f5; }
.no-appointment { padding: 24rpx; text-align: center; }
.no-apt-text { font-size: 26rpx; color: $zb-text-tertiary; }

.bottom-space { height: 40rpx; }
</style>
