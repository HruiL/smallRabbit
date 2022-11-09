<script setup lang="ts">
import type { GoodsRequestParams } from "@/types/Goods";
import { onBeforeRouteUpdate } from "vue-router";
// 这个组件触发自定义事件，将排序条件传给父组件
// defineEmits 泛型定义的是emit方法的类型
const emit = defineEmits<(e: "onChanged", params: SortParams) => void>();
// 排序条件接口规范
type SortParams = Pick<
  GoodsRequestParams,
  "sortField" | "sortMethod" | "inventory" | "onlyDiscount"
>;
// 排序条件
const initialSortParams: SortParams = {
  sortField: "",
  sortMethod: "",
  inventory: false,
  onlyDiscount: false,
};
// 排序条件
const sortParams = ref<SortParams>({ ...initialSortParams });
// 更新排序条件
function updateSortParams(params: Partial<SortParams>) {
  // 更新筛选条件
  sortParams.value = {
    ...sortParams.value,
    ...params,
  };
  // 如果用户点击的是价格 切换升序和降序
  if (params.sortField === "price") {
    sortParams.value = {
      ...sortParams.value,
      sortMethod: sortParams.value.sortMethod === "desc" ? "asc" : "desc",
    };
    console.log(sortParams.value.sortMethod);
    // 如果点击的不是价格,清空价格选项的状态
  } else if (
    params.sortField === "" ||
    params.sortField === "publishTime" ||
    params.sortField === "orderNum" ||
    params.sortField === "evaluateNum"
  ) {
    sortParams.value = {
      ...sortParams.value,
      sortMethod: "",
    };
  }
  //   console.log(sortParams.value);
  // 通过自定义事件 将筛选的条件传递到父组件
  emit("onChanged", sortParams.value);
}
// 路由发生变化，清空排序条件 恢复到初始值
onBeforeRouteUpdate(() => {
  sortParams.value = { ...initialSortParams };
});
</script>
<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        href="javascript:"
        :class="{ active: sortParams.sortField === '' }"
        @click="updateSortParams({ sortField: '' })"
        >默认排序</a
      >
      <a
        href="javascript:"
        @click="updateSortParams({ sortField: 'publishTime' })"
        :class="{ active: sortParams.sortField === 'publishTime' }"
        >最新商品</a
      >
      <a
        href="javascript:"
        @click="updateSortParams({ sortField: 'orderNum' })"
        :class="{ active: sortParams.sortField === 'orderNum' }"
        >最高人气</a
      >
      <a
        href="javascript:"
        @click="updateSortParams({ sortField: 'evaluateNum' })"
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        >评论最多</a
      >
      <a
        href="javascript:"
        @click="updateSortParams({ sortField: 'price' })"
        :class="{ active: sortParams.sortField === 'price' }"
      >
        价格排序
        <i
          class="arrow up"
          :class="{ active: sortParams.sortMethod === 'asc' }"
        ></i>
        <i
          class="arrow down"
          :class="{ active: sortParams.sortMethod === 'desc' }"
        ></i>
      </a>
    </div>
    <div class="check">
      <XtxCheckbox
        :checked="sortParams.inventory"
        @onChange="updateSortParams({ inventory: $event })"
        >仅显示有货商品</XtxCheckbox
      >
      <XtxCheckbox
        :checked="sortParams.onlyDiscount"
        @onChange="updateSortParams({ onlyDiscount: $event })"
        >仅显示特惠商品</XtxCheckbox
      >
    </div>
  </div>
</template>

<style scoped lang="less">
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: #27ba9b;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: #27ba9b;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
