<template>
  <view class="booking-page">
    <view class="card">
      <view class="expert-row">
        <view class="avatar" :style="{ backgroundColor: expert.avatarBg }">
          <zb-icon name="user" />
        </view>
        <view class="expert-info">
          <view class="name-line">
            <text class="expert-name">{{ expert.name }}</text>
            <text class="role-tag">{{ expert.role }}</text>
          </view>
          <text class="expert-title">{{ expert.title }}</text>
        </view>
      </view>

      <view class="divider"></view>

      <view class="info-row">
        <text class="info-label">咨询方式</text>
        <text class="info-value">{{ typeName }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">预约时间</text>
        <text class="info-value">{{ dateLabel }} {{ time }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">支付金额</text>
        <text class="amount-value"><text class="currency">¥</text>{{ amount }}</text>
      </view>
    </view>

    <view class="card">
      <text class="card-title">支付方式</text>
      <view class="pay-list">
        <view class="pay-item" :class="{ active: payType === 'wechat' }" @click="payType = 'wechat'">
          <view class="pay-left">
            <view class="pay-icon wechat">
              <zb-icon name="wallet" />
            </view>
            <text class="pay-name">微信支付</text>
          </view>
          <view class="radio" :class="{ checked: payType === 'wechat' }">
            <zb-icon v-if="payType === 'wechat'" name="check" />
          </view>
        </view>

        <view class="pay-item" :class="{ active: payType === 'alipay' }" @click="payType = 'alipay'">
          <view class="pay-left">
            <view class="pay-icon alipay">
              <zb-icon name="banknote" />
            </view>
            <text class="pay-name">支付宝</text>
          </view>
          <view class="radio" :class="{ checked: payType === 'alipay' }">
            <zb-icon v-if="payType === 'alipay'" name="check" />
          </view>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">预约须知</text>
      <view v-for="(notice, index) in notices" :key="index" class="notice-item">
        <text class="notice-dot"></text>
        <text class="notice-text">{{ notice }}</text>
      </view>
    </view>

    <view class="bottom-space"></view>

    <view class="booking-bottom">
      <view class="bottom-amount">
        <text class="bottom-label">支付金额</text>
        <view class="bottom-price">
          <text class="currency">¥</text>
          <text class="price-num">{{ amount }}</text>
        </view>
      </view>
      <view class="pay-btn" @click="onPay">立即支付 ¥{{ amount }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { experts, getExpert, type ConsultKey, type Expert } from '@/data/experts';
import { createAppointment, payAppointment } from '@/utils/expert-store';

const typeNames: Record<ConsultKey, string> = {
  text: '图文咨询',
  phone: '电话咨询',
  video: '视频咨询'
};

const notices = [
  '预约支付成功后不可退款，请确认预约时间后再支付。',
  '请在预约时间到达后进入咨询，超过 1 小时未进入将自动结束。'
];

const decodeParam = (value: any) => {
  const raw = value == null ? '' : String(value);
  try {
    return decodeURIComponent(raw);
  } catch (e) {
    return raw;
  }
};

const expert = ref<Expert>(experts[0]);
const expertId = ref(experts[0].id);
const type = ref<ConsultKey>('text');
const dateLabel = ref('立即开始');
const time = ref('立即');
const startAt = ref(Date.now());
const priceParam = ref(0);
const payType = ref<'wechat' | 'alipay'>('wechat');
const paying = ref(false);

const typeName = computed(() => typeNames[type.value]);

const consultPrice = computed(() => {
  const consult = expert.value.consultTypes.find((item) => item.key === type.value);
  return consult ? consult.price : expert.value.consultTypes[0].price;
});

const amount = computed(() => priceParam.value || consultPrice.value);

const onPay = () => {
  if (paying.value) return;

  const appt = createAppointment({
    expertId: expertId.value,
    type: type.value,
    dateLabel: dateLabel.value || '立即开始',
    time: time.value || '立即',
    startAt: startAt.value || Date.now()
  });

  if (!appt) {
    uni.showToast({ title: '预约信息有误', icon: 'none' });
    return;
  }

  paying.value = true;
  uni.showLoading({ title: '支付中...', mask: true });

  setTimeout(() => {
    uni.hideLoading();
    payAppointment(appt.id);
    uni.showToast({ title: '预约成功', icon: 'success' });
    setTimeout(() => {
      paying.value = false;
      uni.redirectTo({ url: '/modules/expert/appointments' });
    }, 600);
  }, 900);
};

onLoad((query: any) => {
  const found = getExpert(Number(query?.expertId)) || experts[0];
  expert.value = found;
  expertId.value = found.id;

  const rawType = String(query?.type || 'text') as ConsultKey;
  type.value = rawType === 'phone' || rawType === 'video' || rawType === 'text' ? rawType : 'text';

  dateLabel.value = decodeParam(query?.dateLabel) || '立即开始';
  time.value = decodeParam(query?.time) || '立即';

  const start = Number(query?.startAt);
  startAt.value = Number.isFinite(start) && start > 0 ? start : Date.now();

  const price = Number(query?.price);
  priceParam.value = Number.isFinite(price) && price > 0 ? price : 0;
});
</script>

<style lang="scss" scoped>
.booking-page {
  min-height: 100%;
  background: $zb-bg-page;
  padding: 24rpx 32rpx 180rpx;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: $zb-shadow-sm;
}

.card + .card {
  margin-top: 24rpx;
}

.card-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $zb-text-primary;
  margin-bottom: 20rpx;
}

.expert-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52rpx;
  color: $zb-primary;
  flex-shrink: 0;
}

.expert-info {
  flex: 1;
  min-width: 0;
}

.name-line {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.expert-name {
  font-size: 32rpx;
  font-weight: 700;
  color: $zb-text-primary;
}

.role-tag {
  font-size: 22rpx;
  color: $zb-primary;
  background: $zb-primary-light;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.expert-title {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: $zb-text-tertiary;
}

.divider {
  height: 1rpx;
  background: $zb-border-light;
  margin: 24rpx 0 8rpx;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 14rpx 0;
}

.info-label {
  font-size: 26rpx;
  color: $zb-text-secondary;
  flex-shrink: 0;
}

.info-value {
  font-size: 26rpx;
  color: $zb-text-primary;
  text-align: right;
}

.amount-value {
  font-size: 34rpx;
  font-weight: 700;
  color: #ff6b35;
}

.currency {
  font-size: 24rpx;
}

.pay-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.pay-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  border: 2rpx solid $zb-border-light;
  border-radius: 16rpx;
  background: $zb-bg-page;
}

.pay-item.active {
  border-color: $zb-primary;
  background: $zb-primary-light;
}

.pay-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.pay-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
}

.pay-icon.wechat {
  background: #e8f8ee;
  color: #22a35a;
}

.pay-icon.alipay {
  background: #e6f4ff;
  color: #1677ff;
}

.pay-name {
  font-size: 26rpx;
  color: $zb-text-primary;
}

.radio {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid $zb-border-dark;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  color: #fff;
}

.radio.checked {
  border-color: $zb-primary;
  background: $zb-primary;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 14rpx;
}

.notice-item:last-child {
  margin-bottom: 0;
}

.notice-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: $zb-primary;
  margin-top: 12rpx;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
  font-size: 24rpx;
  line-height: 1.65;
  color: $zb-text-secondary;
}

.bottom-space {
  height: 180rpx;
}

.booking-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.bottom-amount {
  flex: 1;
}

.bottom-label {
  display: block;
  font-size: 22rpx;
  color: $zb-text-tertiary;
}

.bottom-price {
  display: flex;
  align-items: baseline;
  gap: 2rpx;
}

.price-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #ff6b35;
}

.pay-btn {
  padding: 22rpx 44rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%));
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  flex-shrink: 0;
}
</style>
