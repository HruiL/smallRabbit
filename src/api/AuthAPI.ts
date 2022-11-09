import type { XtxResponse } from "@/types/Response";
import type { User } from "@/types/User";
import { XTXRequestManager } from "@/utils/XTXRequestManager";

export class AuthAPI {
  // 账号密码登录
  static loginByAccount(account: string, password: string) {
    return XTXRequestManager.instance.request<
      XtxResponse<User>,
      {
        account: string;
        password: string;
      }
    >({
      url: "/login",
      method: "post",
      data: {
        account,
        password,
      },
    });
  }
  // 发送短信验证码
  static sendMsgCodeOfMobileLogin(mobile: string) {
    return XTXRequestManager.instance.request({
      url: "/login/code",
      params: {
        mobile,
      },
    });
  }
  // 手机验证码登录
  static loginByMobileMsgCode(mobile: string, code: string) {
    return XTXRequestManager.instance.request<
      XtxResponse<User>,
      {
        mobile: string;
        code: string;
      }
    >({
      url: "/login/code",
      method: "post",
      data: { mobile, code },
    });
  }
  // 检索用户使用的qq号是否已经绑定本站账号
  static loginByQQOpenid(unionId: string) {
    return XTXRequestManager.instance.request<XtxResponse<User>>({
      url: "/login/social",
      method: "post",
      data: { unionId, source: 1 },
    });
  }
  // 发送短信验证码，绑定已有账号
  static sendMsgCodeOfBindQQ(mobile: string) {
    return XTXRequestManager.instance.request<XtxResponse<null>>({
      url: "/login/social/code",
      params: { mobile },
    });
  }
  // qq登录：绑定站点已有账号
  static loginByBindAccount(mobile: string, code: string, unionId: string) {
    return XTXRequestManager.instance.request<
      XtxResponse<User>,
      {
        mobile: string;
        unionId: string;
        code: string;
      }
    >({
      url: "/login/social/bind",
      method: "post",
      data: { mobile, code, unionId },
    });
  }
  // qq登录，绑定新账户时校验用户名是否唯一
  static checkAccountUnique(account: string) {
    return XTXRequestManager.instance.request<XtxResponse<{ valid: boolean }>>({
      url: "/register/check",
      params: { account },
    });
  }
  // qq登录，发送短信验证码（绑定新注册的账号）
  static sendMsgCodeOfRegister(mobile: string) {
    return XTXRequestManager.instance.request<XtxResponse<null>>({
      url: "/register/code",
      params: { mobile },
    });
  }
  // qq登录，绑定新注册的账号
  static loginByBindNewAccount(
    unionId: string,
    user: {
      account: string;
      mobile: string;
      code: string;
      password: string;
    }
  ) {
    return XTXRequestManager.instance.request({
      url: `/login/social/${unionId}/complement`,
      method: "post",
      data: user,
    });
  }
}
