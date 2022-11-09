import { MemberAPI } from "@/api/MemberAPI";
import type { CollectionParams, CollectionResponse } from "@/types/Member";
import type { Pagination } from "@/types/Response";
import type { Status } from "@/types/Status";

type States = {
  // 我的收藏列表
  collections: {
    [type in 1 | 2 | 3]: {
      result: Pagination<CollectionResponse>;
      status: Status;
    };
  };
};
type Getters = {};
type Actions = {
  // 获取我的收藏
  getCollections(params: CollectionParams): Promise<void>;
};
export const useMemeberStore = defineStore<"member", States, Getters, Actions>(
  "member",
  {
    state: () => ({
      collections: {
        1: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
        2: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
        3: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
      },
    }),
    getters: {},
    actions: {
      async getCollections(params) {
        this.collections[params.collectType].status = "loading";
        try {
          const response = await MemberAPI.getCollections(params);
          this.collections[params.collectType].result = response.result;
          this.collections[params.collectType].status = "success";
        } catch (e) {
          this.collections[params.collectType].status = "error";
        }
      },
    },
  }
);
