<script setup lang="ts">
import { useOrderStore } from "@/stores/orderStore";

const orderStore = useOrderStore();
const route = useRoute();
orderStore.viewLogistics(route.params.id as string);
const orderLogistics = ref();
function viewLogistics() {
  orderLogistics.value.visible = true;
}
</script>
<template>
  <div
    class="detail-logistics"
    v-if="orderStore.logistics.status === 'success'"
  >
    <p>
      <span>{{ orderStore.logistics.result.list![0].time }}</span>
      <span>{{ orderStore.logistics.result.list![0].text }}</span>
    </p>
    <a href="javascript:" @click="viewLogistics">查看物流</a>
  </div>
  <OrderLogistics ref="orderLogistics" />
</template>

<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
