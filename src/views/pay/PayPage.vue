<script setup lang="ts">
import useCountdown from "@/logics/useCountdown";
import { useOrderStore } from "@/stores/orderStore";
import { XTXRequestManager } from "@/utils/XTXRequestManager";
import dayjs from "dayjs";
const orderStore = useOrderStore();
const { getOrderInfoById } = orderStore;
const { orderInfo } = storeToRefs(orderStore);
const route = useRoute();
const router = useRouter();
getOrderInfoById(route.query.orderId as string);
const { start, count } = useCountdown();
// 监听订单的获取状态
watch(
  () => orderInfo.value.status,
  (value) => {
    // 如果订单获取成功
    if (value === "success") {
      // 获取订单支付状态
      const orderState = orderInfo.value.result.orderState;
      // 判断是否为待支付状态
      if (orderState === 1) {
        // 获取支付订单的倒计时
        const countDown = orderInfo.value.result.countdown;
        if (typeof countDown !== "undefined" && countDown! > 0) {
          // 开启到计时
          start(countDown!);
        }
        // 如果已支付
      } else {
        // 调转到订单页面
        router.push("/member/order");
      }
    }
  }
);
// 监听倒计时，倒计时结束之后跳转到订单列表页面
watch(count, () => {
  if (count.value == 0) {
    router.replace("/member/order");
  }
});
// 支付回跳地址
const redirect = encodeURIComponent("http://www.corho.com:8080/#/pay/callback");
// 支付地址
const payUrl = `${XTXRequestManager.baseUrl}/pay/aliPay?orderId=${route.query.orderId}&redirect=${redirect}`;
const paying = ref(false);
</script>
<template>
  <div class="xtx-pay-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem path="/">首页</XtxBreadItem>
        <XtxBreadItem path="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>支付订单</XtxBreadItem>
      </XtxBread>
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>
            支付还剩 <span>{{ dayjs.unix(count).format("mm分ss秒") }}</span
            >, 超时后将取消订单
          </p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ orderInfo.result.payMoney }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:"></a>
          <a
            :class="[
              'btn',
              'alipay',
              orderInfo.result.payChannel === 1 ? 'active' : '',
            ]"
            :href="payUrl"
            target="_blank"
            @click="paying = true"
          ></a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:">招商银行</a>
          <a class="btn" href="javascript:">工商银行</a>
          <a class="btn" href="javascript:">建设银行</a>
          <a class="btn" href="javascript:">农业银行</a>
          <a class="btn" href="javascript:">交通银行</a>
        </div>
      </div>
    </div>
  </div>
  <XtxDialog title="正在支付..." v-model:visible="paying">
    <template #body>
      <div class="pay-wait">
        <img src="@/assets/images/load.gif" alt="" />
        <div>
          <p>如果支付成功：</p>
          <RouterLink :to="`/member/order/${orderStore.orderInfo.result.id}`"
            >查看订单详情></RouterLink
          >
          <p>如果支付失败：</p>
          <RouterLink to="/">查看相关疑问></RouterLink>
        </div>
      </div>
    </template>
  </XtxDialog>
</template>

<style scoped lang="less">
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .tip {
    padding-left: 10px;
    flex: 1;
    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: @priceColor;
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;
    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: @xtxColor;
    }
    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
        no-repeat center / contain;
    }
    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
        no-repeat center / contain;
    }
  }
}
.pay-wait {
  display: flex;
  justify-content: space-around;
  p {
    margin-top: 30px;
    font-size: 14px;
  }
  a {
    color: @xtxColor;
  }
}
</style>
