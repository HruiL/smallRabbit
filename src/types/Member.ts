// 我的收藏 服务器端的响应
export interface CollectionResponse {
  id: string;
  name: string;
  description: string;
  picture: string;
  collectType: 1 | 2 | 3;
  price: string;
  discount: number;
  productionPlace: string;
  detailsUrl: string;
}
// 我的收藏 请求参数
export interface CollectionParams {
  page: number;
  pageSize: number;
  collectType: 1 | 2 | 3;
}
