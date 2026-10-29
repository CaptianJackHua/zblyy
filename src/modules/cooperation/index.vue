<template>
  <view class="coop-page">
    <view class="hero-section">
      <view class="hero-bg"></view>
      <view class="hero-content">
        <text class="hero-title">合作专区</text>
        <text class="hero-sub">携手共赢 · 共创康养未来</text>
      </view>
    </view>

    <view class="coop-types">
      <view class="type-card" v-for="t in coopTypes" :key="t.id" @click="onSelectType(t)">
        <view class="type-icon"><zb-icon :name="t.icon" /></view>
        <text class="type-name">{{ t.name }}</text>
        <text class="type-desc">{{ t.desc }}</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">合作优势</text>
      </view>
      <view class="advantage-grid">
        <view class="adv-item" v-for="a in advantages" :key="a.id">
          <text class="adv-num">0{{ a.id }}</text>
          <view class="adv-info">
            <text class="adv-title">{{ a.title }}</text>
            <text class="adv-desc">{{ a.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">合作流程</text>
      </view>
      <view class="process-list">
        <view class="process-item" v-for="(p, idx) in process" :key="idx">
          <view class="process-num">{{ idx + 1 }}</view>
          <view class="process-content">
            <text class="process-title">{{ p.title }}</text>
            <text class="process-desc">{{ p.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="contact-section">
      <text class="contact-title"><zb-icon name="phone" /> 联系我们</text>
      <view class="contact-list">
        <view class="contact-item">
          <text class="contact-label">合作热线</text>
          <text class="contact-value">400-888-8888</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">商务邮箱</text>
          <text class="contact-value">business@zb-wellness.com</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">公司地址</text>
          <text class="contact-value">北京市朝阳区建国路 88 号</text>
        </view>
      </view>
      <view class="contact-btn" @click="onSubmit">提交合作意向</view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const coopTypes = [
  { id: 1, name: '酒店合作', desc: '旅居康养酒店资源对接', icon: 'hotel' },
  { id: 2, name: '医疗合作', desc: '医院/诊所合作', icon: 'hospital' },
  { id: 3, name: '品牌合作', desc: '康养品牌联名推广', icon: 'handshake' },
  { id: 4, name: '渠道合作', desc: '分销渠道拓展', icon: 'trending' }
];

const advantages = [
  { id: 1, title: '品牌实力', desc: '中兵集团背书，国企品质保障' },
  { id: 2, title: '全国网络', desc: '覆盖 50+ 城市，100+ 门店' },
  { id: 3, title: '流量支持', desc: '千万级用户流量精准导入' },
  { id: 4, title: '专业团队', desc: '康养行业资深运营团队' }
];

const process = [
  { title: '意向提交', desc: '填写合作意向表单' },
  { title: '初步沟通', desc: '商务团队 3 个工作日内联系' },
  { title: '方案定制', desc: '根据需求定制合作方案' },
  { title: '签约落地', desc: '签署协议，正式启动合作' }
];

const onSelectType = (t: any) => {
  uni.showToast({ title: `选择「${t.name}」`, icon: 'none' });
};

const onSubmit = () => {
  uni.showToast({ title: '已收到您的意向，我们将尽快联系您', icon: 'success', duration: 2000 });
};
</script>

<style lang="scss" scoped>
.coop-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.hero-section { position: relative; height: 280rpx; }
.hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #2ec4b6 100%); }
.hero-content { position: relative; z-index: 1; padding: 80rpx 32rpx; text-align: center; }
.hero-title { font-size: 48rpx; font-weight: 700; color: #fff; display: block; }
.hero-sub { font-size: 26rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.coop-types { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20rpx; margin: 24rpx 32rpx; }
.type-card { background: #fff; border-radius: 20rpx; padding: 32rpx 24rpx; display: flex; flex-direction: column; align-items: center; }
.type-icon { font-size: 56rpx; margin-bottom: 12rpx; }
.type-name { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; }
.type-desc { font-size: 22rpx; color: $zb-text-tertiary; margin-top: 6rpx; text-align: center; }

.section { margin: 24rpx 32rpx; padding: 28rpx; background: #fff; border-radius: 20rpx; }
.section-header { margin-bottom: 24rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; }

.advantage-grid { display: flex; flex-direction: column; gap: 20rpx; }
.adv-item { display: flex; gap: 20rpx; align-items: flex-start; padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.adv-num { font-size: 32rpx; font-weight: 700; color: $zb-primary; width: 56rpx; }
.adv-info { flex: 1; }
.adv-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.adv-desc { font-size: 24rpx; color: $zb-text-secondary; margin-top: 4rpx; display: block; }

.process-list { display: flex; flex-direction: column; }
.process-item { display: flex; gap: 20rpx; padding: 20rpx 0; border-bottom: 1rpx solid $zb-border-light; position: relative; }
.process-item:last-child { border-bottom: none; }
.process-num { width: 56rpx; height: 56rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 26rpx; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.process-content { flex: 1; padding-top: 4rpx; }
.process-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.process-desc { font-size: 24rpx; color: $zb-text-secondary; margin-top: 4rpx; display: block; }

.contact-section { margin: 24rpx 32rpx; background: linear-gradient(135deg, #f5f7fa 0%, #e0f7f5 100%); border-radius: 20rpx; padding: 32rpx; }
.contact-title { font-size: 32rpx; font-weight: 700; color: $zb-text-primary; margin-bottom: 24rpx; display: block; }
.contact-list { display: flex; flex-direction: column; gap: 16rpx; margin-bottom: 28rpx; }
.contact-item { display: flex; justify-content: space-between; }
.contact-label { font-size: 26rpx; color: $zb-text-secondary; }
.contact-value { font-size: 26rpx; color: $zb-text-primary; font-weight: 500; }
.contact-btn { height: 88rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); color: #fff; font-size: 30rpx; font-weight: 600; border-radius: 44rpx; display: flex; align-items: center; justify-content: center; }

.bottom-space { height: 40rpx; }
</style>
