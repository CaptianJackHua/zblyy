<!--
  电动车车型 APP 功能配置
  技术栈：uni-app + Vue3 <script setup> + TypeScript + Wot UI V2
  设计：B 端后台 H5 原型，#165DFF 蓝色主色调，扁平风
  左侧菜单：8 个一级分类（车辆控制/车辆状态/灯光设置/仪表设置/音效设置/驾驶调校/骑行模式/硬件管理）
  表格：双开关列（车主展示 / 非车主展示），级联规则：车主关闭时非车主同步关闭
-->
<script setup lang="ts">
import { ref, computed } from 'vue'

// ==================== 类型 ====================
interface Option {
  name: string
  shown: boolean
}
interface Feature {
  name: string
  // 存在（静态，初始化时决定该角色下是否有此功能项）
  ownerHas: boolean
  guestHas: boolean
  // 展示（开关控制，初始=存在）
  ownerShown: boolean
  guestShown: boolean
  options?: Option[]
}
interface Category {
  id: string
  name: string
  features: Feature[]
}

// ==================== 工具 ====================
function f(name: string, ownerHas: boolean, guestHas: boolean, options?: Option[]): Feature {
  return {
    name,
    ownerHas, guestHas,
    ownerShown: ownerHas,
    guestShown: guestHas,
    options
  }
}
function mk(names: string[], shownCount: number): Option[] {
  return names.map((n, i) => ({ name: n, shown: i < shownCount }))
}
function mk6(base = '音效', shownCount = 0): Option[] {
  return Array.from({ length: 6 }, (_, i) => ({
    name: `${base}${i + 1}`,
    shown: i < shownCount
  }))
}

// ==================== 全量功能清单（参考电动车全部功能菜单图） ====================
// 约定：ownerShown=true 车主可见；guestShown=true 非车主也可见
// 基础功能（停车/锁车/定位/蓝牙等）一般 guestShown=true；高级控车/调校/硬件管理 guestShown=false
function initCategories(): Category[] {
  return [
    // ========== 车辆控制 ==========
    {
      id: 'vehicle',
      name: '车辆控制',
      features: [
        f('寻车', true, true),
        f('上下电', true, true),
        f('座垫锁', true, true),
        f('手动锁车', true, true),
        f('分享用车', true, false),
        f('空调控制', true, false),
        f('升窗', true, false),
        f('NFC 控车', true, false),
        f('密码控车', true, false),
        f('感应控车', true, false),
        f('无感控车', true, false),
        f('NFC 学卡', true, false),
        f('NFC 删除', true, false)
      ]
    },

    // ========== 车辆状态 ==========
    {
      id: 'status',
      name: '车辆状态',
      features: [
        f('骑行统计', true, false),
        f('车辆定位', true, true),
        f('电池属性', true, false),
        f('电池电压', true, true),
        f('车辆状态', true, true),
        f('蓝牙连接', true, true)
      ]
    },

    // ========== 灯光设置 ==========
    {
      id: 'light',
      name: '灯光设置',
      features: [
        f('自动大灯开启时间', true, false),
        f('延迟关闭大灯', true, false),
        f('背光设置', true, false),
        f('转向灯自动回位', true, false),
        f('报警灯开关状态', true, false)
      ]
    },

    // ========== 仪表设置 ==========
    {
      id: 'meter',
      name: '仪表设置',
      features: [
        f('多媒体蓝牙', true, false),
        f('导航设置', true, false),
        f('导航设置-当前导航', true, false),
        f('导航设置-路线偏好', true, false),
        f('导航设置-避让', true, false),
        f('第三方应用通知', true, false),
        f('环境天气信息', true, false)
      ]
    },

    // ========== 音效设置 ==========
    {
      id: 'sound',
      name: '音效设置',
      features: [
        f('全部声音控制', true, false),
        f('报警开关状态', true, true),
        f('自定义铃声', true, false, mk6('铃声', 0)),
        f('开机音效设置', true, false, mk(['经典', '轻快', '提示音', '音效4', '音效5', '音效6'], 3)),
        f('关机音效设置', true, false, mk(['经典', '轻快', '音效3', '音效4', '音效5', '音效6'], 2)),
        f('设防音效设置', true, true, mk6('设防音', 2)),
        f('撤防音效设置', true, true, mk6('撤防音', 2)),
        f('报警音效设置', true, true, mk6('报警音', 2)),
        f('寻车音效设置', true, true, mk6('寻车音', 2)),
        f('超速提示音效设置', true, false, mk(['蜂鸣', '语音', '音效3', '音效4', '音效5', '音效6'], 2)),
        f('低电量提示音效设置', true, true, mk(['提示音', '音效2', '音效3', '音效4', '音效5', '音效6'], 1)),
        f('转向提示音效设置', true, true, mk(['经典', '轻快', '音效3', '音效4', '音效5', '音效6'], 2)),
        f('倒车提示音效设置', true, false, mk6('倒车音', 0)),
        f('防撞提示音效设置', true, false, mk6('防撞音', 0)),
        f('锁车提示音量', true, false),
        f('开锁提示音量', true, false),
        f('上锁音量', true, true),
        f('解锁音量', true, true),
        f('寻车音量', true, true),
        f('转向灯音量', true, true),
        f('刹车提示音量', true, false),
        f('倒车提示音量', true, false),
        f('防盗提示音量', true, false),
        f('来电提醒音量', true, false),
        f('低电量提示音量', true, false),
        f('按键音量', true, false),
        f('模式切换音量', true, false),
        f('操作警告音量', true, false)
      ]
    },

    // ========== 驾驶调校 ==========
    {
      id: 'tune',
      name: '驾驶调校',
      features: [
        f('电压设置', true, false),
        f('电池容量设置', true, false),
        f('电流调节', true, false),
        f('机械钥匙快控车', true, false),
        f('机械钥匙控车常规版', true, false),
        f('机械钥匙控车增强版', true, false),
        f('侧撑感应', true, false),
        f('休眠模式', true, false),
        f('侧倾检测', true, false),
        f('电子刹车', true, false),
        f('能量回收', true, false),
        f('启动力度', true, false),
        f('定速巡航', true, false),
        f('边撑断电', true, false),
        f('电量长续航', true, false),
        f('智能补电', true, false)
      ]
    },

    // ========== 骑行模式 ==========
    {
      id: 'mode',
      name: '骑行模式',
      features: [
        f('骑行模式', true, true),
        f('倒车', true, false),
        f('推车', true, false),
        f('动力模式（全速）', true, false),
        f('运动模式（超速）', true, false),
        f('节能模式（限速）', true, false),
        f('开机默认档位', true, false),
        f('TCS 牵引控制', true, false),
        f('HDC 陡坡缓降装置', true, false),
        f('ARB 防翻滚设置', true, false),
        f('赛模式', true, false)
      ]
    },

    // ========== 硬件管理 ==========
    {
      id: 'hardware',
      name: '硬件管理',
      features: [
        f('把加热预约', true, false),
        f('坐加热预约', true, false),
        f('车主转让', true, false),
        f('更换激活仪表', true, false),
        f('更换激活中控', true, false),
        f('更换激活控制器', true, false),
        f('配 NFC 钥匙', true, false),
        f('主电池电量校准', true, false),
        f('低压电量提醒', true, false),
        f('锂电池', true, false),
        f('车辆封存充电模式（锂电）', true, false),
        f('电池保养指南', true, false),
        f('仪表固件升级', true, false),
        f('中控固件升级', true, false),
        f('控制器固件升级', true, false),
        f('BLE 固件升级', true, false),
        f('高频次语音设置', true, false),
        f('低频次语音设置', true, false),
        f('修复/误操作语音设置', true, false)
      ]
    }
  ]
}

const categories = ref<Category[]>(initCategories())
let savedSnapshot = JSON.parse(JSON.stringify(categories.value))

// ==================== 状态 ====================
const activeCatId = ref<string>('sound')
const search = ref('')
const onlyShown = ref(false)
const dirty = ref(false)

// 抽屉
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerFeature = ref<Feature | null>(null)
const drawerOptions = ref<Option[]>([])

// ==================== 计算属性 ====================
const activeCat = computed(() =>
  categories.value.find((c) => c.id === activeCatId.value) ?? categories.value[0]
)

// 分类角标数量（显示该分类下车主展示的功能数）
function catShownCount(cat: Category) {
  return cat.features.filter((f) => f.ownerShown).length
}

// 当前分类过滤：按车主功能存在性 + 搜索 + 仅看已展示
const visibleFeatures = computed(() => {
  const cat = activeCat.value
  if (!cat) return []
  const kw = search.value.trim().toLowerCase()
  return cat.features.filter((ft) => {
    if (!ft.ownerHas) return false
    if (kw && ft.name.toLowerCase().indexOf(kw) === -1) return false
    if (onlyShown.value && !ft.ownerShown) return false
    return true
  })
})

function optionText(ft: Feature) {
  if (!ft.options) return { text: '--', muted: true }
  if (!ft.ownerShown) return { text: '未展示', muted: true }
  const sel = ft.options.filter((o) => o.shown)
  if (!sel.length) return { text: '未选择', muted: false }
  return { text: `已选 ${sel.length} 项：${sel.map((o) => o.name).join('、')}`, muted: false }
}

// ==================== 事件 ====================
// 车主展示开关变更：关闭时非车主同步关闭
function onOwnerSwitchChange(ft: Feature) {
  if (!ft.ownerShown) ft.guestShown = false
  dirty.value = true
}

function markDirty() { dirty.value = true }

function openDrawer(ft: Feature) {
  if (!ft.options) return
  drawerFeature.value = ft
  drawerTitle.value = ft.name
  drawerOptions.value = ft.options.map((o) => ({ ...o }))
  drawerVisible.value = true
}

function closeDrawer() {
  drawerVisible.value = false
  drawerFeature.value = null
  drawerOptions.value = []
}

function confirmDrawer() {
  if (!drawerFeature.value) return
  drawerFeature.value.options = drawerOptions.value.map((o) => ({ ...o }))
  dirty.value = true
  closeDrawer()
  uni.showToast({ title: '已更新，请保存配置', icon: 'none' })
}

function saveAll() {
  savedSnapshot = JSON.parse(JSON.stringify(categories.value))
  dirty.value = false
  uni.showToast({ title: '保存成功', icon: 'success' })
}

function undoAll() {
  categories.value = JSON.parse(JSON.stringify(savedSnapshot))
  dirty.value = false
  uni.showToast({ title: '已撤销修改', icon: 'none' })
}

function copyFromOther() {
  uni.showToast({ title: '请选择来源车型', icon: 'none' })
}
</script>

<template>
  <view class="page">
    <!-- 面包屑 -->
    <view class="breadcrumb">
      <text>车辆管理</text>
      <text class="sep">/</text>
      <text>车型管理</text>
      <text class="sep">/</text>
      <text class="cur">APP 功能</text>
    </view>

    <!-- 页头 -->
    <view class="page-head">
      <view>
        <text class="page-title">APP 功能配置</text>
        <text class="page-sub">配置 APP 中展示的功能及可选项</text>
      </view>
      <wd-button plain type="primary" size="small" @click="copyFromOther">从其他车型复制</wd-button>
    </view>

    <!-- 主布局 -->
    <view class="layout">
      <!-- 左侧菜单 -->
      <view class="sidebar">
        <view class="search-box">
          <wd-icon name="search" size="28rpx" color="#a9aeb8" />
          <input
            v-model="search"
            class="search-input"
            type="text"
            placeholder="搜索功能名称"
            placeholder-style="color:#a9aeb8"
          />
        </view>

        <view
          v-for="cat in categories"
          :key="cat.id"
          class="cat-item"
          :class="{ 'cat-item--active': activeCatId === cat.id }"
          @click="activeCatId = cat.id"
        >
          <view class="cat-left">
            <view v-if="activeCatId === cat.id" class="cat-indicator" />
            <text>{{ cat.name }}</text>
          </view>
          <text class="cat-count">{{ catShownCount(cat) }}</text>
        </view>
      </view>

      <!-- 右侧内容 -->
      <view class="main">
        <view class="main-head">
          <view>
            <text class="main-title">{{ activeCat?.name }}</text>
            <text class="main-count">
              {{ visibleFeatures.length }} 项 / 共 {{ activeCat?.features.length ?? 0 }} 项
            </text>
          </view>
          <view class="check-row" @click="onlyShown = !onlyShown">
            <view class="square-check" :class="{ 'square-check--checked': onlyShown }">
              <view v-if="onlyShown" class="square-check__tick" />
            </view>
            <text class="check-label">仅看已展示</text>
          </view>
        </view>

        <view class="tip-bar">
          <wd-icon name="info" size="28rpx" color="#165DFF" />
          <text>
            开启车主展示后可单独设置是否向非车主展示；关闭车主展示时，非车主同步关闭。具体能力以设备支持为准
          </text>
        </view>

        <!-- 表格：双开关列 -->
        <view class="table table--owner">
          <view class="table-head">
            <text class="col col-name">功能名称</text>
            <text class="col col-switch">车主展示</text>
            <text class="col col-switch">非车主展示</text>
            <text class="col col-opt">可选项</text>
            <text class="col col-op">操作</text>
          </view>

          <block v-if="visibleFeatures.length">
            <view v-for="(ft, i) in visibleFeatures" :key="ft.name + i" class="table-row">
              <text class="col col-name">{{ ft.name }}</text>

              <view class="col col-switch">
                <wd-switch
                  v-model="ft.ownerShown"
                  size="small"
                  color="#165DFF"
                  @change="onOwnerSwitchChange(ft)"
                />
              </view>
              <view class="col col-switch">
                <wd-switch
                  v-model="ft.guestShown"
                  size="small"
                  color="#165DFF"
                  :disabled="!ft.ownerShown"
                  @change="markDirty"
                />
              </view>

              <text class="col col-opt" :class="{ muted: optionText(ft).muted }">
                {{ optionText(ft).text }}
              </text>
              <view class="col col-op">
                <text v-if="ft.options" class="link-btn" @click="openDrawer(ft)">配置</text>
                <text v-else class="muted">--</text>
              </view>
            </view>
          </block>

          <view v-else class="empty-row">
            <text>暂无匹配的功能</text>
          </view>
        </view>

        <text class="table-foot-tip">可选项由接口返回，支持修改音效名称</text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="footer-bar">
      <view class="dirty-tip" v-if="dirty">
        <view class="dirty-dot" />
        <text>有修改未保存</text>
      </view>
      <view class="footer-btns">
        <wd-button
          plain
          type="primary"
          size="small"
          :disabled="!dirty"
          @click="undoAll"
        >撤销修改</wd-button>
        <wd-button type="primary" size="small" @click="saveAll">保存配置</wd-button>
      </view>
    </view>

    <!-- 右侧抽屉弹窗 -->
    <wd-popup
      v-model="drawerVisible"
      position="right"
      custom-style="{ width: '640rpx', height: '100%' }"
      :show-close="false"
    >
      <view class="drawer">
        <view class="drawer-head">
          <view>
            <text class="drawer-title">{{ drawerTitle }}</text>
            <text class="drawer-sub">设置 APP 中可选的音效名称</text>
          </view>
          <view class="drawer-close" @click="closeDrawer">
            <wd-icon name="close" size="36rpx" color="#4e5969" />
          </view>
        </view>

        <view class="drawer-info">
          <wd-icon name="info" size="28rpx" color="#165DFF" />
          <text>仅编辑选项名称与展示状态，不上传音频文件</text>
        </view>

        <view class="drawer-body">
          <view class="drawer-table-head">
            <text class="dh-col dh-opt">选项</text>
            <text class="dh-col dh-name">名称</text>
            <text class="dh-col dh-show">展示</text>
          </view>

          <view v-for="(opt, i) in drawerOptions" :key="i" class="drawer-row">
            <text class="dh-col dh-opt">选项 {{ i + 1 }}</text>
            <input
              v-model="opt.name"
              class="dh-col dh-name-input"
              type="text"
              maxlength="6"
              :placeholder="'音效' + (i + 1)"
              placeholder-style="color:#c9cdd4"
              :class="{ 'dh-name-input--off': !opt.shown }"
            />
            <view class="dh-col dh-show">
              <wd-switch
                v-model="opt.shown"
                size="small"
                color="#165DFF"
              />
            </view>
          </view>
        </view>

        <view class="drawer-foot">
          <text class="foot-hint">名称最多 6 个字符</text>
          <view class="drawer-btns">
            <wd-button plain type="primary" size="small" @click="closeDrawer">取消</wd-button>
            <wd-button type="primary" size="small" @click="confirmDrawer">确认修改</wd-button>
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style lang="scss" scoped>
$primary: #165DFF;
$primary-light: #eef4ff;
$text-main: #1d2129;
$text-2: #4e5969;
$muted: #86909c;
$muted-2: #a9aeb8;
$rule: #e5e6eb;
$warn: #ff7d00;
$bg-page: #f7f8fa;
$radius: 12rpx;

.page {
  min-height: 100vh;
  background: $bg-page;
  padding: 24rpx 32rpx 200rpx;
  box-sizing: border-box;
}

.breadcrumb {
  font-size: 24rpx;
  color: $muted;
  display: flex;
  align-items: center;
  gap: 6rpx;
  .sep { color: $muted-2; }
  .cur { color: $text-main; }
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 24rpx 0 28rpx;
  .page-title { display: block; font-size: 44rpx; font-weight: 700; color: $text-main; }
  .page-sub { display: block; font-size: 24rpx; color: $muted; margin-top: 10rpx; }
}

.layout { display: flex; gap: 24rpx; align-items: flex-start; }

.sidebar {
  width: 360rpx; flex-shrink: 0; background: #fff; border: 2rpx solid $rule;
  border-radius: $radius; padding: 16rpx;
}
.search-box {
  display: flex; align-items: center; gap: 12rpx; height: 68rpx; padding: 0 16rpx;
  border: 2rpx solid $rule; border-radius: 10rpx; margin-bottom: 12rpx;
  .search-input { flex: 1; font-size: 26rpx; color: $text-main; height: 100%; }
}
.cat-item {
  display: flex; justify-content: space-between; align-items: center;
  height: 72rpx; padding: 0 20rpx; border-radius: 10rpx; font-size: 28rpx;
  color: $text-main; position: relative; margin: 4rpx 0;
  &:active { background: #f2f3f5; }
  &--active {
    background: $primary-light; color: $primary; font-weight: 500;
    .cat-indicator { display: block; }
    .cat-count { color: $primary; }
  }
  .cat-left { display: flex; align-items: center; gap: 14rpx; }
  .cat-indicator {
    display: none; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 6rpx; height: 36rpx; background: $primary; border-radius: 0 4rpx 4rpx 0;
  }
  .cat-count { font-size: 22rpx; color: $muted; }
}

.main {
  flex: 1; min-width: 0; background: #fff; border: 2rpx solid $rule;
  border-radius: $radius; padding: 24rpx 28rpx 20rpx;
}
.main-head {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx;
  .main-title { font-size: 32rpx; font-weight: 600; color: $text-main; margin-right: 12rpx; }
  .main-count { font-size: 24rpx; color: $muted; }
}

.check-row {
  display: flex; align-items: center; gap: 12rpx; font-size: 26rpx; color: $text-main;
}
.square-check {
  width: 32rpx; height: 32rpx; border: 2rpx solid #c9cdd4; border-radius: 6rpx;
  background: #fff; display: flex; align-items: center; justify-content: center;
  &--checked { background: $primary; border-color: $primary; }
  &__tick {
    width: 14rpx; height: 8rpx; border-left: 3rpx solid #fff; border-bottom: 3rpx solid #fff;
    transform: rotate(-45deg) translate(0, -2rpx);
  }
}

.tip-bar {
  display: flex; align-items: center; gap: 12rpx; background: $primary-light;
  border-radius: 10rpx; padding: 18rpx 20rpx; font-size: 26rpx; color: $text-2; margin-bottom: 20rpx;
}

.table { font-size: 28rpx; }
.table-head, .table-row {
  display: flex; align-items: center; padding: 20rpx 8rpx; border-bottom: 2rpx solid $rule;
}
.table-head {
  background: #fafbfc; font-size: 26rpx; font-weight: 500; color: $text-2;
}
.table-row { &:active { background: #f7faff; } }

.col {
  padding: 0 12rpx; flex-shrink: 0;
  &-name { flex: 2; min-width: 0; }
  &-switch { width: 160rpx; display: flex; justify-content: center; }
  &-opt { flex: 3; min-width: 0; }
  &-op { width: 120rpx; }
  &.muted { color: $muted-2; }
}
.table--owner .col-switch { width: 170rpx; }

.empty-row { text-align: center; padding: 60rpx 0; color: $muted; font-size: 26rpx; }
.link-btn { color: $primary; font-size: 28rpx; &:active { opacity: 0.7; } }
.table-foot-tip { display: block; font-size: 22rpx; color: $muted-2; margin-top: 14rpx; }
.muted { color: $muted-2; }

.footer-bar {
  position: fixed; bottom: 0; left: 0; right: 0; background: #fff;
  border-top: 2rpx solid $rule; padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
  display: flex; justify-content: space-between; align-items: center; z-index: 50;
  .dirty-tip {
    display: flex; align-items: center; gap: 12rpx; font-size: 26rpx; color: $text-2;
    .dirty-dot { width: 16rpx; height: 16rpx; border-radius: 50%; background: $warn; }
  }
  .footer-btns { display: flex; gap: 16rpx; }
}

.drawer { height: 100%; display: flex; flex-direction: column; background: #fff; }
.drawer-head {
  padding: 36rpx 40rpx 24rpx; display: flex; justify-content: space-between; align-items: flex-start;
  .drawer-title { font-size: 34rpx; font-weight: 600; color: $text-main; display: block; }
  .drawer-sub { font-size: 24rpx; color: $muted; margin-top: 8rpx; display: block; }
  .drawer-close {
    width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center;
    border-radius: 10rpx; &:active { background: #f2f3f5; }
  }
}
.drawer-info {
  margin: 0 40rpx 28rpx; background: $primary-light; border-radius: 10rpx;
  padding: 20rpx 24rpx; display: flex; align-items: center; gap: 12rpx; font-size: 26rpx; color: $text-2;
}
.drawer-body { flex: 1; overflow-y: auto; padding: 0 40rpx; }
.drawer-table-head, .drawer-row {
  display: flex; align-items: center; padding: 16rpx 6rpx;
}
.drawer-table-head { border-bottom: 2rpx solid $rule; font-size: 26rpx; font-weight: 500; color: $text-2; }
.drawer-row { border-bottom: 2rpx solid #f2f3f5; font-size: 28rpx; }

.dh-col {
  padding: 0 8rpx; flex-shrink: 0;
  &-opt { width: 140rpx; color: $text-2; }
  &-name { flex: 1; min-width: 0; }
  &-show { width: 140rpx; display: flex; justify-content: flex-end; }
}
.dh-name-input {
  width: 100%; height: 64rpx; border: 2rpx solid $rule; border-radius: 10rpx;
  padding: 0 16rpx; font-size: 26rpx; color: $text-main; background: #fff;
  &--off { background: #f7f8fa; }
}
.drawer-foot {
  padding: 20rpx 40rpx 36rpx; border-top: 2rpx solid $rule;
  .foot-hint { font-size: 22rpx; color: $muted-2; display: block; margin-bottom: 12rpx; }
  .drawer-btns { display: flex; gap: 16rpx; margin-top: 24rpx; }
}
</style>
