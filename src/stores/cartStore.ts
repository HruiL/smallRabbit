import { CartAPI } from "@/api/CartAPI";
import type { Cart } from "@/types/Cart";
import type { Sku, Spec } from "@/types/Goods";
import type { Status } from "@/types/Status";

type States = {
  carts: {
    result: Cart[];
    status: Status;
  };
};
type Getters = {
  // 可购买的商品列表
  effectiveGoods(): Cart[];
  // 计算可购买的商品数量
  effectiveTotalCount(): number;
  // 计算可购买的商品总价
  effectiveTotalPrice(): number;
  // 用户选择的商品列表
  selectedGoods(): Cart[];
  // 计算用户选择的商品总数量
  selectedTotalCount(): number;
  // 计算用户选择的商品总价格
  selectedTotalPrice(): number;
  // 无效商品列表
  invalidGoods(): Cart[];
  // 是否全部选中
  isAllSelected(): boolean;
};
type Actions = {
  // 将商品加入购物车
  addProductToCart(skuId: string, count: number): Promise<void>;
  // 获取商品列表
  getCarts(): Promise<void>;
  // 删除购物车
  removeGoodsOfCart(args: {
    ids?: string[];
    clearAll?: boolean;
    clearInvalid?: boolean;
  }): Promise<void>;
  // 修改商品信息
  alterCartGoods(args: {
    id: string;
    selected?: boolean;
    count?: number;
  }): Promise<Cart>;
  // 全选和取消全选
  selectAndDeselect(selected: boolean): Promise<void>;
  // 修改商品规格
  alterSku(oldSkuId: string, newSkuId: string): Promise<void>;
};
export const useCartStore = defineStore<"cart", States, Getters, Actions>(
  "cart",
  {
    state: () => ({
      carts: {
        result: [],
        status: "idle",
      },
    }),
    getters: {
      // 可购买的商品列表
      effectiveGoods() {
        return this.carts.result.filter(
          (item) => item.isEffective && item.stock > 0
        );
      },
      // 计算可购买的商品数量
      effectiveTotalCount() {
        return this.effectiveGoods.reduce(
          (count, item) => (count += item.count),
          0
        );
      },
      // 计算可购买的商品总价
      effectiveTotalPrice() {
        return this.effectiveGoods.reduce(
          (price, item) => (price += item.count * parseFloat(item.nowPrice)),
          0
        );
      },
      // 用户选择的商品列表
      selectedGoods() {
        return this.effectiveGoods.filter((item) => item.selected);
      },
      // 计算用户选择的商品总数量
      selectedTotalCount() {
        return this.selectedGoods.reduce(
          (count, item) => (count += item.count),
          0
        );
      },
      // 计算用户选择的商品总价格
      selectedTotalPrice() {
        return this.selectedGoods.reduce(
          (price, item) => (price += item.count * parseFloat(item.nowPrice)),
          0
        );
      },
      // 无效商品列表
      invalidGoods() {
        return this.carts.result.filter(
          (item) => !item.isEffective || item.stock === 0
        );
      },
      // 是否全部选中
      isAllSelected() {
        if (this.selectedGoods.length === 0) return false;
        return this.selectedGoods.length === this.effectiveGoods.length;
      },
    },
    actions: {
      // 将商品加入购物车
      async addProductToCart(skuId, count) {
        // 将商品添加到购物车
        const response = await CartAPI.addProductToCart(skuId, count);
        // 添加成功之后，获取购物车商品数据
        await this.getCarts();
        return response.result;
      },
      // 获取商品列表
      async getCarts() {
        this.carts.status = "loading";
        try {
          const response = await CartAPI.getCarts();
          this.carts.result = response.result;
          this.carts.status = "success";
        } catch (e) {
          this.carts.status = "error";
        }
      },
      // 删除商品
      async removeGoodsOfCart(args) {
        const response = await CartAPI.removeGoodsOfCart(args);
        // response：{code: '1', msg: '操作成功', result: true}
        // 删除成功
        if (response.result) {
          // 购物车数据
          this.getCarts();
        }
      },
      // 修改商品信息
      async alterCartGoods(args) {
        // 发送请求，修改商品信息
        const response = await CartAPI.alterCartGoods(args);
        // 获取最新商品列表
        this.getCarts();
        return response.result;
      },
      // 全选和取消全选
      async selectAndDeselect(selected) {
        // 发送请求，更新状态
        await CartAPI.selectAndDeselect(selected);
        // 获取购物车数据
        this.getCarts();
      },
      // 修改商品规格
      async alterSku(oldSkuId, newSkuId) {
        const oldGood = this.carts.result.find(
          (item) => item.skuId === oldSkuId
        );
        // 如果没有找到了旧商品
        if (typeof oldGood === "undefined") return;
        // 如果找到了，获取商品的数量
        const oldCount = oldGood.count;
        // 删除旧商品
        await this.removeGoodsOfCart({ ids: [oldSkuId] });
        // 添加新商品
        await this.addProductToCart(newSkuId, oldCount);
      },
    },
    persist: true,
  }
);
