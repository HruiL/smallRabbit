import { XTXRequestManager } from "@/utils/XTXRequestManager";
import type { Pagination, XtxResponse } from "@/types/Response";
import type { Category } from "@/types/CateGory";
import type { Goods, GoodsRequestParams } from "@/types/Goods";
export class CategoryAPI {
  // 获取一级分类信息
  static getCategories() {
    return XTXRequestManager.instance.request<XtxResponse<Category[]>>({
      url: "/home/category/head",
    });
  }
  // 根据一级分类id获取一级分类下的具体信息
  static getTopCategoryById(id: string) {
    return XTXRequestManager.instance.request<XtxResponse<Category>>({
      url: "/category",
      params: { id },
    });
  }
  // 根据二级分类id获取该分类下的商品的筛选条件
  static getSubCategoryFilters(id: string) {
    return XTXRequestManager.instance.request<XtxResponse<Category>>({
      url: "/category/sub/filter",
      params: { id },
    });
  }
  // 获取二级分类下的商品列表
  // 请求参数中的categoryId是必传的，所以将它设置为的单独的参数
  static getCategoryGoods(
    categoryId: GoodsRequestParams["categoryId"],
    reqParams?: Partial<Omit<GoodsRequestParams, "categoryId">>
  ) {
    return XTXRequestManager.instance.request<
      XtxResponse<Pagination<Goods>>,
      Partial<GoodsRequestParams>
    >({
      url: "/category/goods",
      method: "post",
      data: { categoryId, ...reqParams },
    });
  }
}
