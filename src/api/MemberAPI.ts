import type { CollectionParams, CollectionResponse } from "@/types/Member";
import type { Pagination, XtxResponse } from "@/types/Response";
import { XTXRequestManager } from "@/utils/XTXRequestManager";

export class MemberAPI {
  // 获取我的收藏列表
  static getCollections(params: CollectionParams) {
    return XTXRequestManager.instance.request<
      XtxResponse<Pagination<CollectionResponse>>
    >({
      url: "/member/collect",
      params: params,
    });
  }
}
