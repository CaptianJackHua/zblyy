<template>
  <view class="message-page">
    <view class="msg-header">
      <text class="header-title">消息中心</text>
    </view>

    <view class="msg-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.id" 
        :class="['tab-item', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
        <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
      </view>
    </view>

    <view class="msg-list">
      <view v-for="msg in filteredMsgs" :key="msg.id" class="msg-card">
        <view class="msg-avatar" :style="{ background: msg.color }"><zb-icon :name="msg.icon" /></view>
        <view class="msg-content">
          <view class="msg-top">
            <text class="msg-title">{{ msg.title }}</text>
            <text class="msg-time">{{ msg.time }}</text>
          </view>
          <text class="msg-preview">{{ msg.preview }}</text>
        </view>
        <view v-if="msg.unread" class="msg-unread"></view>
      </view>
    </view>

    <view v-if="filteredMsgs.length === 0" class="empty-state">
      <text class="empty-icon"><zb-icon name="inbox" /></text>
      <text class="empty-text">暂无消息</text>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';

onShow(() => {
  uni.showTabBar({ animation: false });
});

const tabs = [
  { id: 'all', name: '全部', count: 5 },
  { id: 'system', name: '系统通知', count: 2 },
  { id: 'chat', name: '小医对话', count: 1 },
  { id: 'order', name: '订单消息', count: 2 }
];

const activeTab = ref('all');

const messages = [
  { id: 1, type: 'system', icon: 'bell', color: '#e0f7f5', title: '欢迎使用中兵康养', preview: '感谢您选择中兵康养，我们将竭诚为您服务！', time: '刚刚', unread: true },
  { id: 2, type: 'chat', icon: 'bot', color: '#e8f4fd', title: '中兵小医', preview: '您好，有什么健康问题需要咨询吗？', time: '10 分钟前', unread: true },
  { id: 3, type: 'order', icon: 'package', color: '#fef3e2', title: '订单发货通知', preview: '您购买的智能手环 Pro 已发货，预计明天送达', time: '1 小时前', unread: true },
  { id: 4, type: 'system', icon: 'gift', color: '#fce4ec', title: '会员权益更新', preview: '恭喜您升级为银卡会员，享受更多专属优惠', time: '今天 09:00', unread: false },
  { id: 5, type: 'order', icon: 'chat', color: '#e8f4fd', title: '评价提醒', preview: '您的体检服务已完成，期待您的评价', time: '昨天', unread: false }
];

const filteredMsgs = computed(() => {
  if (activeTab.value === 'all') return messages;
  return messages.filter(m => m.type === activeTab.value);
});
</script>

<style lang="scss" scoped>
.message-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 120rpx; }
.msg-header { padding: 40rpx 32rpx 24rpx; background: #fff; }
.header-title { font-size: 40rpx; font-weight: 700; color: $zb-text-primary; }

.msg-tabs { display: flex; padding: 0 32rpx; background: #fff; padding-bottom: 24rpx; gap: 32rpx; }
.tab-item { position: relative; font-size: 28rpx; color: $zb-text-tertiary; padding: 8rpx 0; }
.tab-item.active { color: $zb-text-primary; font-weight: 600; }
.tab-item.active::after { content: ''; position: absolute; bottom: -4rpx; left: 50%; transform: translateX(-50%); width: 40rpx; height: 4rpx; background: $zb-primary; border-radius: 2rpx; }
.tab-badge { position: absolute; top: -8rpx; right: -16rpx; min-width: 32rpx; height: 32rpx; background: #ff4d4f; color: #fff; font-size: 20rpx; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; padding: 0 8rpx; }

.msg-list { padding: 24rpx 32rpx; }
.msg-card { display: flex; align-items: center; gap: 20rpx; padding: 24rpx; background: #fff; border-radius: 20rpx; margin-bottom: 16rpx; }
.msg-avatar { width: 88rpx; height: 88rpx; border-radius: 24rpx; display: flex; align-items: center; justify-content: center; font-size: 40rpx; flex-shrink: 0; }
.msg-content { flex: 1; min-width: 0; }
.msg-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8rpx; }
.msg-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.msg-time { font-size: 22rpx; color: $zb-text-tertiary; }
.msg-preview { font-size: 24rpx; color: $zb-text-secondary; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.msg-unread { width: 16rpx; height: 16rpx; background: #ff4d4f; border-radius: 50%; flex-shrink: 0; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; }
.empty-icon { font-size: 120rpx; margin-bottom: 24rpx; }
.empty-text { font-size: 28rpx; color: $zb-text-tertiary; }

.bottom-space { height: 40rpx; }
</style>
