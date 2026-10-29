<template>
  <view class="appointments-page">
    <scroll-view scroll-x class="filter-scroll" :show-scrollbar="false">
      <view class="filter-row">
        <view
          v-for="item in filters"
          :key="item"
          class="filter-chip"
          :class="{ active: activeFilter === item }"
          @click="activeFilter = item"
        >
          {{ item }}
        </view>
      </view>
    </scroll-view>

    <view v-if="rows.length" class="list">
      <view v-for="appt in rows" :key="appt.id" class="appt-card">
        <view class="card-head">
          <view class="head-left">
            <text class="expert-name">{{ appt.expertName }}</text>
            <text class="role-tag">{{ appt.expertRole }}</text>
          </view>
          <text class="status-badge" :class="appt.status">{{ statusText(appt.status) }}</text>
        </view>

        <view class="card-line">
          <zb-icon name="message" />
          <text class="line-text">{{ appt.typeName }}</text>
        </view>
        <view class="card-line">
          <zb-icon name="calendar" />
          <text class="line-text">{{ appt.dateLabel }} {{ appt.time }}</text>
        </view>

        <view class="card-foot">
          <view class="amount">
            <text class="amount-cap">金额</text>
            <text class="amount-value"><text class="currency">¥</text>{{ appt.price }}</text>
          </view>
          <text v-if="appt.status === 'ready'" class="countdown">
            咨询窗口剩余 {{ remainMinutes(appt) }} 分钟
          </text>
        </view>

        <view class="card-actions">
          <template v-if="appt.status === 'pending'">
            <text class="hint">支付后预约正式生效</text>
            <view class="btn primary" @click="goPay(appt)">去支付</view>
          </template>

          <template v-else-if="appt.status === 'upcoming'">
            <text class="hint">预约时间未到，暂不可咨询</text>
            <view class="btn ghost" @click="viewDetail">查看详情</view>
          </template>

          <template v-else-if="appt.status === 'ready'">
            <text class="hint">专家已在线，可立即进入</text>
            <view class="btn primary" @click="enterConsult(appt)">进入咨询</view>
          </template>

          <template v-else>
            <text class="hint">本次咨询已结束</text>
            <view class="btn disabled">已完成</view>
            <view class="btn ghost" @click="bookAgain(appt)">再次预约</view>
          </template>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <view class="empty-icon">
        <zb-icon name="calendar" />
      </view>
      <text class="empty-title">暂无预约</text>
      <text class="empty-desc">选一位适合您的专家，开始健康咨询</text>
      <view class="empty-btn" @click="goService">去预约专家</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow, onHide, onUnload } from '@dcloudio/uni-app';
import { sortedAppointments, appointmentStatus, statusText, payAppointment, type Appointment } from '@/utils/expert-store';

const filters = ['全部', '待支付', '待开始', '可咨询', '已完成'];
const activeFilter = ref('全部');
const nowTs = ref(Date.now());
let ticker: any = null;

const allRows = computed(() => {
  void nowTs.value;
  return sortedAppointments().map((appt) => ({ ...appt, status: appointmentStatus(appt) }));
});

const rows = computed(() => {
  if (activeFilter.value === '全部') return allRows.value;
  return allRows.value.filter((appt) => statusText(appt.status) === activeFilter.value);
});

const stopTicker = () => {
  if (ticker) {
    clearInterval(ticker);
    ticker = null;
  }
};

const startTicker = () => {
  stopTicker();
  ticker = setInterval(() => {
    nowTs.value = Date.now();
  }, 1000);
};

const remainMinutes = (appt: Appointment) => {
  const left = appt.startAt + 60 * 60 * 1000 - nowTs.value;
  return Math.max(0, Math.ceil(left / 60000));
};

const goPay = (appt: Appointment) => {
  payAppointment(appt.id);
  nowTs.value = Date.now();
  uni.showToast({ title: '支付成功', icon: 'success' });
};

const viewDetail = () => {
  uni.showToast({ title: '预约详情开发中', icon: 'none' });
};

const enterConsult = (appt: Appointment) => {
  uni.navigateTo({ url: '/modules/expert/consult?id=' + appt.id });
};

const bookAgain = (appt: Appointment) => {
  uni.navigateTo({ url: '/modules/expert/detail?id=' + appt.expertId });
};

const goService = () => {
  uni.switchTab({ url: '/pages/service/index' });
};

onShow(() => {
  nowTs.value = Date.now();
  startTicker();
});

onHide(() => stopTicker());

onUnload(() => stopTicker());
</script>

<style lang="scss" scoped>
.appointments-page {
  min-height: 100%;
  background: $zb-bg-page;
  padding: 24rpx 32rpx 60rpx;
}

.filter-scroll {
  width: 100%;
  white-space: nowrap;
}

.filter-row {
  display: inline-flex;
  gap: 16rpx;
  padding-bottom: 4rpx;
}

.filter-chip {
  padding: 12rpx 28rpx;
  border-radius: 32rpx;
  background: #fff;
  color: $zb-text-secondary;
  font-size: 24rpx;
  box-shadow: $zb-shadow-sm;
}

.filter-chip.active {
  background: $zb-primary-light;
  color: $zb-primary;
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 24rpx;
}

.appt-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: $zb-shadow-sm;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-width: 0;
}

.expert-name {
  font-size: 32rpx;
  font-weight: 700;
  color: $zb-text-primary;
}

.role-tag {
  font-size: 20rpx;
  color: $zb-primary;
  background: $zb-primary-light;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.status-badge {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.status-badge.pending {
  color: #fa8c16;
  background: #fff7e6;
}

.status-badge.upcoming {
  color: #1677ff;
  background: #e6f4ff;
}

.status-badge.ready {
  color: $zb-success;
  background: #f6ffed;
}

.status-badge.done {
  color: $zb-text-tertiary;
  background: $zb-bg-grey;
}

.card-line {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: $zb-text-secondary;
}

.line-text {
  flex: 1;
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-top: 18rpx;
}

.amount {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.amount-cap {
  font-size: 22rpx;
  color: $zb-text-tertiary;
}

.amount-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #ff6b35;
}

.currency {
  font-size: 22rpx;
}

.countdown {
  font-size: 22rpx;
  color: $zb-success;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16rpx;
  margin-top: 24rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid $zb-border-light;
  flex-wrap: wrap;
}

.hint {
  flex: 1;
  font-size: 22rpx;
  color: $zb-text-tertiary;
}

.btn {
  padding: 14rpx 36rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  font-weight: 500;
}

.btn.primary {
  background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%));
  color: #fff;
}

.btn.ghost {
  border: 1rpx solid $zb-primary;
  color: $zb-primary;
  background: #fff;
}

.btn.disabled {
  background: $zb-bg-grey;
  color: $zb-text-tertiary;
}

.empty {
  padding: 140rpx 0 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.empty-icon {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  color: $zb-text-tertiary;
  margin-bottom: 8rpx;
  box-shadow: $zb-shadow-sm;
}

.empty-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $zb-text-primary;
}

.empty-desc {
  font-size: 24rpx;
  color: $zb-text-tertiary;
}

.empty-btn {
  margin-top: 24rpx;
  padding: 18rpx 56rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%));
  color: #fff;
  font-size: 26rpx;
}
</style>
