<template>
  <view class="archive-page">
    <!-- 成员切换 -->
    <scroll-view scroll-x class="member-bar" :show-scrollbar="false">
      <view class="member-row">
        <view class="member-item" @click="addMember">
          <view class="member-avatar add"><zb-icon name="plus" color="#9aa3b2" /></view>
          <text class="member-name">新增</text>
        </view>
        <view v-for="(m, i) in members" :key="m.id" class="member-item" @click="activeIndex = i">
          <view class="member-avatar" :class="{ active: activeIndex === i }">
            <zb-icon name="user" :color="activeIndex === i ? '#2ec4b6' : '#9aa3b2'" />
          </view>
          <text class="member-name" :class="{ active: activeIndex === i }">{{ m.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 人物区 -->
    <view class="hero">
      <image class="hero-img" :src="heroImage" mode="widthFix" />
      <view class="base-card" @click="goBasicInfo">
        <text class="base-title">基础信息</text>
        <zb-icon name="chevronRight" color="#c0c4cc" />
      </view>
    </view>

    <!-- 数据面板 -->
    <view class="panel">
      <view class="panel-tabs">
        <view
          v-for="t in panelTabs"
          :key="t.key"
          class="panel-tab"
          :class="{ active: panelTab === t.key }"
          @click="panelTab = t.key"
        >
          {{ t.name }}
        </view>
      </view>

      <view class="panel-body">
        <view v-if="panelTab === 'device'" class="empty">没有更多数据了</view>

        <view v-else-if="panelTab === 'report'" class="record-list">
          <view v-for="r in reports" :key="r.id" class="record-item" @click="openRecord(r.name)">
            <view class="record-icon"><zb-icon name="file" color="#2ec4b6" /></view>
            <view class="record-info">
              <text class="record-name">{{ r.name }}</text>
              <text class="record-time">{{ r.time }}</text>
            </view>
            <zb-icon name="chevronRight" color="#c0c4cc" />
          </view>
        </view>

        <view v-else class="record-list">
          <view v-for="q in questionnaires" :key="q.id" class="record-item">
            <view class="record-icon"><zb-icon name="clipboard" color="#2ec4b6" /></view>
            <view class="record-info">
              <text class="record-name">{{ q.name }}</text>
              <text class="record-time">{{ q.time }}</text>
            </view>
            <view class="record-btn" @click="fillQuestionnaire(q.name)">去填写</view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-space"></view>

    <view class="footer-bar">
      <view class="measure-btn" @click="startMeasure">云脉仪检测</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const heroImage = `${import.meta.env.BASE_URL}static/images/archive-hero.jpg`;

const members = [
  { id: 1, name: '本人' },
  { id: 2, name: '本人' },
  { id: 3, name: '姐姐' },
  { id: 4, name: '本人' },
  { id: 5, name: '姐姐' }
];

const activeIndex = ref(1);

const panelTabs = [
  { key: 'device', name: '云脉仪' },
  { key: 'report', name: '检测报告' },
  { key: 'survey', name: '问卷调查' }
];
const panelTab = ref('device');

const reports = [
  { id: 1, name: '血压检测报告', time: '2026-10-15' },
  { id: 2, name: '心率检测报告', time: '2026-10-12' }
];

const questionnaires = [
  { id: 1, name: '亚健康自评问卷', time: '预计 3 分钟' },
  { id: 2, name: '睡眠质量评估', time: '预计 2 分钟' }
];

const addMember = () => {
  uni.showToast({ title: '新增家庭成员', icon: 'none' });
};

const goBasicInfo = () => {
  uni.navigateTo({ url: '/modules/health-archive/basic-info' });
};

const openRecord = (name: string) => {
  uni.showToast({ title: `查看 ${name}`, icon: 'none' });
};

const fillQuestionnaire = (name: string) => {
  uni.showToast({ title: `开始 ${name}`, icon: 'none' });
};

const startMeasure = () => {
  uni.showModal({
    title: '云脉仪检测',
    content: '请将手指轻放在云脉仪上，保持 30 秒',
    confirmText: '开始检测',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '检测完成，已同步至档案', icon: 'success' });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.archive-page { min-height: 100%; display: flex; flex-direction: column; background: #fff; }

.member-bar { white-space: nowrap; padding: 24rpx 0 8rpx; flex-shrink: 0; }
.member-row { display: inline-flex; gap: 36rpx; padding: 0 32rpx; }
.member-item { display: flex; flex-direction: column; align-items: center; gap: 10rpx; }

.member-avatar { width: 96rpx; height: 96rpx; border-radius: 50%; background: #f2f4f7; display: flex; align-items: center; justify-content: center; font-size: 44rpx; border: 4rpx solid transparent; }
.member-avatar.active { border-color: $zb-primary; background: #eafaf7; }
.member-avatar.add { background: #f7f8fa; }
.member-name { font-size: 24rpx; color: $zb-text-tertiary; }
.member-name.active { color: $zb-primary; font-weight: 600; }

.hero { position: relative; height: 440rpx; flex-shrink: 0; overflow: hidden; background: #d4fae0; }
.hero-img { position: absolute; top: 0; left: 50%; width: 80%; transform: translateX(-50%); -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%); mask-image: linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%); }
.base-card { position: absolute; left: 32rpx; right: 32rpx; bottom: 48rpx; height: 96rpx; display: flex; align-items: center; justify-content: space-between; padding: 0 32rpx; background: #fff; border-radius: 20rpx; box-shadow: 0 8rpx 28rpx rgba(26, 26, 46, 0.08); }
.base-title { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; }

.panel { margin-top: 24rpx; flex: 1; background: #fff; border-radius: 40rpx 40rpx 0 0; box-shadow: 0 -6rpx 24rpx rgba(26, 26, 46, 0.05); }
.panel-tabs { display: flex; border-bottom: 1rpx solid $zb-border-light; }
.panel-tab { flex: 1; text-align: center; padding: 28rpx 0 24rpx; font-size: 28rpx; color: $zb-text-secondary; position: relative; }
.panel-tab.active { color: $zb-primary; font-weight: 600; }
.panel-tab.active::after { content: ''; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 48rpx; height: 6rpx; border-radius: 6rpx; background: $zb-primary; }

.panel-body { padding: 32rpx 32rpx 180rpx; min-height: 300rpx; }
.empty { padding: 100rpx 0; text-align: center; font-size: 26rpx; color: $zb-text-tertiary; }

.record-list { display: flex; flex-direction: column; gap: 16rpx; }
.record-item { display: flex; align-items: center; gap: 16rpx; padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.record-icon { width: 64rpx; height: 64rpx; border-radius: 14rpx; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 32rpx; }
.record-info { flex: 1; }
.record-name { display: block; font-size: 26rpx; font-weight: 500; color: $zb-text-primary; }
.record-time { display: block; font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; }
.record-btn { padding: 8rpx 24rpx; border-radius: 24rpx; border: 1rpx solid $zb-primary; color: $zb-primary; font-size: 22rpx; }

.footer-bar { position: fixed; left: 0; right: 0; bottom: 0; padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom)); background: #fff; border-top: 1rpx solid $zb-border-light; }
.measure-btn { height: 92rpx; line-height: 92rpx; text-align: center; border-radius: 46rpx; background: linear-gradient(135deg, #2ec4b6 0%, #25a095 100%); color: #fff; font-size: 30rpx; font-weight: 600; }

.bottom-space { height: 20rpx; }
</style>
