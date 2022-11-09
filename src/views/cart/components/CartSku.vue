<script setup lang="ts">
import { CartAPI } from "@/api/CartAPI";
import { useCartStore } from "@/stores/cartStore";
import type { Sku, Spec } from "@/types/Goods";
import type { Status } from "@/types/Status";
import GoodsSku from "@/views/goods/components/GoodsSku.vue";

const cartStore = useCartStore();
const props = defineProps<{ skuId: string; attrsText: string }>();
// 控制规格下拉框的显示和隐藏的变量
const visible = ref(false);
// 规格下拉框显示
function show() {
  visible.value = true;
  getSkuInfo(props.skuId);
}
// 规格下拉框隐藏
function hide() {
  visible.value = false;
}
// 切换规格下拉框的显示和隐藏
function toggle() {
  visible.value ? hide() : show();
}
// 获取下拉框的目标元素
const target = ref();
// 在组件外部点击时 隐藏下拉框
onClickOutside(target, hide);
// 保存商品规格
const skuInfo = ref<undefined | { specs: Spec[]; skus: Sku[] }>();
const status = ref<Status>();
// 获取商品规格
async function getSkuInfo(id: string) {
  status.value = "loading";
  try {
    const response = await CartAPI.getSkuInfo(id);
    skuInfo.value = response.result;
    status.value = "success";
  } catch (e) {
    status.value = "error";
  }
}
// 存储用户选择的商品规格
const selectedSku = ref<string | undefined>();
const $ = getCurrentInstance();
// 修改商品规格
async function alterSku() {
  if (typeof selectedSku.value !== "undefined") {
    try {
      await cartStore.alterSku(props.skuId, selectedSku.value);
      $?.proxy?.$message({ type: "success", msg: "商品规格修改成功" });
    } catch (e) {
      $?.proxy?.$message({ type: "error", msg: "商品规格修改失败" });
    }
  } else {
    $?.proxy?.$message({ type: "warn", msg: "请选择商品规格" });
  }
}
</script>

<template>
  <div class="cart-sku">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" ref="target" v-if="visible">
      <div class="loading" v-if="status === 'loading'"></div>
      <GoodsSku
        v-if="status === 'success'"
        :specs="skuInfo!.specs"
        :skus="skuInfo!.skus"
        :skuId="skuId"
        @complete="selectedSku = $event.skuId"
        @unComplete="selectedSku = undefined"
      />
      <XtxButton
        type="primary"
        size="mini"
        style="margin-left: 60px"
        @click="alterSku"
        >确定</XtxButton
      >
    </div>
  </div>
</template>

<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(@/assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
