<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
import { onBeforeRouteUpdate } from "vue-router";
const route = useRoute();
const categoryStore = useCategoryStore();
const { topCategories } = storeToRefs(categoryStore);
const { getTopCategoryById } = categoryStore;
getTopCategoryById(route.params.id as string);
// 监听路由发生变化 当路由发生变化以后重新获取数据
onBeforeRouteUpdate((to) => {
  getTopCategoryById(to.params.id as string);
});
</script>
<template>
  <div
    class="ref-goods"
    v-for="subCategory in topCategories.result[route.params.id as string]?.children"
    :key="subCategory.id"
  >
    <div class="head">
      <h3>- {{ subCategory.name }} -</h3>
      <p class="tag">温暖柔软，品质之选</p>
      <XtxMore />
    </div>
    <div class="body">
      <Gooditem
        v-for="goods in subCategory.goods"
        :key="goods.id"
        :goods="goods"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
