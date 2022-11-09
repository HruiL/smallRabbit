<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import type { SubmitOrderObject } from "@/types/Order";
import Message from "@/utils/Message";
const orderStore = useOrderStore();
const cartStore = useCartStore();
const { orderOfCreate } = storeToRefs(orderStore);
const router = useRouter();
const route = useRoute();
// 判断路径参数订单id是否存在，如果存在则是再次购买发送再次购买的请求，如果不存在则直接发送创建订单的请求
if (route.query.id) {
  orderStore.againBuy(route.query.id as string);
} else {
  orderStore.createOrder();
}
// 获取收货地址实例对象
const receiveAddressInstance = ref();
// 提交订单
async function submitOrder() {
  // 定义发送订单所需要的参数
  const order: SubmitOrderObject = {
    goods: orderOfCreate.value.result.goods!.map((item) => ({
      skuId: item.skuId,
      count: item.count,
    })),
    addressId: receiveAddressInstance.value.addressId(),
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: "",
  };
  // 如果没有选择收货地址
  if (!order.addressId) {
    Message({ type: "warn", msg: "请选择收货地址" });
  }
  // 发送请求，捕获错误
  try {
    const response = await orderStore.submitOrder(order);
    Message({ type: "success", msg: "订单提交成功" });
    // 提交完订单之后，更新购物车
    cartStore.getCarts();
    router.replace({
      path: "/checkout/pay",
      query: { orderId: response.id },
    });
  } catch (e) {
    Message({ type: "error", msg: "订单提交失败" });
  }
}
</script>
<template>
  <div class="xtx-pay-checkout-page" v-if="orderOfCreate.status === 'success'">
    <div class="container">
      <XtxBread>
        <XtxBreadItem path="/">首页</XtxBreadItem>
        <XtxBreadItem path="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>填写订单</XtxBreadItem>
      </XtxBread>
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <ReceivingAddress ref="receiveAddressInstance" />
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th>商品信息</th>
                <th>单价</th>
                <th>数量</th>
                <th>小计</th>
                <th>实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderOfCreate.result.goods" :key="item.id">
                <td>
                  <a href="javascript:" class="info">
                    <img :src="item.picture" alt="" />
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ item.price }}</td>
                <td>{{ item.count }}</td>
                <td>&yen;{{ item.totalPrice }}</td>
                <td>&yen;{{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:"
            >不限送货时间：周一至周日</a
          >
          <a class="my-btn" href="javascript:">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:">在线支付</a>
          <a class="my-btn" href="javascript:">货到付款</a>
          <span style="color: #999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ orderOfCreate.result.summary!.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ orderOfCreate.result.summary!.totalPrice }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ orderOfCreate.result.summary!.postFee }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">
                ¥{{ orderOfCreate.result.summary!.totalPayPrice }}
              </dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XtxButton @click="submitOrder" type="primary">提交订单</XtxButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.xtx-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}
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
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,
  &:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
