import { useUserStore } from "@/stores/userStore";

export default function isLogin() {
  // 判断是否登录的依据是 是否有token
  const token = useUserStore().profile.result.token;
  // 根据token是否存在返回布尔值
  return typeof token !== "undefined";
}
