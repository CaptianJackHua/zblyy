<template>
  <view class="consult-page">
    <view class="nav-bar" :class="{ dark: isDark }">
      <view class="nav-back" @click="goBack">
        <zb-icon name="chevronLeft" />
      </view>
      <view class="nav-title-wrap">
        <text class="nav-title">{{ appt ? appt.expertName : '咨询服务' }}</text>
        <text v-if="appt" class="nav-sub">{{ appt.typeName }}</text>
      </view>
      <view v-if="appt" class="nav-status" :class="{ live: !locked }">
        <text class="status-dot"></text>
        <text>{{ locked ? statusText(apptStatus) : '进行中' }}</text>
      </view>
    </view>

    <view v-if="locked" class="locked-wrap">
      <view class="locked-icon">
        <zb-icon name="clock" />
      </view>
      <text class="locked-title">{{ lockedReason }}</text>
      <view v-if="appt" class="locked-time">
        <zb-icon name="calendar" />
        <text>预约时间：{{ appt.dateLabel }} {{ appt.time }}</text>
      </view>
      <text class="locked-desc">请在预约时间到达后进入咨询，超过 1 小时未进入将自动结束。</text>
      <view class="locked-btn" @click="goBack">返回我的预约</view>
    </view>

    <view v-else-if="currentType === 'text'" class="chat-wrap">
      <scroll-view scroll-y class="chat-scroll" :scroll-into-view="scrollToId" scroll-with-animation>
        <view class="messages">
          <view v-for="msg in messages" :key="msg.id" :id="'msg-' + msg.id" :class="['msg-item', msg.role]">
            <view v-if="msg.role === 'expert'" class="msg-avatar" :style="{ backgroundColor: avatarBg }">
              <zb-icon name="user" />
            </view>
            <view :class="['msg-bubble', msg.role]">
              <text class="bubble-text">{{ msg.content }}</text>
            </view>
            <view v-if="msg.role === 'user'" class="msg-avatar user-avatar">
              <zb-icon name="user" />
            </view>
          </view>

          <view v-if="typing" id="msg-typing" class="msg-item expert">
            <view class="msg-avatar" :style="{ backgroundColor: avatarBg }">
              <zb-icon name="user" />
            </view>
            <view class="msg-bubble expert">
              <text class="bubble-text">正在输入...</text>
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="chat-input">
        <view class="end-btn" @click="confirmFinish">
          <zb-icon name="close" />
          <text>结束咨询</text>
        </view>
        <input
          v-model="inputText"
          class="chat-field"
          placeholder="输入您想咨询的问题..."
          confirm-type="send"
          @confirm="send"
        />
        <view class="send-btn" :class="{ active: inputText.trim() }" @click="send">
          <zb-icon name="send" />
        </view>
      </view>
    </view>

    <view v-else class="call-wrap" :class="currentType">
      <view v-if="currentType === 'video'" class="self-window">
        <zb-icon name="user" />
        <text class="self-label">我</text>
      </view>

      <view class="call-avatar" :style="{ backgroundColor: avatarBg }">
        <zb-icon name="user" />
      </view>
      <text class="call-name">{{ appt ? appt.expertName : '专家' }}</text>
      <text class="call-type">{{ currentType === 'video' ? '视频咨询' : '电话咨询' }}</text>
      <text class="call-timer">{{ elapsedText }}</text>
      <text class="call-tip">{{ muted ? '已静音' : currentType === 'video' ? '视频通话中' : '通话中' }}</text>

      <view class="call-actions">
        <view class="call-action" @click="toggleMute">
          <view class="round-btn" :class="{ off: muted }">
            <zb-icon :name="muted ? 'close' : 'check'" />
          </view>
          <text class="action-text">{{ muted ? '已静音' : '静音' }}</text>
        </view>
        <view class="call-action" @click="confirmFinish">
          <view class="round-btn hangup">
            <zb-icon name="phone" />
          </view>
          <text class="action-text">挂断</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { getExpert, type ConsultKey, type Expert } from '@/data/experts';
import {
  appointmentStatus,
  finishAppointment,
  getAppointment,
  statusText,
  type Appointment,
  type ApptStatus
} from '@/utils/expert-store';

interface ChatMessage {
  id: number;
  role: 'user' | 'expert';
  content: string;
}

const decodeParam = (value: any) => {
  const raw = value == null ? '' : String(value);
  try {
    return decodeURIComponent(raw);
  } catch (e) {
    return raw;
  }
};

const appt = ref<Appointment | null>(null);
const expert = ref<Expert | null>(null);
const messages = ref<ChatMessage[]>([]);
const inputText = ref('');
const typing = ref(false);
const scrollToId = ref('');
const muted = ref(false);
const elapsed = ref(0);
let msgSeq = 1;
let ticker: any = null;

const currentType = computed<ConsultKey>(() => (appt.value ? appt.value.type : 'text'));
const avatarBg = computed(() => (expert.value ? expert.value.avatarBg : '#e0f7f5'));
const apptStatus = computed<ApptStatus>(() => (appt.value ? appointmentStatus(appt.value) : 'done'));

const locked = computed(() => {
  if (!appt.value) return true;
  return appointmentStatus(appt.value) !== 'ready';
});

const lockedReason = computed(() => {
  if (!appt.value) return '未找到预约信息';
  return apptStatus.value === 'done' ? '咨询已结束' : '预约时间未到';
});

const isDark = computed(
  () => !locked.value && (currentType.value === 'phone' || currentType.value === 'video')
);

const elapsedText = computed(() => {
  const minutes = Math.floor(elapsed.value / 60);
  const seconds = elapsed.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const stopTicker = () => {
  if (ticker) {
    clearInterval(ticker);
    ticker = null;
  }
};

const startTicker = () => {
  stopTicker();
  elapsed.value = 0;
  ticker = setInterval(() => {
    elapsed.value += 1;
  }, 1000);
};

const goBack = () => {
  uni.navigateBack();
};

const pickReply = (text: string) => {
  if (/失眠|睡/.test(text)) {
    return '关于睡眠问题，建议先调整作息：固定入睡和起床时间，睡前 1 小时远离电子屏幕，卧室保持安静、昏暗。若持续两周以上没有改善，我们可以进一步评估原因。';
  }
  if (/血压/.test(text)) {
    return '关于血压管理，建议每天固定时间测量并记录，饮食上控制盐分摄入，少吃腌制和高油食物，保持规律的有氧运动。若数值持续偏高，请及时到医院复诊。';
  }
  const name = appt.value ? appt.value.expertName : '专家';
  return `感谢您的分享，${name}已经了解您的情况。建议先保持规律作息、适量运动，避免过度焦虑。您可以再说说具体感受和持续时间，我们一起梳理。`;
};

const send = () => {
  const text = inputText.value.trim();
  if (!text || typing.value) return;

  const userMsg: ChatMessage = { id: msgSeq++, role: 'user', content: text };
  messages.value.push(userMsg);
  inputText.value = '';

  typing.value = true;
  nextTick(() => {
    scrollToId.value = 'msg-typing';
  });

  setTimeout(() => {
    typing.value = false;
    const reply: ChatMessage = { id: msgSeq++, role: 'expert', content: pickReply(text) };
    messages.value.push(reply);
    nextTick(() => {
      scrollToId.value = `msg-${reply.id}`;
    });
  }, 800);
};

const confirmFinish = () => {
  uni.showModal({
    title: '结束咨询',
    content: '确认结束本次咨询吗？结束后将无法继续沟通。',
    success: (res) => {
      if (!res.confirm) return;
      if (appt.value) finishAppointment(appt.value.id);
      uni.navigateBack();
    }
  });
};

const toggleMute = () => {
  muted.value = !muted.value;
};

onLoad((query: any) => {
  const id = decodeParam(query?.id);
  const found = id ? getAppointment(id) : undefined;
  appt.value = found || null;
  if (!found) return;

  expert.value = getExpert(found.expertId) || null;
  if (appointmentStatus(found) !== 'ready') return;

  if (found.type === 'text') {
    const welcome: ChatMessage = {
      id: msgSeq++,
      role: 'expert',
      content: `您好，我是${found.expertName}，我们开始本次图文咨询吧`
    };
    messages.value = [welcome];
    scrollToId.value = `msg-${welcome.id}`;
  } else {
    startTicker();
  }
});

onUnload(() => {
  stopTicker();
});
</script>

<style lang="scss" scoped>
.consult-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  background: $zb-bg-page;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  padding-top: calc(12rpx + var(--status-bar-height, 44px));
  background: #fff;
  border-bottom: 1rpx solid $zb-border-light;
}

.nav-bar.dark {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: transparent;
  border-bottom-color: transparent;
}

.nav-back {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: $zb-text-primary;
  flex-shrink: 0;
}

.nav-title-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.nav-title {
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.3;
  color: $zb-text-primary;
}

.nav-sub {
  font-size: 20rpx;
  color: $zb-text-tertiary;
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 14rpx;
  border-radius: 24rpx;
  background: $zb-bg-grey;
  color: $zb-text-tertiary;
  font-size: 22rpx;
  flex-shrink: 0;
}

.status-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: $zb-text-tertiary;
}

.nav-status.live {
  background: rgba(46, 196, 182, 0.14);
  color: $zb-primary;
}

.nav-status.live .status-dot {
  background: $zb-primary;
}

.nav-bar.dark .nav-back,
.nav-bar.dark .nav-title {
  color: #fff;
}

.nav-bar.dark .nav-sub {
  color: rgba(255, 255, 255, 0.7);
}

.nav-bar.dark .nav-status {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.nav-bar.dark .nav-status .status-dot {
  background: $zb-success;
}

.locked-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 48rpx 160rpx;
}

.locked-icon {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 76rpx;
  color: $zb-text-tertiary;
  box-shadow: $zb-shadow-sm;
}

.locked-title {
  margin-top: 32rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: $zb-text-primary;
}

.locked-time {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: $zb-text-secondary;
}

.locked-desc {
  margin-top: 16rpx;
  font-size: 24rpx;
  line-height: 1.6;
  text-align: center;
  color: $zb-text-tertiary;
}

.locked-btn {
  margin-top: 48rpx;
  padding: 20rpx 64rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%));
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.chat-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chat-scroll {
  flex: 1;
  min-height: 0;
  padding: 24rpx 24rpx 0;
}

.messages {
  padding-bottom: 24rpx;
}

.msg-item {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
  margin-bottom: 24rpx;
}

.msg-item.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: $zb-primary;
  flex-shrink: 0;
  box-shadow: $zb-shadow-sm;
}

.msg-avatar.user-avatar {
  background: $zb-primary-light;
}

.msg-bubble {
  max-width: 66%;
  padding: 18rpx 22rpx;
  border-radius: 18rpx;
  background: #fff;
  box-shadow: $zb-shadow-sm;
}

.msg-bubble.user {
  background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%));
}

.bubble-text {
  font-size: 26rpx;
  line-height: 1.65;
  color: $zb-text-primary;
  white-space: pre-wrap;
}

.msg-bubble.user .bubble-text {
  color: #fff;
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 14rpx;
  flex-shrink: 0;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid $zb-border-light;
}

.end-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 22rpx;
  color: $zb-text-tertiary;
  flex-shrink: 0;
}

.chat-field {
  flex: 1;
  height: 68rpx;
  padding: 0 24rpx;
  border-radius: 34rpx;
  background: $zb-bg-grey;
  font-size: 26rpx;
}

.send-btn {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: $zb-bg-grey;
  color: $zb-text-tertiary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
}

.send-btn.active {
  background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%));
  color: #fff;
}

.call-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 180rpx 48rpx 60rpx;
}

.call-wrap.phone {
  background: linear-gradient(160deg, #1f3b4d 0%, #2ec4b6 100%);
}

.call-wrap.video {
  background: linear-gradient(160deg, #0f1b2d 0%, #1d3557 55%, #2ec4b6 130%);
}

.self-window {
  position: absolute;
  top: 220rpx;
  right: 32rpx;
  width: 180rpx;
  height: 240rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.16);
  border: 1rpx solid rgba(255, 255, 255, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #fff;
  font-size: 44rpx;
}

.self-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.8);
}

.call-avatar {
  width: 220rpx;
  height: 220rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 110rpx;
  color: $zb-primary;
  box-shadow: 0 0 0 8rpx rgba(255, 255, 255, 0.18), 0 20rpx 60rpx rgba(0, 0, 0, 0.25);
}

.call-name {
  margin-top: 40rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.call-type {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
}

.call-timer {
  margin-top: 20rpx;
  font-size: 32rpx;
  letter-spacing: 2rpx;
  color: #fff;
}

.call-tip {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
}

.call-actions {
  margin-top: auto;
  display: flex;
  gap: 120rpx;
  padding-bottom: 40rpx;
}

.call-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.round-btn {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52rpx;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.28);
}

.round-btn.off {
  background: rgba(255, 255, 255, 0.9);
  color: $zb-text-primary;
}

.round-btn.hangup {
  background: $zb-danger;
  border-color: $zb-danger;
  transform: rotate(135deg);
}

.action-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.85);
}
</style>
