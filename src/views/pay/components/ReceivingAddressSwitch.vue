<script setup lang="ts">
import { useOrderStore } from "@/stores/orderStore";
import type { Address } from "@/types/Order";

const visible = ref(false);
const orderStore = useOrderStore();
defineExpose({ visible });
const emit = defineEmits<{ (e: "switchAddress", address: Address): void }>();
const props = defineProps<{ finalAddress: Address }>();
</script>
<template>
  <XtxDialog title="更换收货地址" v-model:visible="visible">
    <template #body>
      <div class="address-switch">
        <div
          :class="['text', 'item', item.id === finalAddress.id ? 'active' : '']"
          v-for="item in orderStore.addressList.result"
          :key="item.id"
          @click="
            emit('switchAddress', item);
            visible = false;
          "
        >
          <ul>
            <li><span>收货人：</span>{{ item.receiver }}</li>
            <li><span>联系方式：</span>{{ item.contact }}</li>
            <li>
              <span>收货地址：</span>{{ item.fullLocation + item.address }}
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <XtxButton
        @click="visible = false"
        type="primary"
        style="margin-right: 20px"
        >取消</XtxButton
      >
    </template>
  </XtxDialog>
</template>

<style scoped lang="less">
.address-switch {
  height: 478px;
  overflow-y: auto;
  text-align: left;
}
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
