import { setupWorker } from "msw";
import { handlers } from "./handlers";
// 注册请求拦截程序
const worker = setupWorker(...handlers);
export default worker;
