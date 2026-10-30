<template>
  <view class="service-page">
    <view class="top-bar">
      <view class="tabs">
        <view class="tab" :class="{ active: activeTab === 'service' }" @click="switchTab('service')">
          <text>服务</text>
        </view>
        <view class="tab" :class="{ active: activeTab === 'doctor' }" @click="switchTab('doctor')">
          <text>专家列表</text>
        </view>
      </view>
      <scroll-view scroll-x class="filters" :show-scrollbar="false">
        <view class="filter-row">
          <view
            v-for="f in currentFilters"
            :key="f"
            class="filter-chip"
            :class="{ active: filter === f }"
            @click="filter = f"
          >
            {{ f }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 服务 -->
    <view v-if="activeTab === 'service'" class="list">
      <view v-for="s in filteredServices" :key="s.id" class="svc-card" @click="openService(s)">
        <view class="svc-icon"><zb-icon :name="s.icon" color="#2ec4b6" /></view>
        <view class="svc-info">
          <text class="svc-name">{{ s.name }}</text>
          <text class="svc-desc">{{ s.desc }}</text>
          <view class="svc-meta">
            <text class="svc-price">{{ s.price }}</text>
            <text class="svc-duration">{{ s.duration }}</text>
          </view>
        </view>
        <view class="svc-btn">预约</view>
      </view>
      <view v-if="!filteredServices.length" class="empty">暂无相关服务</view>
    </view>

    <!-- 专家列表 -->
    <view v-else class="list">
      <view class="appt-entry" @click="goAppointments">
        <view class="appt-left">
          <zb-icon name="calendar" color="#2ec4b6" />
          <text>我的预约</text>
        </view>
        <view class="appt-right">
          <text>查看预约记录与咨询</text>
          <zb-icon name="chevronRight" color="#c0c4cc" />
        </view>
      </view>

      <view v-for="d in filteredDoctors" :key="d.id" class="doc-card" @click="goExpert(d.id)">
        <view class="doc-avatar" :style="{ background: d.avatarBg }"><zb-icon name="user" color="#2ec4b6" /></view>
        <view class="doc-info">
          <view class="doc-row">
            <text class="doc-name">{{ d.name }}</text>
            <text class="doc-role">{{ d.role }}</text>
          </view>
          <text class="doc-title">{{ d.title }} · {{ d.years }} 年经验</text>
          <view class="doc-tags">
            <text v-for="t in d.tags" :key="t" class="doc-tag">{{ t }}</text>
          </view>
        </view>
        <view class="doc-btn">预约</view>
      </view>
      <view v-if="!filteredDoctors.length" class="empty">暂无相关专家</view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { experts } from '@/data/experts';

// 商城页会隐藏系统 TabBar，切回本页时确保恢复显示
onShow(() => {
  uni.showTabBar({ animation: false });
});

const activeTab = ref<'service' | 'doctor'>('service');
const filter = ref('全部');

const serviceFilters = ['全部', '门店服务', '心理咨询', '营养指导', '健康体检'];
const doctorFilters = ['全部', '心理咨询师', '健康管理师', '营养师'];

const currentFilters = computed(() => (activeTab.value === 'service' ? serviceFilters : doctorFilters));

const services = [
  { id: 1, name: '专家咨询', desc: '图文 / 电话 / 视频一对一咨询', price: '¥89 起', duration: '30 分钟 / 次', type: '心理咨询', icon: 'chat', action: 'expert' },
  { id: 2, name: '门店服务', desc: '到店针灸 / 推拿 / 艾灸 / 理疗', price: '¥88 起', duration: '约 40 分钟', type: '门店服务', icon: 'hospital', path: '/modules/store/index' },
  { id: 3, name: '营养膳食方案', desc: '定制一周食谱与营养建议', price: '¥299', duration: '7 天方案', type: '营养指导', icon: 'salad', path: '' },
  { id: 5, name: '全面体检套餐', desc: '含核磁 / CT / 肿瘤筛查', price: '¥1680', duration: '约 3 小时', type: '健康体检', icon: 'stethoscope', path: '' },
  { id: 6, name: '中医理疗套餐', desc: '推拿 + 艾灸 + 拔罐', price: '¥580', duration: '约 90 分钟', type: '门店服务', icon: 'leaf', path: '/modules/store/detail?id=1' }
];

const filteredServices = computed(() =>
  filter.value === '全部' ? services : services.filter((s) => s.type === filter.value)
);

const filteredDoctors = computed(() =>
  filter.value === '全部' ? experts : experts.filter((d) => d.role === filter.value)
);

const goExpert = (id: number) => {
  uni.navigateTo({ url: `/modules/expert/detail?id=${id}` });
};

const goAppointments = () => {
  uni.navigateTo({ url: '/modules/expert/appointments' });
};

const openService = (s: any) => {
  if (s.action === 'expert') {
    switchTab('doctor');
    return;
  }
  if (!s.path) {
    uni.showToast({ title: '服务详情即将上线', icon: 'none' });
    return;
  }
  uni.navigateTo({ url: s.path });
};

const switchTab = (tab: 'service' | 'doctor') => {
  activeTab.value = tab;
  filter.value = '全部';
};
</script>

<style lang="scss" scoped>
.service-page { min-height: 100%; background: $zb-bg-page; }

.top-bar { position: sticky; top: 0; z-index: 10; background: #fff; padding-top: 8rpx; box-shadow: 0 4rpx 16rpx rgba(26, 26, 46, 0.04); }

.tabs { display: flex; padding: 0 32rpx; }
.tab { flex: 1; text-align: center; padding: 24rpx 0 20rpx; font-size: 30rpx; color: $zb-text-secondary; position: relative; }
.tab.active { color: $zb-text-primary; font-weight: 700; }
.tab.active::after { content: ''; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 56rpx; height: 6rpx; border-radius: 6rpx; background: $zb-primary; }

.filters { white-space: nowrap; padding: 12rpx 0 20rpx; }
.filter-row { display: inline-flex; gap: 16rpx; padding: 0 32rpx; }
.filter-chip { padding: 10rpx 26rpx; border-radius: 28rpx; background: $zb-bg-grey; color: $zb-text-secondary; font-size: 24rpx; }
.filter-chip.active { background: $zb-primary-light; color: $zb-primary; font-weight: 600; }

.list { padding: 24rpx 32rpx 0; display: flex; flex-direction: column; gap: 20rpx; }

.svc-card { display: flex; align-items: center; gap: 20rpx; padding: 28rpx; background: #fff; border-radius: 24rpx; box-shadow: 0 4rpx 20rpx rgba(26, 26, 46, 0.05); }
.svc-icon { width: 88rpx; height: 88rpx; border-radius: 20rpx; background: $zb-primary-light; display: flex; align-items: center; justify-content: center; font-size: 44rpx; flex-shrink: 0; }
.svc-info { flex: 1; min-width: 0; }
.svc-name { display: block; font-size: 30rpx; font-weight: 600; color: $zb-text-primary; }
.svc-desc { display: block; font-size: 24rpx; color: $zb-text-tertiary; margin-top: 6rpx; }
.svc-meta { display: flex; align-items: baseline; gap: 16rpx; margin-top: 10rpx; }
.svc-price { font-size: 28rpx; font-weight: 700; color: #ff6b35; }
.svc-duration { font-size: 22rpx; color: $zb-text-tertiary; }
.svc-btn { padding: 12rpx 32rpx; border-radius: 28rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 24rpx; flex-shrink: 0; }

.appt-entry { display: flex; align-items: center; justify-content: space-between; padding: 24rpx 28rpx; background: #fff; border-radius: 24rpx; box-shadow: 0 4rpx 20rpx rgba(26, 26, 46, 0.05); }
.appt-left { display: flex; align-items: center; gap: 12rpx; font-size: 26rpx; font-weight: 600; color: $zb-text-primary; }
.appt-left .zb-icon, .appt-left text { font-size: 30rpx; }
.appt-right { display: flex; align-items: center; gap: 6rpx; font-size: 22rpx; color: $zb-text-tertiary; }

.doc-card { display: flex; align-items: center; gap: 20rpx; padding: 28rpx; background: #fff; border-radius: 24rpx; box-shadow: 0 4rpx 20rpx rgba(26, 26, 46, 0.05); }
.doc-avatar { width: 96rpx; height: 96rpx; border-radius: 50%; background: $zb-primary-light; display: flex; align-items: center; justify-content: center; font-size: 48rpx; flex-shrink: 0; }
.doc-info { flex: 1; min-width: 0; }
.doc-row { display: flex; align-items: center; gap: 12rpx; }
.doc-name { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; }
.doc-role { font-size: 22rpx; color: $zb-primary; background: $zb-primary-light; padding: 4rpx 12rpx; border-radius: 8rpx; }
.doc-title { display: block; font-size: 22rpx; color: $zb-text-tertiary; margin-top: 8rpx; }
.doc-tags { display: flex; flex-wrap: wrap; gap: 8rpx; margin-top: 12rpx; }
.doc-tag { font-size: 20rpx; color: $zb-text-secondary; background: $zb-bg-grey; padding: 4rpx 12rpx; border-radius: 8rpx; }
.doc-btn { padding: 12rpx 28rpx; border-radius: 28rpx; border: 1rpx solid $zb-primary; color: $zb-primary; font-size: 24rpx; flex-shrink: 0; }

.empty { padding: 120rpx 0; text-align: center; font-size: 26rpx; color: $zb-text-tertiary; }
.bottom-space { height: 120rpx; }
</style>
