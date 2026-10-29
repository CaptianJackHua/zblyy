<template>
  <view class="detail-page">
    <view class="expert-card">
      <view class="avatar-wrap" :style="{ backgroundColor: expert.avatarBg }">
        <zb-icon name="user" />
      </view>
      <view class="expert-info">
        <view class="name-line">
          <text class="expert-name">{{ expert.name }}</text>
          <text class="role-tag">{{ expert.role }}</text>
        </view>
        <text class="expert-title">{{ expert.title }}</text>
        <view class="meta-line">
          <view class="meta-item">
            <zb-icon name="star" color="#faad14" />
            <text class="rating">{{ expert.rating }}</text>
          </view>
          <view class="meta-divider"></view>
          <view class="meta-item">
            <zb-icon name="medal" />
            <text>{{ expert.years }} 年从业</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">擅长领域</text>
      <view class="tag-list">
        <text v-for="tag in expert.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">专家简介</text>
      <text class="intro-text">{{ expert.intro }}</text>
    </view>

    <view class="section">
      <text class="section-title">选择咨询方式</text>
      <view class="consult-list">
        <view
          v-for="item in expert.consultTypes"
          :key="item.key"
          class="consult-card"
          :class="{ active: selectedType === item.key }"
          @click="selectType(item)"
        >
          <view class="consult-main">
            <view class="consult-left">
              <view class="consult-name-line">
                <text class="consult-name">{{ item.name }}</text>
                <view class="consult-duration">
                  <zb-icon name="clock" />
                  <text>{{ item.duration }}</text>
                </view>
              </view>
              <text class="consult-desc">{{ item.desc }}</text>
            </view>
            <view class="consult-right">
              <text class="consult-price"><text class="currency">¥</text>{{ item.price }}</text>
            </view>
          </view>
          <view v-if="selectedType === item.key" class="check-badge">
            <zb-icon name="check" />
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">选择时间</text>
      <scroll-view scroll-x class="date-scroll" :show-scrollbar="false">
        <view class="date-row">
          <view
            v-for="day in dateOptions"
            :key="day.offset"
            class="date-chip"
            :class="{ active: selectedOffset === day.offset && !selectedImmediate }"
            @click="selectDate(day)"
          >
            <text class="date-name">{{ day.name }}</text>
            <text class="date-mmdd">{{ day.short }}</text>
          </view>
        </view>
      </scroll-view>

      <view v-if="slots.length" class="slot-grid">
        <view
          v-for="slot in slots"
          :key="slot.startAt"
          class="slot"
          :class="{ active: !selectedImmediate && selectedSlot && selectedSlot.startAt === slot.startAt }"
          @click="selectSlot(slot)"
        >
          {{ slot.time }}
        </view>
      </view>
      <view v-else class="slot-empty">
        <zb-icon name="clock" />
        <text>今日已无可预约时段</text>
      </view>

      <view class="immediate-btn" :class="{ active: selectedImmediate }" @click="chooseImmediate">
        <zb-icon name="sparkles" />
        <text>立即开始</text>
      </view>

      <view v-if="selectedLabel" class="selected-tip">已选择：{{ selectedLabel }}</view>
    </view>

    <view class="bottom-space"></view>

    <view class="detail-bottom">
      <view class="bottom-price">
        <text class="price-cap">{{ currentConsult.name }} · {{ currentConsult.duration }}</text>
        <view class="price-value">
          <text class="currency">¥</text>
          <text class="price-num">{{ currentConsult.price }}</text>
        </view>
      </view>
      <view class="book-btn" @click="goBooking">立即预约</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { experts, getExpert, type ConsultKey, type ConsultType, type Expert } from '@/data/experts';

interface SlotItem {
  time: string;
  startAt: number;
}

interface DateOption {
  offset: number;
  name: string;
  short: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

const buildDateOptions = (): DateOption[] => {
  const now = new Date();
  const names = ['今天', '明天', '后天'];
  return names.map((name, offset) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    return { offset, name, short: `${pad(day.getMonth() + 1)}-${pad(day.getDate())}` };
  });
};

const buildSlots = (offset: number): SlotItem[] => {
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  const limit = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 21, 0, 0, 0);
  let cursor: Date;

  if (offset === 0) {
    cursor = new Date(now.getTime() + 30 * 60 * 1000);
    cursor.setSeconds(0, 0);
    const minute = cursor.getMinutes();
    if (minute !== 0 && minute !== 30) {
      cursor.setMinutes(minute < 30 ? 30 : 60, 0, 0);
    }
  } else {
    cursor = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9, 0, 0, 0);
  }

  const result: SlotItem[] = [];
  while (cursor.getTime() <= limit.getTime()) {
    result.push({
      time: `${pad(cursor.getHours())}:${pad(cursor.getMinutes())}`,
      startAt: cursor.getTime()
    });
    cursor = new Date(cursor.getTime() + 30 * 60 * 1000);
  }
  return result;
};

const expert = ref<Expert>(experts[0]);
const selectedType = ref<ConsultKey>(experts[0].consultTypes[0].key);
const dateOptions = ref<DateOption[]>(buildDateOptions());
const selectedOffset = ref(0);
const selectedSlot = ref<SlotItem | null>(null);
const selectedImmediate = ref(false);

const slots = computed<SlotItem[]>(() => buildSlots(selectedOffset.value));

const currentConsult = computed<ConsultType>(
  () => expert.value.consultTypes.find((item) => item.key === selectedType.value) || expert.value.consultTypes[0]
);

const selectedLabel = computed(() => {
  if (selectedImmediate.value) return '立即开始';
  if (!selectedSlot.value) return '';
  const day = dateOptions.value[selectedOffset.value];
  return `${day.name} ${day.short} ${selectedSlot.value.time}`;
});

const bookingDateLabel = computed(() => {
  if (selectedImmediate.value) return '立即开始';
  const day = dateOptions.value[selectedOffset.value];
  return `${day.name} ${day.short}`;
});

const selectType = (item: ConsultType) => {
  selectedType.value = item.key;
};

const selectDate = (day: DateOption) => {
  selectedOffset.value = day.offset;
  selectedSlot.value = null;
  selectedImmediate.value = false;
};

const selectSlot = (slot: SlotItem) => {
  selectedSlot.value = slot;
  selectedImmediate.value = false;
};

const chooseImmediate = () => {
  selectedSlot.value = null;
  selectedImmediate.value = true;
};

const goBooking = () => {
  if (!selectedImmediate.value && !selectedSlot.value) {
    uni.showToast({ title: '请选择预约时间', icon: 'none' });
    return;
  }
  const startAt = selectedImmediate.value ? Date.now() : (selectedSlot.value as SlotItem).startAt;
  const time = selectedImmediate.value ? '立即' : (selectedSlot.value as SlotItem).time;
  const url =
    `/modules/expert/booking?expertId=${expert.value.id}` +
    `&type=${selectedType.value}` +
    `&dateLabel=${encodeURIComponent(bookingDateLabel.value)}` +
    `&time=${encodeURIComponent(time)}` +
    `&startAt=${startAt}` +
    `&price=${currentConsult.value.price}`;
  uni.navigateTo({ url });
};

onLoad((query: any) => {
  const found = getExpert(Number(query?.id));
  if (!found) return;
  expert.value = found;
  selectedType.value = found.consultTypes[0].key;
  selectedOffset.value = 0;
  selectedSlot.value = null;
  selectedImmediate.value = false;
});
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100%;
  background: $zb-bg-page;
  padding: 24rpx 32rpx 180rpx;
}

.expert-card {
  display: flex;
  gap: 24rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: $zb-shadow-sm;
}

.avatar-wrap {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 76rpx;
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
  font-size: 36rpx;
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

.meta-line {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 16rpx;
  font-size: 22rpx;
  color: $zb-text-tertiary;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.rating {
  color: #faad14;
  font-weight: 600;
}

.meta-divider {
  width: 1rpx;
  height: 24rpx;
  background: $zb-border-light;
}

.section {
  margin-top: 24rpx;
  padding: 28rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: $zb-shadow-sm;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $zb-text-primary;
  margin-bottom: 20rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag {
  font-size: 24rpx;
  color: $zb-text-secondary;
  background: $zb-bg-grey;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
}

.intro-text {
  font-size: 26rpx;
  line-height: 1.75;
  color: $zb-text-secondary;
}

.consult-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.consult-card {
  position: relative;
  padding: 24rpx;
  border: 2rpx solid $zb-border-light;
  border-radius: 20rpx;
  background: $zb-bg-page;
}

.consult-card.active {
  border-color: $zb-primary;
  background: $zb-primary-light;
}

.consult-main {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.consult-left {
  flex: 1;
  min-width: 0;
}

.consult-name-line {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.consult-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $zb-text-primary;
}

.consult-duration {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 22rpx;
  color: $zb-text-tertiary;
}

.consult-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: $zb-text-tertiary;
  line-height: 1.5;
}

.consult-right {
  flex-shrink: 0;
  padding-top: 2rpx;
}

.consult-price {
  font-size: 32rpx;
  font-weight: 700;
  color: #ff6b35;
}

.currency {
  font-size: 24rpx;
}

.check-badge {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: $zb-primary;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}

.date-scroll {
  width: 100%;
  white-space: nowrap;
}

.date-row {
  display: inline-flex;
  gap: 16rpx;
  padding-bottom: 4rpx;
}

.date-chip {
  width: 140rpx;
  padding: 16rpx 0;
  text-align: center;
  background: $zb-bg-grey;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  border: 2rpx solid transparent;
}

.date-chip.active {
  background: $zb-primary-light;
  border-color: $zb-primary;
}

.date-name {
  font-size: 24rpx;
  font-weight: 600;
  color: $zb-text-primary;
}

.date-chip.active .date-name {
  color: $zb-primary;
}

.date-mmdd {
  font-size: 20rpx;
  color: $zb-text-tertiary;
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  margin-top: 20rpx;
}

.slot {
  padding: 16rpx 0;
  text-align: center;
  font-size: 24rpx;
  color: $zb-text-secondary;
  background: $zb-bg-grey;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
}

.slot.active {
  background: #fff;
  border-color: $zb-primary;
  color: $zb-primary;
  font-weight: 600;
}

.slot-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 36rpx 0;
  font-size: 24rpx;
  color: $zb-text-tertiary;
}

.immediate-btn {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 18rpx 0;
  border-radius: 16rpx;
  background: $zb-bg-grey;
  color: $zb-text-secondary;
  font-size: 26rpx;
  border: 2rpx solid transparent;
}

.immediate-btn.active {
  background: $zb-primary-light;
  border-color: $zb-primary;
  color: $zb-primary;
  font-weight: 600;
}

.selected-tip {
  margin-top: 16rpx;
  font-size: 22rpx;
  color: $zb-primary;
}

.bottom-space {
  height: 180rpx;
}

.detail-bottom {
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

.bottom-price {
  flex: 1;
  min-width: 0;
}

.price-cap {
  display: block;
  font-size: 22rpx;
  color: $zb-text-tertiary;
}

.price-value {
  display: flex;
  align-items: baseline;
  gap: 2rpx;
}

.price-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #ff6b35;
}

.book-btn {
  padding: 22rpx 56rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%));
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  flex-shrink: 0;
}
</style>
