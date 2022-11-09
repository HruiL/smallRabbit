<script setup lang="ts">
import { cancelReason } from "@/contants/cancelReason";
import { useOrderStore } from "@/stores/orderStore";
import Message from "@/utils/Message";
// 记录用户选择的取消订单的原因
const selected = ref("");
// 控制弹框的显示和隐藏
const visible = ref(false);
// 订单id
const id = ref<string | undefined>();
const orderStore = useOrderStore();
const emit = defineEmits<{
  (e: "updateOrderList"): void;
}>();
// 点击确定
async function confirmCancel() {
  // 如果没有选择取消订单的原因,阻止代码向下执行发请求
  if (!selected.value) {
    Message({ type: "warn", msg: "请选择取消订单的原因" });
    return;
  }
  try {
    // 发送请求，取消订单
    await orderStore.cancelOrder(id.value!, selected.value);
    // 通知父组件更新订单
    emit("updateOrderList");
    Message({ type: "success", msg: "订单取消成功" });
    // 关闭弹框
    visible.value = false;
  } catch (e) {
    Message({ type: "success", msg: "订单取消失败" });
  }
}
// 导出visible id
defineExpose({ visible, id });
</script>
<template>
  <XtxDialog title="取消订单" v-model:visible="visible">
    <!-- 组件内容 -->
    <template #body>
      <div class="cancel-info">
        <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
        <p class="tip">请选择取消订单的原因（必选）：</p>
        <div class="btn">
          <a
            v-for="reason in cancelReason"
            :key="reason"
            :class="{ active: reason === selected }"
            @click="selected = reason"
            >{{ reason }}</a
          >
        </div>
      </div>
    </template>
    <!-- 按钮操作 -->
    <template #footer>
      <XtxButton @click="visible = false" type="gray" style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton type="primary" @click="confirmCancel">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<style lang="less" scoped>
.xtx-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 250px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
