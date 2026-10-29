<template>
  <view class="about-page">
    <view class="hero-section">
      <view class="hero-bg"></view>
      <view class="hero-content">
        <view class="hero-logo"><zb-icon name="hospital" /></view>
        <text class="hero-name">中兵康养</text>
        <text class="hero-slogan">山水为境，康养为本</text>
      </view>
    </view>

    <view class="intro-section">
      <text class="intro-title">关于中兵康养</text>
      <text class="intro-text">
        中兵康养是中兵集团旗下专业的大健康产业平台，致力于为全年龄段用户提供专业、全面的康养服务。我们以「山水为境，康养为本」为理念，打造集智慧健康、健康服务、养生体验、康养旅居于一体的综合康养生态。
      </text>
      <text class="intro-text">
        依托中兵集团的强大背景和资源优势，中兵康养已在全国 50 多个城市布局 100+ 线下门店，签约合作三甲医院 200+，累计服务用户超过 500 万人次。
      </text>
    </view>

    <view class="stats-section">
      <view class="stat-item" v-for="s in stats" :key="s.label">
        <text class="stat-value">{{ s.value }}</text>
        <text class="stat-label">{{ s.label }}</text>
        <text class="stat-unit">{{ s.unit }}</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">品牌使命</text>
      <view class="mission-list">
        <view class="mission-item" v-for="m in missions" :key="m.title">
          <view class="mission-icon"><zb-icon :name="m.icon" /></view>
          <view class="mission-info">
            <text class="mission-title">{{ m.title }}</text>
            <text class="mission-desc">{{ m.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">发展历程</text>
      <view class="timeline">
        <view class="timeline-item" v-for="t in timeline" :key="t.year">
          <view class="timeline-dot"></view>
          <view class="timeline-line"></view>
          <view class="timeline-content">
            <text class="timeline-year">{{ t.year }}</text>
            <text class="timeline-event">{{ t.event }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">联系我们</text>
      <view class="contact-grid">
        <view class="contact-item">
          <text class="contact-icon"><zb-icon name="phone" /></text>
          <text class="contact-label">客服热线</text>
          <text class="contact-value">400-888-8888</text>
        </view>
        <view class="contact-item">
          <text class="contact-icon"><zb-icon name="mail" /></text>
          <text class="contact-label">邮箱</text>
          <text class="contact-value">service@zb-wellness.com</text>
        </view>
        <view class="contact-item">
          <text class="contact-icon"><zb-icon name="mapPin" /></text>
          <text class="contact-label">总部地址</text>
          <text class="contact-value">北京市朝阳区建国路 88 号</text>
        </view>
        <view class="contact-item">
          <text class="contact-icon"><zb-icon name="globe" /></text>
          <text class="contact-label">官方网站</text>
          <text class="contact-value">www.zb-wellness.com</text>
        </view>
      </view>
    </view>
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
const stats = [
  { value: '500万', label: '服务用户', unit: '+' },
  { value: '100+', label: '线下门店', unit: '' },
  { value: '200+', label: '合作医院', unit: '' },
  { value: '50+', label: '覆盖城市', unit: '' }
];

const missions = [
  { icon: 'target', title: '企业使命', desc: '让每个人都能享受专业的康养服务' },
  { icon: 'eye', title: '企业愿景', desc: '成为中国领先的综合康养服务平台' },
  { icon: 'gem', title: '核心价值观', desc: '专业、诚信、创新、共赢' }
];

const timeline = [
  { year: '2020', event: '中兵康养品牌正式成立' },
  { year: '2021', event: '首批 10 家线下门店开业' },
  { year: '2022', event: '智慧健康平台上线，AI 小医发布' },
  { year: '2023', event: '康养旅居业务启动，覆盖 20+ 目的地' },
  { year: '2024', event: '全国门店突破 100 家' },
  { year: '2025', event: '用户规模突破 500 万' }
];
</script>

<style lang="scss" scoped>
.about-page { min-height: 100%; background: $zb-bg-page; padding-bottom: 40rpx; }
.hero-section { position: relative; height: 360rpx; }
.hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1a1a2e 0%, #2ec4b6 100%); }
.hero-content { position: relative; z-index: 1; padding: 60rpx 32rpx; display: flex; flex-direction: column; align-items: center; }
.hero-logo { font-size: 80rpx; width: 140rpx; height: 140rpx; background: rgba(255,255,255,0.2); border-radius: 32rpx; display: flex; align-items: center; justify-content: center; border: 4rpx solid rgba(255,255,255,0.3); margin-bottom: 20rpx; }
.hero-name { font-size: 44rpx; font-weight: 700; color: #fff; }
.hero-slogan { font-size: 26rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; }

.intro-section { margin: -40rpx 32rpx 0; background: #fff; border-radius: 24rpx; padding: 32rpx; position: relative; z-index: 2; box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08); }
.intro-title { font-size: 32rpx; font-weight: 700; color: $zb-text-primary; margin-bottom: 20rpx; display: block; }
.intro-text { font-size: 26rpx; color: $zb-text-secondary; line-height: 1.8; margin-bottom: 16rpx; text-indent: 2em; }

.stats-section { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; margin: 24rpx 32rpx; }
.stat-item { background: #fff; border-radius: 16rpx; padding: 24rpx 12rpx; text-align: center; }
.stat-value { font-size: 32rpx; font-weight: 700; color: $zb-primary; display: block; }
.stat-label { font-size: 20rpx; color: $zb-text-tertiary; display: block; margin-top: 4rpx; }
.stat-unit { font-size: 18rpx; color: $zb-primary; }

.section { margin: 24rpx 32rpx; padding: 28rpx; background: #fff; border-radius: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $zb-text-primary; margin-bottom: 24rpx; display: block; }

.mission-list { display: flex; flex-direction: column; gap: 20rpx; }
.mission-item { display: flex; gap: 16rpx; padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.mission-icon { font-size: 40rpx; width: 72rpx; height: 72rpx; background: #fff; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mission-info { flex: 1; }
.mission-title { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; display: block; }
.mission-desc { font-size: 24rpx; color: $zb-text-secondary; margin-top: 4rpx; display: block; }

.timeline { position: relative; padding-left: 32rpx; }
.timeline-item { position: relative; padding-bottom: 28rpx; padding-left: 20rpx; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-dot { position: absolute; left: -32rpx; top: 8rpx; width: 16rpx; height: 16rpx; background: $zb-primary; border-radius: 50%; }
.timeline-line { position: absolute; left: -26rpx; top: 28rpx; bottom: -8rpx; width: 2rpx; background: $zb-border-light; }
.timeline-item:last-child .timeline-line { display: none; }
.timeline-year { font-size: 24rpx; font-weight: 600; color: $zb-primary; }
.timeline-event { font-size: 26rpx; color: $zb-text-secondary; margin-top: 4rpx; display: block; }

.contact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20rpx; }
.contact-item { padding: 20rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.contact-icon { font-size: 36rpx; display: block; margin-bottom: 8rpx; }
.contact-label { font-size: 22rpx; color: $zb-text-tertiary; display: block; }
.contact-value { font-size: 26rpx; color: $zb-text-primary; font-weight: 500; margin-top: 4rpx; display: block; }

.bottom-space { height: 40rpx; }
</style>
