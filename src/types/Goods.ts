import type { Brands } from "./Brands";
import type { Category } from "./CateGory";
import type { User } from "./User";

export interface Goods {
  id: string;
  name: string;
  desc: string;
  price: string;
  picture: string;
  discount: null | number;
  orderNum: null | number;
  spuCode: string;
  oldPrice: string;
  inventory: number;
  brand: Brands[];
  salesCount: number;
  commentCount: number;
  collectCount: number;
  mainVideos: string[];
  videoScale: number;
  mainPictures: string[];
  specs: Spec[];
  skus: Sku[];
  categories: Pick<Category, "id" | "name" | "layer" | "parent">[];
  details: GoodsDetailInfo;
  isPreSale: boolean;
  isCollect: boolean;
  userAddresses: null;
  similarProducts: Goods[];
  hotByDay: Goods[];
  evaluationInfo: null;
}
// 规格
export interface Spec {
  id: string;
  name: string;
  values: SpecValue[];
}
// 规格选项
export interface SpecValue {
  name: string;
  picture: string;
  desc: string;
  selected: boolean;
}
// 商品详情信息
export interface GoodsDetailInfo {
  pictures: string[];
  properties: { name: string; value: string }[];
}
// 库存单位
export interface Sku {
  id: string;
  skuCode: string;
  price: string;
  oldPrice: string;
  inventory: number;
  specs: { name: string; valueName: string }[];
}
// 获取商品列表的请求参数接口规范
export interface GoodsRequestParams {
  // 二级分类ID
  categoryId: string;
  // 是否仅显示有货商品
  inventory: boolean;
  // 是否只显示特惠商品
  onlyDiscount: boolean;
  // "": 默认排序
  // publishTime: 最新商品
  // orderNum: 最高人气
  // evaluate: 评论最多
  // price: 价格
  sortField: "" | "publishTime" | "orderNum" | "price" | "evaluateNum";
  // asc: 升序
  // desc: 降序
  sortMethod: "" | "asc" | "desc";
  // 品牌 ID
  brandId: string;
  // 筛选条件
  // groupName: 筛选类别名称
  // propertyName: 筛选条件名称
  attrs: { groupName: string; propertyName: string }[];
  // 当前页
  page: number;
  // 每页显示的数据条数
  pageSize: number;
  // 最低价
  lowPrice: number;
  // 最高价
  highPrice: number;
}
// 评价信息
export interface EvaluteInfo {
  // 销量
  salesCount: number;
  // 好评率
  praisePercent: string;
  // 评价数量（总）
  evaluateCount: number;
  // 评价有图数
  hasPictureCount: number;
  // 评价标签
  tags: EvaluateTag[];
}
// 评价标签
export interface EvaluateTag {
  // 标签
  title: string;
  // 数量
  tagCount: number;
}
// 评价列表
export interface EvaluateRequestParams {
  page: number;
  pageSize: number;
  hasPicture: boolean;
  tag: string;
  sortField: "" | "praiseCount" | "createTime";
}
// 评价列表
export interface Evaluate {
  id: string;
  score: number;
  content: string;
  officialReply: string;
  praiseCount: number;
  createTime: string;
  orderInfo: {
    quantity: number;
    createTime: string;
    specs: EvaluateSpec[];
  };
  member: Pick<User, "id" | "nickname" | "avatar">;
  tags: string[];
  pictures: string[];
}
// 评价中的规格
export interface EvaluateSpec {
  name: string;
  nameValue: string;
}
