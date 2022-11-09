<script setup lang="ts">
import XtxNumberBox from "@/components/XtxNumberBox.vue";
import { useCartStore } from "@/stores/cartStore";
import Message from "@/utils/Message";
import MyConfirm from "@/utils/MyConfirm";

const cartStore = useCartStore();

async function removeGood(skuId: string) {
  // 和用户进行交互确认是否要删除商品
  try {
    await MyConfirm({ content: "您确定要删除该商品吗" });
  } catch (e) {
    return;
  }
  // 删除商品
  try {
    await cartStore.removeGoodsOfCart({ ids: [skuId] });
    Message({ type: "success", msg: "删除成功" });
  } catch (e) {
    Message({ type: "error", msg: "删除失败" });
  }
}
// 删除所有选中的商品
function removeGoodsOfCartMany() {
  const skuIds = cartStore.selectedGoods.map((item) => item.skuId);
  cartStore.removeGoodsOfCart({ ids: skuIds });
}
</script>
<template>
  <div class="cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem path="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th>
                <XtxCheckbox
                  :checked="cartStore.isAllSelected"
                  @onChange="cartStore.selectAndDeselect($event)"
                  >全选</XtxCheckbox
                >
              </th>
              <th>商品信息</th>
              <th>单价</th>
              <th>数量</th>
              <th>小计</th>
              <th>操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-for="item in cartStore.effectiveGoods" :key="item.id">
              <td>
                <XtxCheckbox
                  :checked="item.selected"
                  @onChange="
                    cartStore.alterCartGoods({
                      id: item.skuId,
                      selected: $event,
                    })
                  "
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink to="/"
                    ><img :src="item.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <!-- 购物车选择规格组件 -->
                    <CartSku :skuId="item.skuId" :attrsText="item.attrsText" />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
                <p
                  v-if="
                    parseFloat(item.price) - parseFloat(item.nowPrice) !== 0
                  "
                >
                  比加入时降价
                  <span class="red"
                    >&yen;{{
                      parseFloat(item.price) - parseFloat(item.nowPrice)
                    }}</span
                  >
                </p>
              </td>
              <td class="tc">
                <XtxNumberBox
                  :max="item.stock"
                  :count="item.count"
                  :label="''"
                  @update:count="
                    cartStore.alterCartGoods({ id: item.skuId, count: $event })
                  "
                />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{ parseFloat(item.nowPrice) * item.count }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:">移入收藏夹</a></p>
                <p>
                  <a
                    class="green"
                    href="javascript:"
                    @click="removeGood(item.skuId)"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody>
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr v-for="item in cartStore.invalidGoods" :key="item.id">
              <td></td>
              <td>
                <div class="goods">
                  <RouterLink to="/"
                    ><img :src="item.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
              </td>
              <td class="tc">1</td>
              <td class="tc"><p>&yen;200.00</p></td>
              <td class="tc">
                <p><a class="green" href="javascript:">删除</a></p>
                <p><a href="javascript:">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox>全选</XtxCheckbox>
          <a href="javascript:" @click="removeGoodsOfCartMany">删除商品</a>
          <a href="javascript:">移入收藏夹</a>
          <a
            href="javascript:"
            @click="cartStore.removeGoodsOfCart({ clearInvalid: true })"
            >清空失效商品</a
          >
        </div>
        <div class="total">
          共 {{ cartStore.effectiveTotalCount }} 件商品，已选择
          {{ cartStore.selectedTotalCount }} 件，商品合计：
          <span class="red">¥{{ cartStore.selectedTotalPrice }}</span>
          <XtxButton type="primary">
            <XtxButton to="/checkout/order" type="primary">下单结算</XtxButton>
          </XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodsRelevant />
    </div>
  </div>
</template>

<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-number-box {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      width: 100%;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
