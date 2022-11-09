<script setup lang="ts">
import { useGoodsStore } from "@/stores/goodsStore";

const goodsStore = useGoodsStore();
const { goodsInfo } = storeToRefs(goodsStore);
</script>
<template>
  <XtxBread v-if="goodsInfo.status === 'success'">
    <XtxBreadItem path="/">首页</XtxBreadItem>
    <XtxBreadItem :path="`/category/${goodsInfo.result.categories[1].id}`">{{
      goodsInfo.result.categories[1].name
    }}</XtxBreadItem>
    <XtxBreadItem
      :path="`/category/sub/${goodsInfo.result.categories[1].id}/${goodsInfo.result.categories[0].id}`"
      >{{ goodsInfo.result.categories[0].name }}</XtxBreadItem
    >
    <XtxBreadItem path="/">{{ goodsInfo.result.name }}</XtxBreadItem>
  </XtxBread>
</template>
