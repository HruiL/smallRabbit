<script setup lang="ts">
import { orderStatus } from "@/contants/orderStatus";
import { useOrderStore } from "@/stores/orderStore";
const orderStore = useOrderStore();
const route = useRoute();
const router = useRouter();
const { getOrderInfoById } = orderStore;
const { orderInfo } = storeToRefs(orderStore);
getOrderInfoById(route.params.id as string);
const cancelOrderInstance = ref();
function cancelOrder(id: string) {
  cancelOrderInstance.value.visible = true;
  cancelOrderInstance.value.id = id;
}
</script>
<template>
  <div class="detail-action" v-if="orderInfo.status == 'success'">
    <div class="state">
      <span class="iconfont icon-order-unpay"></span>
      <p>{{ orderStatus[orderInfo.result.orderState!].label }}</p>
    </div>
    <div class="info">
      <p>订单编号: {{ orderInfo.result.id }}</p>
      <p>下单时间: {{ orderInfo.result.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 待付款 -->
      <template v-if="orderStore.orderInfo.result.orderState === 1">
        <XtxButton
          @click="
            $router.push({
              path: '/member/pay',
              query: { orderId: orderStore.orderInfo.result.id },
            })
          "
          type="primary"
          size="small"
          >立即付款</XtxButton
        >
        <XtxButton
          type="gray"
          size="small"
          @click="cancelOrder(orderStore.orderInfo.result.id!)"
          >取消订单</XtxButton
        >
      </template>
      <!-- 待发货 -->
      <template v-if="orderStore.orderInfo.result.orderState === 2">
        <XtxButton
          type="primary"
          size="small"
          @click="
            router.push(`/checkout/order?id=${orderStore.orderInfo.result.id}`)
          "
          >再次购买</XtxButton
        >
      </template>
      <!-- 待收货 -->
      <template v-if="orderStore.orderInfo.result.orderState === 3">
        <XtxButton type="primary" size="small">确认收货</XtxButton>
        <XtxButton
          type="plain"
          size="small"
          @click="
            router.push(`/checkout/order?id=${orderStore.orderInfo.result.id}`)
          "
          >再次购买</XtxButton
        >
      </template>
      <!-- 待评价 -->
      <template v-if="orderStore.orderInfo.result.orderState === 4">
        <XtxButton
          type="primary"
          size="small"
          @click="
            router.push(`/checkout/order?id=${orderStore.orderInfo.result.id}`)
          "
          >再次购买</XtxButton
        >
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="orderStore.orderInfo.result.orderState === 5">
        <XtxButton
          type="primary"
          size="small"
          @click="
            router.push(`/checkout/order?id=${orderStore.orderInfo.result.id}`)
          "
          >再次购买</XtxButton
        >
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
    </div>
  </div>
  <CancelOrder
    ref="cancelOrderInstance"
    @updateOrderList="orderStore.getOrderInfoById(orderInfo.result.id!)"
  />
</template>

<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
