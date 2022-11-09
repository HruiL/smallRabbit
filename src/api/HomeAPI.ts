import type { Brands } from "@/types/Brands";
import type { Banner } from "@/types/Banner";
import type { XtxResponse } from "@/types/Response";
import { XTXRequestManager } from "@/utils/XTXRequestManager";
import type { Goods } from "@/types/Goods";
import type { HotRecommends } from "@/types/hotRecommends";
import type { Category } from "@/types/CateGory";
import type { Special } from "@/types/Special";

export class HomeAPI {
  // 获取首页品牌数据
  static getHotBrands(limit: number) {
    return XTXRequestManager.instance.request<
      XtxResponse<Brands[]>,
      { limit: number }
    >({
      url: "/home/brand",
      params: { limit },
    });
  }
  // 获取首页轮播图数据
  static getBanners(distributionSite: 1 | 2) {
    return XTXRequestManager.instance.request<
      XtxResponse<Banner[]>,
      { distributionSite: 1 | 2 }
    >({
      url: "/home/banner",
      params: { distributionSite },
    });
  }
  // 获取新鲜好物
  static getFreshGoods(limit: number) {
    return XTXRequestManager.instance.request<XtxResponse<Goods[]>>({
      url: "/home/new",
      params: { limit },
    });
  }
  // 获取人气推荐
  static getHotRecommends() {
    return XTXRequestManager.instance.request<XtxResponse<HotRecommends[]>>({
      url: "/home/hot",
    });
  }
  // 产品区块
  static getGoods() {
    return XTXRequestManager.instance.request<XtxResponse<Category[]>>({
      url: "/home/goods",
    });
  }
  // 最新专题
  static getSpecial(limit: number) {
    return XTXRequestManager.instance.request<
      XtxResponse<Special[]>,
      { limit: number }
    >({
      url: "/home/special",
      params: { limit },
    });
  }
}
