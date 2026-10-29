<template>
  <view class="family-page">
    <view class="page-header">
      <text class="page-title">亲友关怀</text>
      <text class="page-desc">为家人办理康养服务，传递健康关爱</text>
    </view>

    <view class="family-list">
      <view class="family-card" v-for="f in family" :key="f.id">
        <view class="family-avatar" :style="{ background: f.color }"><zb-icon :name="f.icon" /></view>
        <view class="family-info">
          <view class="family-top">
            <text class="family-name">{{ f.name }}</text>
            <text class="family-relation">{{ f.relation }}</text>
          </view>
          <text class="family-phone">{{ f.phone }}</text>
          <view class="family-tags">
            <text v-for="s in f.services" :key="s" class="family-tag">{{ s }}</text>
          </view>
        </view>
        <view class="family-action" @click="onManage(f)">管理</view>
      </view>
    </view>

    <view class="add-family" @click="onAddFamily">
      <view class="add-icon">+</view>
      <text class="add-text">添加亲友</text>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐关怀服务</text>
      </view>
      <view class="recommend-list">
        <view v-for="r in recommends" :key="r.id" class="recommend-card">
          <view class="recommend-icon"><zb-icon :name="r.icon" /></view>
          <view class="recommend-info">
            <text class="recommend-name">{{ r.name }}</text>
            <text class="recommend-desc">{{ r.desc }}</text>
          </view>
          <view class="recommend-btn" @click="onBuy(r)">立即办理</view>
        </view>
      </view>
    </view>

    <view class="section tips-section">
      <text class="tips-title"><zb-icon name="heart" /> 为什么选择亲友关怀？</text>
      <view class="tips-list">
        <view class="tip-item"><zb-icon name="check" /> 家人可共享您的会员权益</view>
        <view class="tip-item"><zb-icon name="check" /> 代为预约更方便</view>
        <view class="tip-item"><zb-icon name="check" /> 家庭健康档案统一管理</view>
        <view class="tip-item"><zb-icon name="check" /> 紧急情况快速联系</view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const family = [
  { id: 1, name: '张妈妈', relation: '母亲', phone: '138****1234', icon: 'user', color: '#fce4ec', services: ['会员共享', '体检预约'] },
  { id: 2, name: '李爸爸', relation: '父亲', phone: '139****5678', icon: 'user', color: '#e8f4fd', services: ['会员共享'] },
  { id: 3, name: '小宝', relation: '儿子', phone: '暂无', icon: 'user', color: '#fef3e2', services: ['健康档案'] }
];

const recommends = [
  { id: 1, name: '家庭康养套餐', desc: '3 人共享 · 含体检+理疗', icon: 'users' },
  { id: 2, name: '父母专属卡', desc: '血压/血糖监测 · AI 守护', icon: 'user' },
  { id: 3, name: '儿童健康计划', desc: '生长发育跟踪 · 营养指导', icon: 'baby' }
];

const onAddFamily = () => {
  uni.showToast({ title: '添加亲友功能', icon: 'none' });
};
const onManage = (f: any) => uni.showToast({ title: `管理 ${f.name}`, icon: 'none' });
const onBuy = (r: any) => uni.showToast({ title: `办理 ${r.name}`, icon: 'none' });
</script>

<style lang="scss" scoped>
.family-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.page-header { background: linear-gradient(135deg, #f59e0b 0%, #2ec4b6 100%); padding: 60rpx 32rpx 40rpx; text-align: center; }
.page-title { font-size: 40rpx; font-weight: 700; color: #fff; display: block; }
.page-desc { font-size: 24rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.family-list { padding: 24rpx 32rpx; }
.family-card { display: flex; align-items: center; gap: 20rpx; padding: 24rpx; background: #fff; border-radius: 20rpx; margin-bottom: 16rpx; }
.family-avatar { width: 96rpx; height: 96rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 48rpx; flex-shrink: 0; }
.family-info { flex: 1; }
.family-top { display: flex; align-items: center; gap: 12rpx; }
.family-name { font-size: 30rpx; font-weight: 600; color: $zb-text-primary; }
.family-relation { font-size: 22rpx; color: $zb-primary; background: $zb-primary-light; padding: 2rpx 12rpx; border-radius: 6rpx; }
.family-phone { font-size: 24rpx; color: $zb-text-tertiary; margin-top: 6rpx; display: block; }
.family-tags { display: flex; gap: 12rpx; margin-top: 8rpx; }
.family-tag { font-size: 20rpx; color: $zb-text-secondary; background: $zb-bg-grey; padding: 2rpx 12rpx; border-radius: 6rpx; }
.family-action { font-size: 26rpx; color: $zb-primary; padding: 12rpx 24rpx; background: $zb-primary-light; border-radius: 20rpx; }

.add-family { display: flex; align-items: center; justify-content: center; gap: 12rpx; margin: 0 32rpx; padding: 28rpx; background: #fff; border: 2rpx dashed $zb-primary; border-radius: 20rpx; }
.add-icon { font-size: 40rpx; color: $zb-primary; }
.add-text { font-size: 28rpx; color: $zb-primary; font-weight: 500; }

.section { margin: 24rpx 32rpx; background: #fff; border-radius: 20rpx; padding: 24rpx; }
.section-header { margin-bottom: 20rpx; }
.section-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }

.recommend-list { display: flex; flex-direction: column; gap: 16rpx; }
.recommend-card { display: flex; align-items: center; gap: 16rpx; padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.recommend-icon { font-size: 40rpx; width: 72rpx; height: 72rpx; background: #fff; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; }
.recommend-info { flex: 1; }
.recommend-name { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.recommend-desc { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 4rpx; display: block; }
.recommend-btn { padding: 12rpx 20rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 22rpx; border-radius: 20rpx; }

.tips-section { background: linear-gradient(135deg, #fef3e2 0%, #fff 100%); }
.tips-title { font-size: 26rpx; font-weight: 600; color: $zb-text-primary; margin-bottom: 16rpx; display: block; }
.tips-list { display: flex; flex-direction: column; gap: 8rpx; }
.tip-item { font-size: 24rpx; color: $zb-text-secondary; }

.bottom-space { height: 40rpx; }
</style>
