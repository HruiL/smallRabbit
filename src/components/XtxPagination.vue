<script setup lang="ts">
const props = withDefaults(
  defineProps<{ page: number; pages: number; maxVisiblePages?: number }>(),
  {
    maxVisiblePages: 5,
  }
);
const emit = defineEmits<{ (e: "update:page"): void }>();
const page = useVModel(props, "page", emit);
// 当前页
// const page = ref(5);
// 总页数
// const pages = ref(10);
// 页面中最多显示的页码数量
// const maxVisiblePages = ref(5);
// 计算渲染分页组件需要的页码信息
// 显示的开始页码，结束页码，页码值数组
const pageInfo = computed(() => {
  // 页码偏移量
  const pageOffset = Math.floor(props.maxVisiblePages / 2);
  // 计算在页面中要显示的开始页码和结束页码
  let start = page.value - pageOffset;
  let end = start + props.maxVisiblePages - 1;
  // 限制显示着的开始页码的范围
  if (start < 1) {
    start = 1;
    let end_temp = start + props.maxVisiblePages - 1;
    end = end_temp > props.pages ? props.pages : end_temp;
  }
  // 限制显示着的结束页码的范围
  if (end > props.pages) {
    end = props.pages;
    let start_temp = end - props.maxVisiblePages + 1;
    start = start_temp < 1 ? 1 : start_temp;
  }
  // 用于存储页码值的数组
  const pagesArray = [];
  for (let i = start; i <= end; i++) {
    pagesArray.push(i);
  }

  return { start, end, pagesArray };
});
</script>
<template>
  <div class="xtx-pagination">
    <a href="javascript:" v-if="page > 1" @click="page--">上一页</a>
    <span v-if="pageInfo.start > 1">...</span>
    <a
      href="javascript:"
      v-for="item in pageInfo.pagesArray"
      @click="page = item"
      :class="{ active: page === item }"
      >{{ item }}</a
    >
    <span v-if="pageInfo.end < pages">...</span>
    <a href="javascript:" v-if="page < pages" @click="page++">下一页</a>
  </div>
</template>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
