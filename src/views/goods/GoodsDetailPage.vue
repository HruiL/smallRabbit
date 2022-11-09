<script setup lang="ts">
import { useGoodsStore, type Data } from "@/stores/goodsStore";
import { useCartStore } from "@/stores/cartStore";
import Message from "@/utils/Message";
import { AxiosError } from "axios";
const goodsStore = useGoodsStore();
const cartStore = useCartStore();
const { goodsInfo } = storeToRefs(goodsStore);
const { getGoodsInfo, updateGoods, getRelevantGoods, getHotSaleGoods } =
  goodsStore;
const { addProductToCart } = cartStore;
const route = useRoute();
getGoodsInfo(route.params.id as string);
// 用户选择的skuId
const skuId = ref<string | undefined>();
// 用户选择的商品数量
const count = ref(1);
getRelevantGoods();
getHotSaleGoods(route.params.id as string, 1);
// 将商品加入到购物车
async function addToCart() {
  // 判断用户是否选择了完整的规格
  if (typeof skuId.value !== "undefined") {
    // 发送请求 捕获错误
    try {
      // 发送请求将商品加入到购物车
      await addProductToCart(skuId.value, count.value);
      // 加入成功的消息提示
      Message({ type: "success", msg: "成功将商品加入购物车" });
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          Message({ type: "error", msg: "请先登录" });
        }
      } else {
        Message({ type: "error", msg: "商品加入购物车失败" });
      }
    }
  } else {
    Message({ type: "warn", msg: "请选择商品规格" });
  }
}
</script>
<template>
  <div class="xtx-goods-page">
    <div class="container" v-if="goodsInfo.status === 'success'">
      <!-- 面包屑 -->
      <GoodsBread />
      <!-- 商品信息 -->
      <div class="goods-info">
        <!-- 左侧 -->
        <div class="media">
          <GoodsImages />
          <GoodsSales />
        </div>
        <!-- 右侧 -->
        <div class="spec">
          <GoodsInfo />
          <GoodsSku
            :specs="goodsInfo.result.specs"
            :skus="goodsInfo.result.skus"
            @complete="
              updateGoods($event);
              skuId = $event.skuId;
            "
            @unComplete="skuId = undefined"
          />
          <!-- 商品数量 -->
          <XtxNumberBox
            :max="goodsInfo.result.inventory"
            v-model:count="count"
            label="数量"
          />
          <!-- 按钮 -->
          <XtxButton type="primary" style="margin-top: 20px" @click="addToCart"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 同类商品 -->
      <GoodsRelevant :goodsId="goodsInfo.result.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTab />
        </div>
        <!-- 24热榜 -->
        <div class="goods-aside">
          <GoodsHot :id="goodsInfo.result.id" :type="1" />
          <GoodsHot :id="goodsInfo.result.id" :type="2" />
          <GoodsHot :id="goodsInfo.result.id" :type="3" />
        </div>
      </div>
    </div>
    <div class="container loading-container" v-else>
      <img src="@/assets/images/loading.gif" />
    </div>
  </div>
</template>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  background: #fff;
}
</style>
