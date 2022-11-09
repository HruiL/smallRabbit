import type { Category } from "@/types/CateGory";
import type { Status } from "@/types/Status";
import { CategoryAPI } from "@/api/CategoryAPI";
import type { Banner } from "@/types/Banner";
import { HomeAPI } from "@/api/HomeAPI";
import type { Pagination } from "@/types/Response";
import type { Goods, GoodsRequestParams } from "@/types/Goods";
// 定义store 状态的类型
type State = {
  // 分类数据
  categories: {
    // 头部导航分类数据
    headerNav: (Category & { isOpen: boolean })[];
    // 首页左侧导航分类数据
    homeCategory: Category[];
    status: Status;
  };
  // 轮播图
  banners: {
    result: Banner[];
    status: Status;
  };
  // 一级分类具体信息
  topCategories: {
    result: {
      [id: string]: Category;
    };
    status: Status;
  };
  // 二级分类的筛选条件
  subCategoryFilters: {
    result: {
      [id: string]: Category;
    };
    status: Status;
  };
  // 二级分类商品
  categoryGoods: {
    result: Pagination<Goods>;
    status: Status;
  };
};
// 定义getters的类型
type Getters = {
  // 一级分类面包屑导航
  currentTop: (state: State) => (topCategoryId: string) => Category | undefined;
  // 二级分类面包屑导航
  currentTopSub: (
    state: State
  ) => (
    topCategoryId: string,
    subCategoryId: string
  ) => { topCategory: Category | undefined; subCategory: Category | undefined };
};
// 定义actions的类型
type Actions = {
  // 获取分类数据
  getCategories(): Promise<void>;
  // 修改一级分类的isOpen属性
  toggle(id: string, isOpen: boolean): void;
  // 获取轮播图
  getBanners(): Promise<void>;
  // 根据一级分类id获取分类信息
  getTopCategoryById(id: string): Promise<void>;
  // 根据二级分类id获取该分类下的商品的筛选条件
  getSubCategoryFilters(id: string): Promise<void>;
  // 获取二级分类商品
  getCategoryGoods(
    categoryId: GoodsRequestParams["categoryId"],
    reqParams: Partial<Omit<GoodsRequestParams, "categoryId">>
  ): Promise<void>;
};
// 创建categorystore对象，返回获取categorysotre对象的方法
export const useCategoryStore = defineStore<string, State, Getters, Actions>(
  "category",
  {
    state: () => ({
      // 用于存储导航分类的列表数据
      categories: {
        headerNav: [],
        homeCategory: [],
        status: "idle",
      },
      banners: {
        result: [],
        status: "idle",
      },
      topCategories: {
        result: {},
        status: "idle",
      },
      subCategoryFilters: {
        result: {},
        status: "idle",
      },
      categoryGoods: {
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
      // 一级分类面包屑导航
      currentTop(state) {
        return function (topCategoryId) {
          return state.categories.headerNav.find(
            (item) => item.id === topCategoryId
          );
        };
      },
      // 二级分类面包屑导航
      currentTopSub(state) {
        return function (topCategoryId, subCategoryId) {
          const topCategory = state.categories.headerNav.find(
            (item) => item.id === topCategoryId
          );
          const subCategory = topCategory?.children?.find(
            (item) => item.id === subCategoryId
          );
          return { topCategory, subCategory };
        };
      },
    },
    actions: {
      // 获取导航分类的列表数据
      async getCategories() {
        // 修改请求状态
        this.categories.status = "loading";
        try {
          // 发送请求，获取分类状态
          const response = await CategoryAPI.getCategories();
          // 存储头部分类状态
          this.categories.headerNav = response.result.map((category) => ({
            ...category,
            isOpen: false,
          }));
          // 存储首页左侧分类列表
          this.categories.homeCategory = response.result.map((category) => ({
            ...category,
            children: category.children?.slice(0, 2),
          }));
          // 修改请求状态为success
          this.categories.status = "success";
        } catch (error) {
          // 修改请求状态为error
          this.categories.status = "error";
        }
      },
      // 修改一级分类的isOpen属性
      // 根据id查找目标分类，将它的isOpen属性值设置为target
      toggle(id, target) {
        this.categories.headerNav = this.categories.headerNav.map((category) =>
          category.id === id ? { ...category, isOpen: target } : category
        );
      },
      async getBanners() {
        this.banners.status = "loading";
        try {
          let response = await HomeAPI.getBanners(2);
          this.banners.result = response.result;
          this.banners.status = "success";
        } catch (error) {
          this.banners.status = "error";
        }
      },
      async getTopCategoryById(id) {
        this.topCategories.status = "loading";
        try {
          const response = await CategoryAPI.getTopCategoryById(id);
          this.topCategories.result[response.result.id] = response.result;
          this.topCategories.status = "success";
        } catch (error) {
          this.topCategories.status = "error";
        }
      },
      async getSubCategoryFilters(id) {
        this.subCategoryFilters.status = "loading";
        try {
          const response = await CategoryAPI.getSubCategoryFilters(id);
          this.subCategoryFilters.result[response.result.id] = response.result;
          this.subCategoryFilters.status = "success";
        } catch (error) {
          this.subCategoryFilters.status = "error";
        }
      },
      async getCategoryGoods(categoryId, reqParams) {
        // 1. 如果数据已经记载完成，则不再加载数据
        if (this.categoryGoods.status === "finished") return;
        // 2. 更新加载状态
        this.categoryGoods.status = "loading";
        // 3. 发请求，存数据，修改状态
        try {
          let response = await CategoryAPI.getCategoryGoods(
            categoryId,
            reqParams
          );
          // 3.1 重新在本地存储分页数据已经商品数据 1. 如果只有一页数据直接存储 2. 如果有多页，则累加状态
          if (reqParams.page === 1) {
            this.categoryGoods.result = response.result;
          } else {
            this.categoryGoods.result = {
              ...response.result,
              items: [
                ...this.categoryGoods.result.items,
                ...response.result.items,
              ],
            };
          }
          // 3.2 如果当前请求页已经是最后一页或者当前只有一页数据
          if (
            reqParams.page === response.result.pages ||
            response.result.pages === 0
          ) {
            this.categoryGoods.status = "finished";
          } else {
            this.categoryGoods.status = "success";
          }
        } catch (e) {
          this.categoryGoods.status = "error";
        }
      },
    },
  }
);
