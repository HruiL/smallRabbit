<script setup lang="ts">
import { useOrderStore } from "@/stores/orderStore";
import type { Address } from "@/types/Order";
const orderStore = useOrderStore();
// 获取编辑地址的组件实例对象，目的是获取里面的visible属性，点击添加地址来控制组件的显示和隐藏
const addressEditInstance = ref();
// 获取切换地址的组件实例对象
const addressSwitch = ref();
// 要渲染到页面中的收货地址 渲染的优先级：新添加的收货地址 默认收货地址 收货地址列表中的第一项
const priorityAddress = ref<undefined | Address>();
// 新增的收货地址
function onAddressEdit(id: string) {
  const address = orderStore.addressList.result.find((item) => item.id === id);
  if (typeof address !== "undefined") priorityAddress.value = address;
}
// 最终组件中渲染的收货地址
const finalAddress = computed(() => {
  // 1. 返回新添加的地址
  if (typeof priorityAddress.value !== "undefined")
    return priorityAddress.value;
  // 2. 返回用户地址列表里的默认地址
  const defalutAddress = orderStore.addressList.result.find(
    (item) => item.isDefault === 0
  );
  if (typeof defalutAddress !== "undefined") return defalutAddress;
  // 3. 返回用户地址列表里的第一个地址
  if (orderStore.addressList.result.length > 0) {
    return orderStore.addressList.result[0];
  }
});
// 修改收货地址
function alterAddress() {
  // 显示修改地址的弹框
  addressEditInstance.value.visible = true;
  // 设置表单值 要基于原有数据进行修改
  addressEditInstance.value.formValues = {
    ...finalAddress.value,
    // 将0和1转成单选框需要的true和false
    isDefault: finalAddress.value?.isDefault === 0,
  };
  addressEditInstance.value.fullLocation = finalAddress.value?.fullLocation;
  addressEditInstance.value.flag.isAlter = true;
}
// 向外暴露当前收货地址的id(提交订单使用)
defineExpose({ addressId: () => finalAddress.value?.id });
</script>
<template>
  <div class="address">
    <div class="text">
      <div class="none" v-if="!finalAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-else>
        <li><span>收货人：</span>{{ finalAddress?.receiver }}</li>
        <li><span>联系方式：</span>{{ finalAddress?.contact }}</li>
        <li>
          <span>收货地址：</span>{{ finalAddress?.fullLocation }}
          {{ finalAddress?.address }}
        </li>
      </ul>
      <a href="javascript:" @click="alterAddress">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="addressSwitch.visible = true"
        >切换地址</XtxButton
      >
      <ReceivingAddressSwitch
        ref="addressSwitch"
        :final-address="finalAddress!"
        @switch-address="priorityAddress = $event"
      />
      <XtxButton class="btn" @click="addressEditInstance.visible = true"
        >添加地址</XtxButton
      >
      <ReceivingAddressEdit
        ref="addressEditInstance"
        @on-address-edit-success="onAddressEdit"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
