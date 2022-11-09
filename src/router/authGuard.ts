import isLogin from "@/utils/isLogin";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export default function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // 路由白名单(不需要登陆也可以访问的地址)
  const allowPath = ["/", "/login", "/login/callback"];
  // 如果用户访问的是需要登录的页面，且没有登陆
  if (!allowPath.includes(to.path) && !isLogin()) {
    // 跳转到登录页
    return next({ path: "/login", query: { return: to.fullPath } });
  }
  // 放行，条件有 1. 访问的是不需要登录的页面； 2. 访问的是需要登录的页面，且用户进行的登录
  next();
}
