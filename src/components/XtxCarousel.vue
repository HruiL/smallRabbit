<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    // // 轮播图数据
    // carousels: Banner[];
    count: number;
    // 是否自动轮播
    autoPlay?: boolean;
    // 自动轮播间隔时间
    duration?: number;
  }>(),
  {
    autoPlay: true,
    duration: 3000,
  }
);
// 用于记录当前显示着的轮播图的索引
let current = ref(0);
// 用于存储定时器
let timer: number | undefined;
// 控制轮播图索引
function toggle(step: number = 1): void {
  // 计算目标索引
  let nextIndex = current.value + step;
  // 如果索引范围溢出边界，限制索引范围为边界值，否则索引值正常，赋值即可
  // 左边溢出
  if (nextIndex < 0) {
    current.value = props.count - 1;
    // 右边溢出
  } else if (nextIndex > props.count - 1) {
    current.value = 0;
    // 正常范围
  } else {
    current.value = nextIndex;
  }
}
// 开始自动轮播
function startAutoPlay() {
  // 清空上一次的定时器
  clearInterval(timer);
  // 开始新的定时器
  // 开启的条件是：要自动轮播，且数组的长度>1
  if (props.autoPlay && props.count > 1) {
    timer = setInterval(toggle, props.duration);
  }
}
// 停止自动轮播
function stopAutoPlay() {
  clearInterval(timer);
}
// 组件挂载完成后，开始自动轮播
onMounted(startAutoPlay);
// 组件卸载后，清除轮播定时器
onUnmounted(stopAutoPlay);
</script>
<template>
  <div
    class="xtx-carousel"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, index) in count"
        :key="index"
        :class="{ fade: current === index }"
      >
        <slot :name="`default-${index}`"></slot>
      </li>
    </ul>
    <a href="javascript:" class="carousel-btn prev" @click="toggle(-1)"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <a href="javascript:" class="carousel-btn next" @click="toggle(1)"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <div class="carousel-indicator">
      <span
        v-for="(item, index) in count"
        :key="index"
        :class="{ active: current === index }"
        @click="current = index"
      ></span>
    </div>
  </div>
</template>

<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
