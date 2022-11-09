<script lang="ts" setup>
import { XtxSteps } from "@/components/XtxSteps";
import { XtxStepItem } from "@/components/XtxStepItem";
import { useOrderStore } from "@/stores/orderStore";
const orderStore = useOrderStore();
const route = useRoute();

orderStore.getOrderInfoById(route.params.id as string);
</script>
<template>
  <div class="order-detail-page">
    <!-- 订单状态 -->
    <OrderStatus />
    <!-- 步骤条-->
    <!-- 如果订单的状态是取消，说明订单只是提交了，需要另做处理 -->
    <XtxSteps
      :active="
        orderStore.orderInfo.result.orderState === 6
          ? 1
          : orderStore.orderInfo.result.orderState
      "
    >
      <XtxStepItem
        title="提交订单"
        :desc="orderStore.orderInfo.result.createTime"
      />
      <XtxStepItem
        title="付款成功"
        :desc="orderStore.orderInfo.result.payTime"
      />
      <XtxStepItem
        title="商品发货"
        :desc="orderStore.orderInfo.result.consignTime"
      />
      <XtxStepItem
        title="确认收货"
        :desc="orderStore.orderInfo.result.endTime"
      />
      <XtxStepItem
        title="订单完成"
        :desc="orderStore.orderInfo.result.evaluationTime"
      />
    </XtxSteps>
    <!-- 物流栏 -->
    <DetailLogistics
      v-if="[3, 4, 5].includes(orderStore.orderInfo.result.orderState!)"
    />
    <!-- 订单商品信息 -->
    <DetailOrderGoods />
  </div>
</template>

<style scoped lang="less">
.order-detail-page {
  background: #fff;
  height: 100%;
}
</style>
