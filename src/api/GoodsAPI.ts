import type {
  Evaluate,
  EvaluateRequestParams,
  EvaluteInfo,
  Goods,
} from "@/types/Goods";
import type { Pagination, XtxResponse } from "@/types/Response";
import { XTXRequestManager } from "@/utils/XTXRequestManager";

export class GoodsAPI {
  // 根据商品id获取商品的详细信息
  static getGoodsInfo(id: string) {
    return XTXRequestManager.instance.request<
      XtxResponse<Goods>,
      { id: string }
    >({
      url: "/goods",
      params: { id },
    });
  }
  // 获取同类商品或者猜你喜欢
  static getRelevantGoods(args?: { id?: string; limit?: number }) {
    if (typeof args !== "undefined" && typeof args.limit === "undefined") {
      args.limit = 16;
    } else {
      args = { limit: 16 };
    }
    return XTXRequestManager.instance.request<
      XtxResponse<Goods[]>,
      { id?: number; limit: number }
    >({
      url: "/goods/relevant",
      params: args,
    });
  }
  // 获取热榜
  static getHotSaleGoods(id: string, type: 1 | 2 | 3, limit: number = 3) {
    return XTXRequestManager.instance.request<
      XtxResponse<Goods[]>,
      { id: string; type: 1 | 2 | 3; limit: number }
    >({
      url: "goods/hot",
      params: { id, type, limit },
    });
  }
  // 获取商品评价信息(头部筛选)
  static getEvaluateInfo(id: string) {
    return XTXRequestManager.instance.request<XtxResponse<EvaluteInfo>>({
      url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    });
  }
  // 获取评价列表
  static getEvaluateList(id: string, reqParams: EvaluateRequestParams) {
    return XTXRequestManager.instance.request<
      XtxResponse<Pagination<Evaluate>>,
      EvaluateRequestParams
    >({
      url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
      params: reqParams,
    });
  }
}
