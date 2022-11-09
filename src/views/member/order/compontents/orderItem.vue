<script setup lang="ts">
import { orderStatus } from "@/contants/orderStatus";
import useCountdown from "@/logics/useCountdown";
import type { OrderResponse } from "@/types/Order";
import { useOrderStore } from "@/stores/orderStore";
import dayjs from "dayjs";
import Message from "@/utils/Message";
import MyConfirm from "@/utils/MyConfirm";
const orderStore = useOrderStore();
const props = defineProps<{ good: OrderResponse }>();
const emit = defineEmits<{
  (e: "onCancelHandler"): void;
  (e: "updateOrderList"): void;
  (e: "onViewLogistics", id: string): void;
}>();
const { start, count } = useCountdown();
if (props.good.orderState === 1) {
  start(props.good.countdown);
}
async function deleteOrderFn(id: string) {
  try {
    await MyConfirm({ content: "您确定要删除订单吗" });
  } catch (e) {
    return;
  }
  await orderStore.deleteOrder([id]);
  emit("updateOrderList");
}
// 确认收货
async function confirmReceiveFn(id: string) {
  await orderStore.confirmReceiveGoods(id);
  emit("updateOrderList");
}
// 查看物流
function viewLogisticsFn(id: string) {
  emit("onViewLogistics", id);
}
</script>
<template>
  <div class="order-item">
    <div class="head">
      <span>下单时间: {{ good.createTime }}</span>
      <span>订单编号: {{ good.id }}</span>
      <span class="down-time" v-if="good.orderState === 1">
        <i class="iconfont icon-down-time"></i>
        <b>付款截止: {{ dayjs.unix(count).format("mm分ss秒") }}</b>
      </span>
      <a
        href="javascript:"
        class="del"
        v-if="[5, 6].includes(good.orderState)"
        @click="deleteOrderFn(good.id)"
        >删除</a
      >
    </div>
    <div class="body">
      <div class="column goods">
        <ul>
          <li v-for="item in good.skus" :key="item.id">
            <a class="image" href="javascript:">
              <img :src="item.image" alt="" />
            </a>
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="attr ellipsis">
                <span>{{ item.attrsText }} </span>
              </p>
            </div>
            <div class="price">¥{{ item.curPrice }}</div>
            <div class="count">x{{ item.quantity }}</div>
          </li>
        </ul>
      </div>
      <div class="column state">
        <p>{{ orderStatus[good.orderState].label }}</p>
        <a
          v-if="good.orderState === 3"
          href="javascript:"
          class="green"
          @click="viewLogisticsFn(good.id)"
          >查看物流</a
        >
        <a v-if="good.orderState === 4" href="javascript:" class="green"
          >评价商品</a
        >
        <a v-if="good.orderState === 5" href="javascript:" class="green"
          >查看评价</a
        >
      </div>
      <div class="column amount">
        <p class="red">¥{{ good.payMoney }}</p>
        <p>(含运费: ¥{{ good.postFee }})</p>
        <p>在线付款</p>
      </div>
      <div class="column action">
        <XtxButton type="primary" size="small" v-if="good.orderState === 1"
          >立即付款</XtxButton
        >
        <XtxButton
          type="primary"
          size="small"
          v-if="good.orderState === 3"
          @click="confirmReceiveFn(good.id)"
          >确认收货</XtxButton
        >
        <p>
          <RouterLink :to="`/member/order/${good.id}`">查看详情</RouterLink>
        </p>
        <p>
          <a
            href="javascript:"
            v-if="good.orderState === 1"
            @click="$emit('onCancelHandler', good.id)"
            >取消订单</a
          >
        </p>
        <p>
          <a href="javascript:" v-if="[2, 3, 4, 5].includes(good.orderState)"
            >再次购买</a
          >
        </p>
        <p>
          <a href="javascript:" v-if="[4, 5].includes(good.orderState)"
            >申请售后</a
          >
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
