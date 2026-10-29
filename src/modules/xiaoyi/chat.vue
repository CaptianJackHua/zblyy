<template>
  <view class="chat-page">
    <!-- 头部 -->
    <view class="chat-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon"><zb-icon name="chevronLeft" /></text>
      </view>
      <view class="header-center">
        <text class="chat-title">中兵小医</text>
        <text class="chat-status">● 在线</text>
      </view>
      <view class="header-right">
        <text class="more-icon">⋯</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view scroll-y class="chat-scroll" :scroll-into-view="scrollToId" scroll-with-animation>
      <view class="messages">
        <!-- 欢迎消息 -->
        <view class="msg-item bot" id="msg-welcome">
          <view class="msg-avatar"><zb-icon name="bot" /></view>
          <view class="msg-bubble">
            <text class="bubble-text">您好！我是中兵小医，您的 AI 健康助手 <zb-icon name="hand" /></text>
            <text class="bubble-text">我可以帮您解答健康问题、解读体检报告、提供养生建议等。请问有什么可以帮您？</text>
          </view>
        </view>

        <!-- 快捷问题 -->
        <view class="quick-questions">
          <view 
            v-for="(q, idx) in quickQuestions" 
            :key="idx" 
            class="quick-item"
            @click="sendMessage(q)"
          >
            {{ q }}
          </view>
        </view>

        <!-- 动态消息 -->
        <view 
          v-for="msg in messages" 
          :key="msg.id" 
          :id="`msg-${msg.id}`"
          :class="['msg-item', msg.role]"
        >
          <view v-if="msg.role === 'bot'" class="msg-avatar"><zb-icon name="bot" /></view>
          <view :class="['msg-bubble', msg.role]">
            <text class="bubble-text">{{ msg.content }}</text>
          </view>
          <view v-if="msg.role === 'user'" class="msg-avatar user-avatar"><zb-icon name="user" /></view>
        </view>

        <!-- 正在输入 -->
        <view v-if="isTyping" class="msg-item bot" id="msg-typing">
          <view class="msg-avatar"><zb-icon name="bot" /></view>
          <view class="msg-bubble">
            <view class="typing-dots">
              <view class="dot dot-1"></view>
              <view class="dot dot-2"></view>
              <view class="dot dot-3"></view>
            </view>
          </view>
        </view>
      </view>
      <view class="scroll-bottom" id="scroll-bottom"></view>
    </scroll-view>

    <!-- 底部输入区 -->
    <view class="chat-input">
      <view class="input-tools">
        <text class="tool-icon"><zb-icon name="camera" /></text>
        <text class="tool-icon"><zb-icon name="mic" /></text>
        <text class="tool-icon"><zb-icon name="paperclip" /></text>
      </view>
      <view class="input-box">
        <input 
          v-model="inputText" 
          class="chat-input-field" 
          placeholder="输入健康问题..." 
          confirm-type="send"
          @confirm="handleSend"
        />
      </view>
      <view class="send-btn" :class="{ active: inputText.trim() }" @click="handleSend">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

interface ChatMessage {
  id: number;
  role: 'user' | 'bot';
  content: string;
}

const quickQuestions = [
  '最近总是失眠怎么办？',
  '高血压饮食需要注意什么？',
  '如何解读体检报告？',
  '推荐一些养生方法'
];

const messages = ref<ChatMessage[]>([]);
const inputText = ref('');
const isTyping = ref(false);
const scrollToId = ref('msg-welcome');
let msgId = 100;

const botResponses: Record<string, string> = {
  '最近总是失眠怎么办？': '失眠是一个常见问题，建议您：\n1. 保持规律作息，每天同一时间上床\n2. 睡前 1 小时避免使用电子设备\n3. 卧室保持安静、黑暗、凉爽\n4. 睡前可以尝试冥想或温水泡脚\n5. 如果持续失眠超过 2 周，建议就医检查',
  '高血压饮食需要注意什么？': '高血压饮食建议：\n✅ 多吃新鲜蔬菜水果\n✅ 选择低盐食物，每日盐摄入 < 5g\n✅ 增加全谷物和优质蛋白\n❌ 限制高脂肪、高胆固醇食物\n❌ 避免腌制、烟熏食品\n❌ 戒烟限酒\n同时建议定期监测血压，遵医嘱服药。',
  '如何解读体检报告？': '解读体检报告需要关注：\n1. 看结论：先看医生给出的总结论\n2. 看异常指标：重点关注有 ↑↓ 标记的项目\n3. 看参考范围：了解各项指标的正常范围\n4. 看趋势：对比历年数据更有意义\n如果有异常指标，建议点击"上传报告"让我帮您详细解读，或直接咨询医生。',
  '推荐一些养生方法': '日常养生推荐：\n🌅 早起：6-7 点起床，喝一杯温水\n🏃 运动：每天 30 分钟中等强度运动\n🥗 饮食：三餐定时，多蔬果少油腻\n😴 睡眠：保证 7-8 小时优质睡眠\n🧘 情志：保持心情舒畅，避免过度焦虑\n🌿 中医：可尝试艾灸、推拿等传统疗法\n关键是坚持！找到适合自己的养生方式最重要。'
};

const goBack = () => uni.navigateBack();

const sendMessage = (text: string) => {
  if (!text.trim()) return;
  
  const userMsg: ChatMessage = { id: msgId++, role: 'user', content: text };
  messages.value.push(userMsg);
  inputText.value = '';
  
  nextTick(() => {
    scrollToId.value = `msg-${userMsg.id}`;
  });

  // 显示正在输入
  isTyping.value = true;
  
  // 模拟 AI 回复
  setTimeout(() => {
    isTyping.value = false;
    const reply = botResponses[text] || '感谢您的咨询！根据您描述的情况，建议您注意休息、保持良好的生活习惯。如果症状持续或加重，建议及时就医。如需更详细的建议，请提供更多信息。';
    const botMsg: ChatMessage = { id: msgId++, role: 'bot', content: reply };
    messages.value.push(botMsg);
    nextTick(() => {
      scrollToId.value = `msg-${botMsg.id}`;
    });
  }, 1200);
};

const handleSend = () => {
  sendMessage(inputText.value);
};
</script>

<style lang="scss" scoped>
.chat-page { height: 100%; display: flex; flex-direction: column; background: $zb-bg-page; }

.chat-header { display: flex; align-items: center; padding: 20rpx 32rpx; background: #fff; border-bottom: 1rpx solid $zb-border-light; }
.header-left { width: 60rpx; }
.back-icon { font-size: 48rpx; color: $zb-text-primary; }
.header-center { flex: 1; text-align: center; }
.chat-title { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.chat-status { font-size: 22rpx; color: $zb-success; }
.header-right { width: 60rpx; text-align: right; }
.more-icon { font-size: 40rpx; color: $zb-text-tertiary; }

.chat-scroll { flex: 1; padding: 24rpx 32rpx; }
.messages { padding-bottom: 20rpx; }

.msg-item { display: flex; align-items: flex-start; margin-bottom: 24rpx; gap: 16rpx; }
.msg-item.user { flex-direction: row-reverse; }

.msg-avatar { width: 72rpx; height: 72rpx; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36rpx; flex-shrink: 0; box-shadow: $zb-shadow-sm; }
.msg-avatar.user-avatar { background: $zb-primary-light; }

.msg-bubble { max-width: 70%; padding: 20rpx 24rpx; background: #fff; border-radius: 20rpx; box-shadow: $zb-shadow-sm; display: flex; flex-direction: column; gap: 8rpx; }
.msg-bubble.user { background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; }
.bubble-text { font-size: 28rpx; line-height: 1.6; white-space: pre-wrap; }
.msg-bubble.user .bubble-text { color: #fff; }

.quick-questions { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 24rpx; }
.quick-item { padding: 12rpx 24rpx; background: #fff; border: 1rpx solid $zb-primary; color: $zb-primary; font-size: 24rpx; border-radius: 24rpx; }

.typing-dots { display: flex; gap: 6rpx; padding: 8rpx 0; }
.dot { width: 12rpx; height: 12rpx; background: $zb-text-tertiary; border-radius: 50%; animation: typing 1.4s infinite; }
.dot-2 { animation-delay: 0.2s; }
.dot-3 { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-8rpx); opacity: 1; }
}

.chat-input { display: flex; align-items: center; gap: 16rpx; padding: 20rpx 32rpx; background: #fff; border-top: 1rpx solid $zb-border-light; padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }
.input-tools { display: flex; gap: 16rpx; }
.tool-icon { font-size: 36rpx; }
.input-box { flex: 1; }
.chat-input-field { width: 100%; height: 72rpx; background: $zb-bg-grey; border-radius: 36rpx; padding: 0 28rpx; font-size: 28rpx; }
.send-btn { padding: 16rpx 32rpx; background: $zb-text-tertiary; color: #fff; font-size: 26rpx; border-radius: 36rpx; }
.send-btn.active { background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); }

.scroll-bottom { height: 20rpx; }
</style>
