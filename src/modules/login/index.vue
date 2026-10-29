<template>
  <view class="login-page">
    <view class="login-header">
      <view class="logo-wrap">
        <view class="logo-icon"><zb-icon name="hospital" /></view>
        <view class="logo-text">
          <text class="logo-title">中兵康养</text>
          <text class="logo-sub">ZHONGBING WELLNESS</text>
        </view>
      </view>
      <text class="welcome">欢迎来到中兵康养</text>
      <text class="welcome-sub">登录开启您的健康之旅</text>
    </view>

    <view class="login-form">
      <view class="form-item">
        <text class="form-label">手机号</text>
        <view class="input-wrap">
          <input v-model="phone" class="form-input" type="number" placeholder="请输入手机号" maxlength="11" />
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">验证码</text>
        <view class="input-wrap code-wrap">
          <input v-model="code" class="form-input" type="number" placeholder="请输入验证码" maxlength="6" />
          <view class="code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
            {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
          </view>
        </view>
      </view>

      <view class="agreement-row">
        <view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
          <text v-if="agreed" class="check-icon"><zb-icon name="check" /></text>
        </view>
        <text class="agreement-text">
          我已阅读并同意
          <text class="link" @click.stop="uni.showToast({ title: '用户协议', icon: 'none' })">《用户协议》</text>
          和
          <text class="link" @click.stop="uni.showToast({ title: '隐私政策', icon: 'none' })">《隐私政策》</text>
        </text>
      </view>

      <view class="login-btn" :class="{ disabled: !canLogin }" @click="onLogin">
        <text>登录 / 注册</text>
      </view>
    </view>

    <view class="other-login">
      <text class="other-text">其他登录方式</text>
      <view class="other-icons">
        <view class="other-icon wechat" @click="onWechatLogin"><zb-icon name="chat" /></view>
        <view class="other-icon alipay" @click="onAlipayLogin"><zb-icon name="wallet" /></view>
      </view>
    </view>

    <view class="footer">
      <text>© 2026 中兵康养</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const phone = ref('');
const code = ref('');
const agreed = ref(false);
const countdown = ref(0);
let timer: number | null = null;

const canLogin = computed(() => phone.value.length === 11 && code.value.length >= 4 && agreed.value);

const sendCode = () => {
  if (countdown.value > 0) return;
  if (phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  countdown.value = 60;
  uni.showToast({ title: '验证码已发送', icon: 'success' });
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
};

const onLogin = () => {
  if (!canLogin.value) {
    uni.showToast({ title: '请填写完整信息并同意协议', icon: 'none' });
    return;
  }
  uni.showLoading({ title: '登录中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '登录成功！', icon: 'success' });
    setTimeout(() => uni.navigateBack(), 800);
  }, 1500);
};

const onWechatLogin = () => {
  uni.showToast({ title: '微信登录', icon: 'none' });
};

const onAlipayLogin = () => {
  uni.showToast({ title: '支付宝登录', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.login-page { min-height: 100%; background: linear-gradient(180deg, #2ec4b6 0%, #e0f7f5 50%, #fff 100%); padding: 60rpx 48rpx 40rpx; display: flex; flex-direction: column; }
.login-header { padding-top: 40rpx; }
.logo-wrap { display: flex; align-items: center; gap: 16rpx; }
.logo-icon { font-size: 56rpx; width: 96rpx; height: 96rpx; background: #fff; border-radius: 24rpx; display: flex; align-items: center; justify-content: center; box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1); }
.logo-title { font-size: 40rpx; font-weight: 700; color: #fff; display: block; }
.logo-sub { font-size: 18rpx; color: rgba(255,255,255,0.8); letter-spacing: 1rpx; }
.welcome { font-size: 44rpx; font-weight: 700; color: #fff; margin-top: 48rpx; display: block; }
.welcome-sub { font-size: 28rpx; color: rgba(255,255,255,0.8); margin-top: 8rpx; display: block; }

.login-form { background: #fff; border-radius: 24rpx; padding: 40rpx 32rpx; margin-top: 48rpx; box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08); }
.form-item { margin-bottom: 24rpx; }
.form-label { font-size: 26rpx; color: $zb-text-secondary; margin-bottom: 12rpx; display: block; }
.input-wrap { display: flex; align-items: center; background: $zb-bg-grey; border-radius: 12rpx; padding: 0 24rpx; }
.code-wrap { padding-right: 16rpx; }
.form-input { flex: 1; height: 88rpx; font-size: 30rpx; background: transparent; }
.code-btn { padding: 14rpx 24rpx; font-size: 24rpx; color: $zb-primary; background: $zb-primary-light; border-radius: 8rpx; flex-shrink: 0; }
.code-btn.disabled { color: $zb-text-tertiary; background: $zb-bg-grey; }

.agreement-row { display: flex; align-items: flex-start; gap: 12rpx; margin-top: 24rpx; }
.checkbox { width: 36rpx; height: 36rpx; border: 2rpx solid $zb-border-dark; border-radius: 6rpx; display: flex; align-items: center; justify-content: center; margin-top: 4rpx; flex-shrink: 0; }
.checkbox.checked { background: $zb-primary; border-color: $zb-primary; }
.check-icon { color: #fff; font-size: 22rpx; }
.agreement-text { font-size: 24rpx; color: $zb-text-tertiary; line-height: 1.5; flex: 1; }
.link { color: $zb-primary; }

.login-btn { margin-top: 40rpx; height: 88rpx; background: linear-gradient(135deg, $zb-primary, lighten($zb-primary, 8%)); border-radius: 44rpx; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 32rpx; font-weight: 600; box-shadow: 0 8rpx 24rpx rgba(46, 196, 182, 0.3); }
.login-btn.disabled { background: $zb-border-dark; box-shadow: none; }

.other-login { margin-top: auto; display: flex; flex-direction: column; align-items: center; }
.other-text { font-size: 24rpx; color: $zb-text-tertiary; margin-bottom: 24rpx; }
.other-icons { display: flex; gap: 48rpx; }
.other-icon { width: 88rpx; height: 88rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40rpx; }
.other-icon.wechat { background: #e8f8ee; }
.other-icon.alipay { background: #e6f4ff; }

.footer { text-align: center; margin-top: 60rpx; font-size: 22rpx; color: $zb-text-tertiary; }
</style>
