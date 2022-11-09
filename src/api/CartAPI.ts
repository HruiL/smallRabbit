import type { Cart } from "@/types/Cart";
import type { Sku, Spec } from "@/types/Goods";
import type { XtxResponse } from "@/types/Response";
import { XTXRequestManager } from "@/utils/XTXRequestManager";

export class CartAPI {
  // 将商品加入购物车
  static addProductToCart(skuId: string, count: number) {
    return XTXRequestManager.instance.request({
      url: "/member/cart",
      method: "post",
      data: {
        skuId,
        count,
      },
    });
  }
  // 获取头部购物车商品列表
  static getCarts() {
    return XTXRequestManager.instance.request<XtxResponse<Cart[]>>({
      url: "/member/cart",
    });
  }
  // 删除头部购物车商品
  static removeGoodsOfCart(args: {
    ids?: string[];
    clearAll?: boolean;
    clearInvalid?: boolean;
  }) {
    return XTXRequestManager.instance.request<XtxResponse<boolean>>({
      url: "/member/cart",
      method: "delete",
      data: args,
    });
  }
  // 修改购物车商品信息
  static alterCartGoods(args: {
    id: string;
    selected?: boolean;
    count?: number;
  }) {
    return XTXRequestManager.instance.request<
      XtxResponse<Cart>,
      {
        id: string;
        selected?: boolean;
        count?: number;
      }
    >({
      url: `/member/cart/${args.id}`,
      method: "put",
      data: args,
    });
  }
  // 购物车全选和取消全选
  static selectAndDeselect(selected: boolean) {
    return XTXRequestManager.instance.request<XtxResponse<null>>({
      url: "/member/cart/selected",
      method: "put",
      data: { selected },
    });
  }
  // 获取商品规格信息
  static getSkuInfo(id: string) {
    return XTXRequestManager.instance.request<
      XtxResponse<{ specs: Spec[]; skus: Sku[] }>
    >({
      url: `/goods/sku/${id}`,
      params: { id },
    });
  }
}
