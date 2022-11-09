<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
import type { GoodsRequestParams } from "@/types/Goods";
import { onBeforeRouteUpdate } from "vue-router";
const categoryStore = useCategoryStore();
const route = useRoute();
const { categoryGoods } = storeToRefs(categoryStore);
const { getCategoryGoods } = categoryStore;
// 用于存储筛选条件
let filterParams = {};
// 用于存储排序条件
let sortParams = {};
// 用于存储分页数据
let pageParams = { page: 1, pageSize: 2 };
// 用于更新筛选条件
function updateFilterParams(params: Partial<GoodsRequestParams>) {
  filterParams = params;
}
// 用于更新排序条件
function updateSortParams(params: Partial<GoodsRequestParams>) {
  sortParams = params;
}
// 获取请求参数
function getReqParams() {
  return { ...filterParams, ...sortParams, ...pageParams };
}
// 发送请求获取商品列表
function sendRequest() {
  // 当筛选、排序条件发生变化，重置页码为1，重置status的状态loading
  pageParams.page = 1;
  categoryGoods.value.status = "loading";
  getCategoryGoods(route.params.sub as string, getReqParams());
}
// 加载更多商品
function loadMore() {
  // 页码累加
  pageParams.page += 1;
  // 发送请求获取商品
  getCategoryGoods(route.params.sub as string, getReqParams());
}
// 初始获取商品列表数据
sendRequest();
// 监听路由变化
onBeforeRouteUpdate((to) => {
  filterParams = {};
  sortParams = {};
  pageParams.page = 1;
  categoryGoods.value.status = "loading";
  getCategoryGoods(to.params.sub as string, getReqParams());
});
</script>
<template>
  <div class="container">
    <SubCategoryBread />
    <!-- 当筛选条件发生变化时，重新获取商品数据 -->
    <SubCategoryFilter
      @onChanged="
        updateFilterParams($event);
        sendRequest();
      "
    />
    <div class="goods-list">
      <!-- 当排序条件发生变化时，重新获取商品数据 -->
      <SubCategorySort
        @onChanged="
          updateSortParams($event);
          sendRequest();
        "
      />
      <!-- 将商品列表传递到下层组件 -->
      <GoodList :goodsList="categoryGoods.result.items" />
      <!-- 记载更多 -->
      <XtxInfiniteLoading
        @infinite="loadMore"
        :loading="categoryGoods.status === 'loading'"
        :finished="categoryGoods.status === 'finished'"
      />
    </div>
  </div>
</template>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>
