import { GoodsAPI } from "@/api/GoodsAPI";
import type {
  Evaluate,
  EvaluateRequestParams,
  EvaluteInfo,
  Goods,
  GoodsDetailInfo,
} from "@/types/Goods";
import type { Pagination } from "@/types/Response";
import type { Status } from "@/types/Status";
import chunk from "lodash/chunk";

type States = {
  // 商品信息
  goodsInfo: {
    result: Goods;
    status: Status;
  };
  // 同类商品/猜你喜欢
  relevantGoods: {
    // 原数据[{},{},{},....]
    // 我们想要的数据 [[{},{},{},{}],[{},{},{},{}]]
    // 所以设置为二维数组
    result: Goods[][];
    status: Status;
  };
  // 热榜
  hotSaleGoods: {
    result: {
      // 24小时热榜
      1: Goods[];
      // 周热榜
      2: Goods[];
      // 总热榜
      3: Goods[];
    };
    status: Status;
  };
  // 商品评价信息
  evaluateInfo: {
    result: EvaluteInfo;
    status: Status;
  };
  // 商品评价列表
  evaluateList: {
    result: Pagination<Evaluate>;
    status: Status;
  };
};
type Getters = {
  // 减少组件中获取minPictures数据的调用层级
  mainPictures(): string[];
  // 获取商品基本信息
  baseInfo(): Pick<Goods, "name" | "desc" | "price" | "oldPrice">;
  // 减少商品详情组件的调用层级
  goodsProperties(): GoodsDetailInfo;
};
type Actions = {
  // 根据商品id获取商品信息
  getGoodsInfo(id: string): Promise<void>;
  // 更新商品信息（规格更新）
  updateGoods(data: Data): void;
  // 获取同类商品/猜你喜欢
  getRelevantGoods(args?: { id?: string; limit?: number }): Promise<void>;
  // 获取榜单
  getHotSaleGoods(id: string, type: 1 | 2 | 3, limit?: number): Promise<void>;
  // 获取评价头部信息
  getEvaluateInfo(id: string): Promise<void>;
  // 获取商品评价列表
  getEvaluateList(id: string, reqParams: EvaluateRequestParams): Promise<void>;
};
// 声明组件向外传递的状态的类型规范
export interface Data {
  price: string;
  oldPrice: string;
  inventory: number;
  skuId: string;
}
export const useGoodsStore = defineStore<"goods", States, Getters, Actions>(
  "goods",
  {
    state: () => ({
      goodsInfo: {
        status: "idle",
        result: {
          id: "",
          name: "",
          desc: "",
          price: "",
          picture: "",
          discount: null,
          orderNum: null,
          spuCode: "",
          oldPrice: "",
          inventory: 0,
          brand: [],
          salesCount: 0,
          commentCount: 0,
          collectCount: 0,
          mainVideos: [],
          videoScale: 0,
          mainPictures: [],
          specs: [],
          skus: [],
          categories: [],
          details: {
            pictures: [],
            properties: [],
          },
          isPreSale: false,
          isCollect: false,
          userAddresses: null,
          similarProducts: [],
          hotByDay: [],
          evaluationInfo: null,
        },
      },
      relevantGoods: {
        result: [],
        status: "idle",
      },
      hotSaleGoods: {
        result: {
          1: [],
          2: [],
          3: [],
        },
        status: "idle",
      },
      evaluateInfo: {
        result: {
          salesCount: 0,
          praisePercent: "",
          evaluateCount: 0,
          hasPictureCount: 0,
          tags: [],
        },
        status: "idle",
      },
      evaluateList: {
        result: {
          page: 0,
          pages: 0,
          pageSize: 0,
          counts: 0,
          items: [],
        },
        status: "idle",
      },
    }),
    getters: {
      mainPictures() {
        return this.goodsInfo.result.mainPictures;
      },
      baseInfo() {
        const { name, desc, price, oldPrice } = this.goodsInfo.result;
        return {
          name,
          desc,
          price,
          oldPrice,
        };
      },
      goodsProperties() {
        return {
          pictures: this.goodsInfo.result.details.pictures,
          properties: this.goodsInfo.result.details.properties,
        };
      },
    },
    actions: {
      // 获取商品信息
      async getGoodsInfo(id) {
        this.goodsInfo.status = "loading";
        try {
          const response = await GoodsAPI.getGoodsInfo(id);
          this.goodsInfo.result = response.result;
          this.goodsInfo.status = "success";
        } catch (e) {
          this.goodsInfo.status = "error";
        }
      },
      // 更新商品信息（规格更新）
      updateGoods(data) {
        this.goodsInfo.result.price = data.price;
        this.goodsInfo.result.oldPrice = data.oldPrice;
        this.goodsInfo.result.inventory = data.inventory;
      },
      // 获取同类商品/猜你喜欢
      async getRelevantGoods(args) {
        // 更新请求状态
        this.relevantGoods.status = "loading";
        try {
          // 发送请求 获取数据
          const response = await GoodsAPI.getRelevantGoods(args);
          // 将数据以 4 个为一组 进行分组，并存储
          this.relevantGoods.result = chunk(response.result, 4);
          // 更新请求状态
          this.relevantGoods.status = "success";
        } catch (e) {
          // 更新请求状态
          this.relevantGoods.status = "error";
        }
      },
      async getHotSaleGoods(id, type, limit = 3) {
        this.hotSaleGoods.status = "loading";
        try {
          // 发送请求获取数据
          const response = await GoodsAPI.getHotSaleGoods(id, type);
          // 根据榜单类别，分别存储数据
          this.hotSaleGoods.result[type] = response.result;
          // 更新加载状态
          this.hotSaleGoods.status = "success";
        } catch (error) {
          this.hotSaleGoods.status = "error";
        }
      },
      // 获取商品评价头部信息
      async getEvaluateInfo(id) {
        this.evaluateInfo.status = "loading";
        try {
          const response = await GoodsAPI.getEvaluateInfo(id);
          this.evaluateInfo.result = response.result;
          this.evaluateInfo.status = "success";
        } catch (e) {
          this.evaluateInfo.status = "error";
        }
      },
      // 获取评价列表
      async getEvaluateList(id, reqParams) {
        this.evaluateList.status = "loading";
        try {
          const response = await GoodsAPI.getEvaluateList(id, reqParams);
          this.evaluateList.result = response.result;
          this.evaluateList.status = "success";
        } catch (e) {
          this.evaluateList.status = "error";
        }
      },
    },
  }
);
