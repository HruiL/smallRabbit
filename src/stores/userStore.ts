import type { XtxResponse } from "@/types/Response";
import type { Status } from "@/types/Status";
import type { User } from "@/types/User";
import { AxiosError } from "axios";
import { defineStore } from "pinia";

type State = {
  profile: {
    result: Partial<User>;
    status: Status;
    error: string;
  };
};
type Getters = {};
type Actions = {
  // 登录
  // 传回调函数的原因：这个登录方法是通用的，不管是以哪种方式登录，都用这个方法，不同的登录方法只需调用不同的api方法就好
  login(callback: () => Promise<XtxResponse<User>>): Promise<void>;
};
export const useUserStore = defineStore<"user", State, Getters, Actions>(
  "user",
  {
    state: () => ({
      profile: {
        result: {},
        status: "idle",
        error: "",
      },
    }),
    actions: {
      async login(callback) {
        // 更新加载状态
        this.profile.status = "loading";
        setTimeout(async () => {
          try {
            // 发送请求
            let response = await callback();
            // 保存状态
            this.profile.result = response.result;
            // 更新加载状态
            this.profile.status = "success";
          } catch (error) {
            // 更新加载状态
            this.profile.status = "error";
            // 判断error的类型，对不同的类型错误做不同的处理
            if (error instanceof AxiosError) {
              // 如果是axios的错误
              this.profile.error = error.response?.data.message;
            } else if (error instanceof Error) {
              // 如果是客户端的错误
              this.profile.error = error.message;
            }
          }
        }, 3000);
      },
    },
    // 将store中的状态自动同步到本地
    persist: true,
  }
);
