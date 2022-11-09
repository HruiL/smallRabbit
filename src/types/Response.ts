export interface XtxResponse<T> {
  code: string;
  msg: string;
  result: T;
}
// 分页
export interface Pagination<T> {
  page: number;
  pages: number;
  pageSize: number;
  counts: number;
  items: T[];
}
