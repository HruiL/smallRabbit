<script setup lang="ts">
import { useGoodsStore } from "@/stores/goodsStore";
import GoodsCommentVue from "./GoodsComment.vue";
import GoodsDetailVue from "./GoodsDetail.vue";

const activeComponent = ref<"GoodsDetail" | "GoodsComment">("GoodsDetail");
const goodsStore = useGoodsStore();
const { evaluateInfo } = storeToRefs(goodsStore);
// const { getEvaluateInfo } = goodsStore;
// // 获取路由信息
// const route = useRoute();
// // 发送请求获取评价头部信息
// getEvaluateInfo(route.params.id as string);
</script>
<template>
  <div class="goods-tabs">
    <nav>
      <a
        :class="{ active: activeComponent === 'GoodsDetail' }"
        href="javascript:"
        @click="activeComponent = 'GoodsDetail'"
        >商品详情</a
      >
      <a
        :class="{ active: activeComponent === 'GoodsComment' }"
        href="javascript:"
        @click="activeComponent = 'GoodsComment'"
        >商品评价<span>({{ evaluateInfo.result.evaluateCount }})</span></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <!-- <component
      :is="activeComponent === 'GoodsDetail' ? GoodsDetailVue : GoodsCommentVue"
    ></component> -->
    <GoodsDetail v-show="activeComponent === 'GoodsDetail'" />
    <GoodsComment v-show="activeComponent === 'GoodsComment'" />
  </div>
</template>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
