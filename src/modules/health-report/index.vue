<template>
  <view class="report-page">
    <view class="page-header">
      <text class="page-title">我的报告</text>
      <text class="page-desc">体检报告、检测结果一键查看</text>
    </view>

    <view class="filter-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.id" 
        :class="['tab-item', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }} ({{ tab.count }})
      </view>
    </view>

    <view class="report-list">
      <view class="report-card" v-for="r in filteredReports" :key="r.id" @click="onView(r)">
        <view class="report-header">
          <view class="report-type" :class="r.type">{{ r.typeName }}</view>
          <text class="report-status" :class="r.status">{{ r.statusText }}</text>
        </view>
        <text class="report-title">{{ r.title }}</text>
        <text class="report-org">{{ r.organization }}</text>
        <text class="report-date"><zb-icon name="calendar" /> {{ r.date }}</text>
        <view class="report-actions">
          <view class="action-btn primary" @click.stop="onView(r)">查看详情</view>
          <view class="action-btn" @click.stop="onShare(r)">分享</view>
        </view>
      </view>
    </view>

    <view v-if="filteredReports.length === 0" class="empty-state">
      <text class="empty-icon"><zb-icon name="file" /></text>
      <text class="empty-text">暂无报告</text>
      <view class="empty-btn" @click="onUpload">上传报告</view>
    </view>

    <view class="upload-fab" @click="onUpload">
      <text class="fab-icon"><zb-icon name="upload" /></text>
      <text class="fab-text">上传</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tabs = [
  { id: 'all', name: '全部', count: 5 },
  { id: 'physical', name: '体检报告', count: 3 },
  { id: 'lab', name: '检验报告', count: 1 },
  { id: 'image', name: '影像报告', count: 1 }
];

const activeTab = ref('all');

const reports = [
  { id: 1, type: 'physical', typeName: '体检', title: '2026 年度全面体检报告', organization: '北京协和医院', date: '2026-10-15', status: 'normal', statusText: '正常' },
  { id: 2, type: 'physical', typeName: '体检', title: '2026 年中期体检报告', organization: '中日友好医院', date: '2026-06-20', status: 'attention', statusText: '需关注' },
  { id: 3, type: 'physical', typeName: '体检', title: '入职体检报告', organization: '美年大健康', date: '2026-03-10', status: 'normal', statusText: '正常' },
  { id: 4, type: 'lab', typeName: '检验', title: '血常规检验报告', organization: '北京协和医院', date: '2026-10-01', status: 'normal', statusText: '正常' },
  { id: 5, type: 'image', typeName: '影像', title: '胸部 CT 报告', organization: '中日友好医院', date: '2026-09-25', status: 'normal', statusText: '正常' }
];

const filteredReports = computed(() => {
  if (activeTab.value === 'all') return reports;
  return reports.filter(r => r.type === activeTab.value);
});

const onView = (r: any) => uni.showToast({ title: `查看 ${r.title}`, icon: 'none' });
const onShare = (r: any) => uni.showToast({ title: '分享报告', icon: 'none' });
const onUpload = () => {
  uni.showActionSheet({
    itemList: ['拍照上传', '从相册选择'],
    success: () => uni.showToast({ title: '报告上传成功', icon: 'success' })
  });
};
</script>

<style lang="scss" scoped>
.report-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 200rpx; }
.page-header { background: #fff; padding: 40rpx 32rpx; text-align: center; }
.page-title { font-size: 36rpx; font-weight: 700; color: $zb-text-primary; display: block; }
.page-desc { font-size: 24rpx; color: $zb-text-tertiary; margin-top: 8rpx; display: block; }

.filter-tabs { display: flex; padding: 20rpx 32rpx; gap: 16rpx; background: #fff; border-bottom: 1rpx solid $zb-border-light; overflow-x: auto; }
.tab-item { flex-shrink: 0; padding: 12rpx 24rpx; font-size: 26rpx; color: $zb-text-secondary; background: $zb-bg-grey; border-radius: 24rpx; }
.tab-item.active { background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; }

.report-list { padding: 24rpx 32rpx; }
.report-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04); }
.report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.report-type { padding: 6rpx 16rpx; font-size: 22rpx; border-radius: 6rpx; }
.report-type.physical { background: #e0f7f5; color: $zb-primary; }
.report-type.lab { background: #fef3e2; color: $zb-accent; }
.report-type.image { background: #e8f4fd; color: #3b82f6; }
.report-status { font-size: 22rpx; }
.report-status.normal { color: $zb-success; }
.report-status.attention { color: $zb-warning; }
.report-status.abnormal { color: #ff4d4f; }
.report-title { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.report-org { font-size: 24rpx; color: $zb-text-secondary; margin-top: 6rpx; display: block; }
.report-date { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 8rpx; display: block; }
.report-actions { display: flex; gap: 16rpx; margin-top: 20rpx; }
.action-btn { flex: 1; padding: 16rpx 0; text-align: center; background: $zb-bg-grey; font-size: 26rpx; color: $zb-text-secondary; border-radius: 24rpx; }
.action-btn.primary { background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 80rpx 0; }
.empty-icon { font-size: 100rpx; margin-bottom: 24rpx; }
.empty-text { font-size: 28rpx; color: $zb-text-tertiary; margin-bottom: 24rpx; }
.empty-btn { padding: 16rpx 48rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 26rpx; border-radius: 28rpx; }

.upload-fab { position: fixed; right: 32rpx; bottom: 140rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100rpx; height: 100rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); border-radius: 50%; box-shadow: 0 8rpx 24rpx rgba(46, 196, 182, 0.4); z-index: 100; }
.fab-icon { font-size: 32rpx; }
.fab-text { font-size: 18rpx; color: #fff; margin-top: 2rpx; }
</style>
