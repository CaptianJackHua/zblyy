<template>
  <view class="info-page">
    <view class="avatar-row">
      <view class="avatar"><zb-icon name="user" color="#ffffff" /></view>
      <view class="member-select" @click="chooseMember">
        <text class="member-text">{{ member }}</text>
        <zb-icon class="member-arrow" name="chevronRight" color="#2ec4b6" />
      </view>
    </view>

    <text class="hint">您可以匿名填写，但留下真实姓名，将有助于我们更快速地解决您的问题</text>

    <view class="form-list">
      <view class="form-row">
        <text class="form-label">名称</text>
        <view class="form-field">
          <input v-model="form.name" class="field-input" placeholder="请输入" placeholder-class="ph" />
          <view v-if="form.name" class="clear-btn" @click="form.name = ''">
            <zb-icon name="close" color="#ffffff" :size="20" />
          </view>
        </view>
      </view>

      <view class="form-row">
        <text class="form-label">年龄</text>
        <view class="form-field">
          <input v-model="form.age" type="number" class="field-input" placeholder="请输入" placeholder-class="ph" />
          <view v-if="form.age" class="clear-btn" @click="form.age = ''">
            <zb-icon name="close" color="#ffffff" :size="20" />
          </view>
        </view>
      </view>

      <view class="form-row">
        <text class="form-label">手机号</text>
        <view class="form-field">
          <input v-model="form.phone" type="number" maxlength="11" class="field-input" placeholder="请输入" placeholder-class="ph" />
          <view v-if="form.phone" class="clear-btn" @click="form.phone = ''">
            <zb-icon name="close" color="#ffffff" :size="20" />
          </view>
        </view>
      </view>

      <view class="form-row">
        <text class="form-label">性别</text>
        <view class="gender-group">
          <view class="gender-btn" :class="{ active: form.gender === '女' }" @click="form.gender = '女'">女</view>
          <view class="gender-btn" :class="{ active: form.gender === '男' }" @click="form.gender = '男'">男</view>
        </view>
      </view>

      <view class="form-row">
        <text class="form-label">身高(cm)</text>
        <view class="form-field">
          <input v-model="form.height" type="number" class="field-input" placeholder="请输入" placeholder-class="ph" />
          <view v-if="form.height" class="clear-btn" @click="form.height = ''">
            <zb-icon name="close" color="#ffffff" :size="20" />
          </view>
        </view>
      </view>

      <view class="form-row">
        <text class="form-label">体重(kg)</text>
        <view class="form-field">
          <input v-model="form.weight" type="number" class="field-input" placeholder="请输入" placeholder-class="ph" />
          <view v-if="form.weight" class="clear-btn" @click="form.weight = ''">
            <zb-icon name="close" color="#ffffff" :size="20" />
          </view>
        </view>
      </view>
    </view>

    <view class="textarea-box">
      <textarea
        v-model="form.history"
        class="history-input"
        placeholder="是否有家族病史，其他情况也可以在这里说明一下哦~"
        placeholder-class="ph"
        :maxlength="200"
      />
    </view>

    <view class="bottom-space"></view>

    <view class="footer-bar">
      <view class="save-btn" @click="save">保存</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const member = ref('本人');
const memberOptions = ['本人', '姐姐', '妈妈', '爸爸'];

const form = reactive({
  name: '来着你看',
  age: '2588',
  phone: '13212345678',
  gender: '男',
  height: '152',
  weight: '255',
  history: ''
});

const chooseMember = () => {
  uni.showActionSheet({
    itemList: memberOptions,
    success: (res) => {
      member.value = memberOptions[res.tapIndex];
    }
  });
};

const save = () => {
  if (!form.name.trim()) {
    uni.showToast({ title: '请填写名称', icon: 'none' });
    return;
  }
  uni.showToast({ title: '保存成功', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 800);
};
</script>

<style lang="scss" scoped>
.info-page { min-height: 100%; background: #fff; padding: 32rpx 32rpx 0; box-sizing: border-box; }

.avatar-row { display: flex; align-items: center; justify-content: space-between; }
.avatar { width: 96rpx; height: 96rpx; border-radius: 16rpx; background: #c9ced6; display: flex; align-items: center; justify-content: center; font-size: 48rpx; }
.member-select { display: flex; align-items: center; gap: 4rpx; padding: 12rpx 24rpx; border: 1rpx solid $zb-primary; border-radius: 12rpx; }
.member-text { font-size: 26rpx; color: $zb-primary; }
.member-arrow { font-size: 22rpx; transform: rotate(90deg); }

.hint { display: block; font-size: 24rpx; color: $zb-text-tertiary; line-height: 1.6; margin-top: 24rpx; }

.form-list { margin-top: 16rpx; }
.form-row { display: flex; align-items: center; justify-content: space-between; min-height: 104rpx; border-bottom: 1rpx solid $zb-border-light; }
.form-label { font-size: 28rpx; font-weight: 600; color: $zb-text-primary; flex-shrink: 0; }
.form-field { display: flex; align-items: center; gap: 12rpx; flex: 1; justify-content: flex-end; }
.field-input { text-align: right; font-size: 28rpx; color: $zb-text-primary; height: 72rpx; }
.clear-btn { width: 36rpx; height: 36rpx; border-radius: 50%; background: #c9ced6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.gender-group { display: flex; gap: 16rpx; }
.gender-btn { width: 96rpx; height: 60rpx; line-height: 60rpx; text-align: center; border-radius: 12rpx; border: 1rpx solid $zb-border-base; color: $zb-text-secondary; font-size: 26rpx; }
.gender-btn.active { border-color: $zb-primary; color: $zb-primary; background: $zb-primary-light; font-weight: 600; }

.textarea-box { margin-top: 32rpx; padding: 24rpx; background: $zb-bg-grey; border-radius: 16rpx; }
.history-input { width: 100%; height: 160rpx; font-size: 26rpx; color: $zb-text-primary; line-height: 1.6; }

.ph { color: #b6bdc9; }

.footer-bar { position: fixed; left: 0; right: 0; bottom: 0; padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom)); background: #fff; }
.save-btn { height: 92rpx; line-height: 92rpx; text-align: center; border-radius: 46rpx; background: linear-gradient(135deg, #2ec4b6 0%, #25a095 100%); color: #fff; font-size: 30rpx; font-weight: 600; }

.bottom-space { height: 160rpx; }
</style>
