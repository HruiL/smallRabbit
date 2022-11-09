import { HomeAPI } from "@/api/HomeAPI";
import type { Banner } from "@/types/Banner";
import type { Brands } from "@/types/Brands";
import type { Category } from "@/types/CateGory";
import type { Goods } from "@/types/Goods";
import type { HotRecommends } from "@/types/hotRecommends";
import type { Special } from "@/types/Special";
import type { Status } from "@/types/Status";

type State = {
  // 品牌数据
  brands: {
    result: Brands[];
    status: Status;
  };
  // 轮播图数据
  banners: {
    result: Banner[];
    status: Status;
  };
  // 新鲜好物
  freshGoods: {
    result: Goods[];
    status: Status;
  };
  // 人气推荐
  hotRecommends: {
    result: HotRecommends[];
    status: Status;
  };
  // 产品区块
  goods: {
    result: Category[];
    status: Status;
  };
  // 最新专题
  specials: {
    result: Special[];
    status: Status;
  };
};
type Getters = {};
type Actions = {
  // 获取品牌数据
  getBrands(limit?: number): Promise<void>;
  // 获取轮播图数据
  getBanners(distributionSite?: 1 | 2): Promise<void>;
  // 获取新鲜好物
  getFreshGoods(limit?: number): Promise<void>;
  // 获取人气推荐
  getHotRecommends(): Promise<void>;
  // 获取产品区块
  getGoods(): Promise<void>;
  // 获取最新专题
  getSpecial(limit?: number): Promise<void>;
};
export const useHomeStore = defineStore<"home", State, Getters, Actions>(
  "home",
  {
    state: () => ({
      // 存储品牌数据
      brands: {
        result: [],
        status: "idle",
      },
      banners: {
        result: [],
        status: "idle",
      },
      freshGoods: {
        result: [],
        status: "idle",
      },
      hotRecommends: {
        result: [],
        status: "idle",
      },
      goods: {
        result: [],
        status: "idle",
      },
      specials: {
        result: [],
        status: "idle",
      },
    }),
    getters: {},
    actions: {
      async getBrands(limit = 9) {
        // 1. 修改状态为loading
        this.brands.status = "loading";
        // 发请求的时候需要捕获错误
        try {
          // 2. 发送请求,获取响应结果
          let response = await HomeAPI.getHotBrands(limit);
          // 3. 将数据存储到state状态里
          this.brands.result = response.result;
          // 4. 修改状态为success
          this.brands.status = "success";
        } catch (error) {
          // 5. 修改状态为error
          this.brands.status = "error";
        }
      },
      async getBanners(distributionSite = 1) {
        this.banners.status = "loading";
        try {
          const response = await HomeAPI.getBanners(distributionSite);
          this.banners.result = response.result;
          this.banners.status = "success";
        } catch (error) {
          this.banners.status = "error";
        }
      },
      async getFreshGoods(limit = 4) {
        this.freshGoods.status = "loading";
        try {
          const response = await HomeAPI.getFreshGoods(limit);
          this.freshGoods.result = response.result;
          this.freshGoods.status = "success";
        } catch (error) {
          this.freshGoods.status = "error";
        }
      },
      async getHotRecommends() {
        this.hotRecommends.status = "loading";
        try {
          const response = await HomeAPI.getHotRecommends();
          this.hotRecommends.result = response.result;
          this.hotRecommends.status = "success";
        } catch (error) {
          this.hotRecommends.status = "error";
        }
      },
      async getGoods() {
        this.goods.status = "loading";
        try {
          const response = await HomeAPI.getGoods();
          this.goods.result = response.result;
          this.goods.status = "success";
        } catch (error) {
          this.goods.status = "error";
        }
      },
      async getSpecial(limit = 3) {
        this.specials.status = "loading";
        try {
          const response = await HomeAPI.getSpecial(limit);
          this.specials.result = response.result;
          this.specials.status = "success";
        } catch (e) {
          this.specials.status = "error";
        }
      },
    },
  }
);
