<script setup lang="ts">
const props = defineProps<{ loading: boolean; finished: boolean }>();
const emit = defineEmits<{ (e: "infinite"): void }>();
// 被监听的元素
const target = ref();
// 监听元素是否进入可视区
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  // 如果元素进入可视区域，没有正在加载，还有更多数据可以加载 再去通知父组件加载数据
  if (isIntersecting && !props.loading && !props.finished) {
    emit("infinite");
  }
});
</script>
<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(@/assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(@/assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
