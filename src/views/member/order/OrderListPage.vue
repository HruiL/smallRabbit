<script setup lang="ts">
import { XtxTabPane } from "@/components/XtxTabPane";
import { XtxTabs } from "@/components/XtxTabs";
import { orderStatus } from "@/contants/orderStatus";
import { useOrderStore } from "@/stores/orderStore";
import type { OrderState } from "@/types/Order";
const name = ref("all");
const orderStore = useOrderStore();
const { myOrderList } = storeToRefs(orderStore);
// 把参数变成状态去传递的好处：可以监听参数的变化，当参数发生变化，我们可以重新发送请求获取数据
const reqParams = ref<{
  page: number;
  pageSize: number;
  orderState: OrderState;
}>({ page: 1, pageSize: 10, orderState: 0 });
const cancelInstance = ref();
const logisticsInstance = ref();
function cancelFn(id: string) {
  cancelInstance.value.visible = true;
  cancelInstance.value.id = id;
}
async function viewLogisticsFn(id: string) {
  logisticsInstance.value.visible = true;
  await orderStore.viewLogistics(id);
}
watchEffect(() => orderStore.getMyOrderList(reqParams.value));
</script>
<template>
  <div class="member-order">
    <XtxTabs v-model:name="name" @onChecked="reqParams.orderState = $event">
      <XtxTabPane
        v-for="item in orderStatus"
        :name="item.name"
        :label="item.label"
        :key="item.name"
      >
        <div class="order-list">
          <div
            class="loading"
            v-if="myOrderList[reqParams.orderState].status === 'loading'"
          ></div>
          <div
            class="none"
            v-if="myOrderList[reqParams.orderState].result === 0"
          >
            暂无数据
          </div>
          <OrderItem
            v-for="good in myOrderList[reqParams.orderState].result.items"
            :good="good"
            :key="good.id"
            @onCancelHandler="cancelFn"
            @updateOrderList="orderStore.getMyOrderList(reqParams)"
            @onViewLogistics="viewLogisticsFn"
          ></OrderItem></div
      ></XtxTabPane>
    </XtxTabs>
  </div>
  <!-- 取消订单组件 -->
  <CancelOrder
    ref="cancelInstance"
    @updateOrderList="orderStore.getMyOrderList(reqParams)"
  />
  <!-- 物流信息组件 -->
  <OrderLogistics ref="logisticsInstance" />
</template>
<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
  position: relative;
  .order-list {
    background: #fff;
    padding: 20px;
    position: relative;
    .loading {
      height: calc(100% - 60px);
      width: 100%;
      min-height: 400px;
      position: absolute;
      left: 0;
      top: 60px;
      background: rgba(255, 255, 255, 0.9) url(@/assets/images/loading.gif)
        no-repeat center 18%;
    }
    .none {
      height: 400px;
      text-align: center;
      line-height: 400px;
      color: #999;
      background: rgba(255, 255, 255, 0.9);
    }
  }
}
</style>
