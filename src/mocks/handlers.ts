import { rest } from "msw";
import { faker } from "@faker-js/faker/locale/zh_CN";
import { XTXRequestManager } from "@/utils/XTXRequestManager";
// msw如何使用
// 1. 定义请求拦截程序 2. 注册请求拦截程序 3. 开启拦截
function makeArray(length: any, generator: any) {
  return Array.from({ length }, generator);
}
export const handlers = [
  // 定义请求拦截程序
  rest.get(`${XTXRequestManager.baseUrl}/member/collect`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        msg: "成功",
        result: {
          counts: 50,
          pageSize: req.url.searchParams.get("pageSize"),
          pages: 0,
          page: req.url.searchParams.get("page"),
          items: makeArray(10, () => ({
            id: faker.datatype.uuid(),
            name: faker.internet.userName(),
            desc: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${faker.datatype.number(
              { min: 1, max: 8 }
            )}.jpg`,
          })),
        },
      })
    );
  }),
];
