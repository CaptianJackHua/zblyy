<script setup lang="ts">
import { computed } from 'vue';
import { icons } from '@/utils/icons';

interface Props {
  name: string;
  /** 图标尺寸，数字按 rpx 处理，也可传 CSS 值（如 '32px'）；不传则跟随父级 font-size(1em) */
  size?: number | string;
  /** 描边颜色，默认继承父级 color */
  color?: string;
  strokeWidth?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 0,
  color: '',
  strokeWidth: 1.8
});

const inner = computed(() => icons[props.name] || icons.sparkles);

const styleText = computed(() => {
  const parts: string[] = [];
  if (props.size) {
    const v = typeof props.size === 'number' ? `${props.size}rpx` : props.size;
    parts.push(`width:${v}`, `height:${v}`, `font-size:${v}`);
  }
  if (props.color) parts.push(`color:${props.color}`);
  return parts.join(';');
});
</script>

<template>
  <svg
    class="zb-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :style="styleText"
    v-html="inner"
  />
</template>

<style lang="scss">
.zb-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: 32rpx;
  vertical-align: middle;
  flex-shrink: 0;
  color: inherit;
}
</style>
