<template>
  <view class="assessment-page">
    <view class="page-header">
      <text class="page-title">健康评估</text>
      <text class="page-desc">多维度测评，科学了解您的健康状况</text>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">风险测评</text>
      </view>
      <view class="assess-list">
        <view class="assess-card" v-for="a in assessments" :key="a.id" @click="onStart(a)">
          <view class="assess-left">
            <view class="assess-icon" :style="{ background: a.bgColor }"><zb-icon :name="a.icon" /></view>
            <view class="assess-info">
              <text class="assess-name">{{ a.name }}</text>
              <text class="assess-meta">{{ a.duration }} · {{ a.questions }}</text>
            </view>
          </view>
          <view class="assess-action">
            <text class="assess-status" :class="{ done: a.completed }">{{ a.completed ? '已完成' : '开始' }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">我的评估记录</text>
        <text class="section-more">查看全部 <zb-icon name="chevronRight" /></text>
      </view>
      <view class="record-list" v-if="records.length">
        <view class="record-card" v-for="r in records" :key="r.id">
          <view class="record-header">
            <text class="record-name">{{ r.name }}</text>
            <text class="record-score" :style="{ color: r.scoreColor }">{{ r.score }} 分</text>
          </view>
          <view class="record-bar">
            <view class="bar-fill" :style="{ width: r.score + '%', background: r.scoreColor }"></view>
          </view>
          <text class="record-time">{{ r.time }}</text>
        </view>
      </view>
      <view v-else class="empty-record">
        <text class="empty-icon"><zb-icon name="clipboard" /></text>
        <text class="empty-text">暂无评估记录</text>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const assessments = [
  { id: 1, name: '心脑血管风险评估', duration: '5 分钟', questions: '20 题', icon: 'heart', bgColor: '#fce4ec', completed: true },
  { id: 2, name: '睡眠质量测评', duration: '3 分钟', questions: '15 题', icon: 'moon', bgColor: '#e8f4fd', completed: true },
  { id: 3, name: '心理健康评估', duration: '8 分钟', questions: '30 题', icon: 'leaf', bgColor: '#e0f7f5', completed: false },
  { id: 4, name: '营养状况评估', duration: '6 分钟', questions: '25 题', icon: 'salad', bgColor: '#fef3e2', completed: false },
  { id: 5, name: '运动能力评估', duration: '4 分钟', questions: '18 题', icon: 'run', bgColor: '#f3e5f5', completed: false }
];

const records = [
  { id: 1, name: '心脑血管风险评估', score: 82, scoreColor: '#52c41a', time: '2026-10-20' },
  { id: 2, name: '睡眠质量测评', score: 75, scoreColor: '#faad14', time: '2026-10-15' }
];

const onStart = (a: any) => {
  if (a.completed) {
    uni.showToast({ title: '查看上次结果', icon: 'none' });
  } else {
    uni.showModal({
      title: a.name,
      content: `开始「${a.name}」，预计${a.duration}，确定开始吗？`,
      success: (res) => {
        if (res.confirm) {
          uni.showLoading({ title: '加载中...' });
          setTimeout(() => {
            uni.hideLoading();
            uni.showToast({ title: '测评完成！', icon: 'success' });
          }, 1500);
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.assessment-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-header { background: #fff; padding: 40rpx 32rpx; text-align: center; }
.page-title { font-size: 36rpx; font-weight: 700; color: $zb-text-primary; display: block; }
.page-desc { font-size: 24rpx; color: $zb-text-tertiary; margin-top: 8rpx; display: block; }

.section { margin: 24rpx 32rpx; padding: 28rpx; background: #fff; border-radius: 20rpx; }
.section-header { display: flex; justify-content: space-between; margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }
.section-more { font-size: 24rpx; color: $zb-text-tertiary; }

.assess-list { display: flex; flex-direction: column; gap: 16rpx; }
.assess-card { display: flex; align-items: center; justify-content: space-between; padding: 24rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.assess-left { display: flex; align-items: center; gap: 16rpx; flex: 1; }
.assess-icon { width: 72rpx; height: 72rpx; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; font-size: 36rpx; }
.assess-info { display: flex; flex-direction: column; }
.assess-name { font-size: 28rpx; font-weight: 500; color: $zb-text-primary; }
.assess-meta { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; }
.assess-status { padding: 10rpx 28rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 24rpx; border-radius: 20rpx; }
.assess-status.done { background: $zb-bg-grey; color: $zb-success; }

.record-list { display: flex; flex-direction: column; gap: 16rpx; }
.record-card { padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.record-header { display: flex; justify-content: space-between; margin-bottom: 12rpx; }
.record-name { font-size: 26rpx; font-weight: 500; color: $zb-text-primary; }
.record-score { font-size: 28rpx; font-weight: 700; }
.record-bar { height: 12rpx; background: #fff; border-radius: 6rpx; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6rpx; transition: width 0.5s; }
.record-time { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 8rpx; display: block; text-align: right; }

.empty-record { display: flex; flex-direction: column; align-items: center; padding: 40rpx 0; }
.empty-icon { font-size: 64rpx; margin-bottom: 16rpx; }
.empty-text { font-size: 26rpx; color: $zb-text-tertiary; }

.bottom-space { height: 40rpx; }
</style>
