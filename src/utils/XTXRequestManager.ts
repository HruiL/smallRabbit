import { useUserStore } from "@/stores/userStore";
import {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import axios from "axios";
import router from "@/router";
// 定义我们自己axios实例接口，因为我们注册了响应拦截，所以源码AxiosInstance不符合我们的需求了，我们需要继承源码，重写request方法
interface XtxAxiosInstance extends AxiosInstance {
  request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T>;
}
export class XTXRequestManager {
  // 静态的私有属性，用于存储单例对象
  // 私有的原因：不希望被外部访问，不希望被外部new
  private static _singletonInstance: XTXRequestManager;
  // 私有的只读属性，用于发送请求的axios实例
  public readonly _instance: XtxAxiosInstance;
  // 请求的基准地址
  public static baseUrl: string =
    "https://pcapi-xiaotuxian-front-devtest.itheima.net";
  // 用于存储用户信息的store对象
  private userStore = useUserStore();
  // 创建私有构造函数，避免外部直接实例化该类
  private constructor() {
    // 创建axios实例对象
    this._instance = axios.create({ baseURL: XTXRequestManager.baseUrl });
    // 注册请求拦截
    this._instance.interceptors.request.use(this._addTokenToHeader.bind(this));
    // 注册响应拦截器
    this._instance.interceptors.response.use(
      // 成功态，剥离axios响应对象，直接返回服务端的响应状态
      this._peelOffAxiosResponse,
      // 失败态，登录状态失败
      this._unanthorized.bind(this)
    );
  }
  // 用于获取实例对象的静态方法
  static get instance(): XTXRequestManager {
    // 判断单例是否存在 不存在 => 返回单例对象，  存在 => 创建单例对象
    if (typeof XTXRequestManager._singletonInstance === "undefined") {
      XTXRequestManager._singletonInstance = new XTXRequestManager();
    }
    return XTXRequestManager._singletonInstance;
  }
  // 在请求头中加入token
  private _addTokenToHeader(config: AxiosRequestConfig) {
    // 获取token
    const token = this.userStore.profile.result.token;
    // 如果token存在，将其添加到请求头中
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    // 返回请求配置对象
    return config;
  }
  // 剥离axios响应对象，直接返回服务器的响应状态（响应拦截器 => 成功态)
  private _peelOffAxiosResponse(response: AxiosResponse) {
    return response.data;
  }
  // 登录状态失败，清空用户信息，并跳转到登录页面
  private _unanthorized(error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        // 清空用户信息
        this.userStore.$reset();
        // 跳转到登录页面
        // 路由文件，做了前置路由守卫，如果token校验不通过，直接跳转到登录页，所以下面的代码可以注释掉
        // router.push(
        //   `/login?return=${encodeURIComponent(
        //     router.currentRoute.value.fullPath
        //   )}`
        // );
      }
    }
    // throw error;
    return Promise.reject(error);
  }
  // 外部用于发送请求的方法
  // D是请求参数
  // T是要返回的数据类型
  // 由于我们调用的是axios实例下的request方法，这个方法的参数被要求是AxiosRequestConfig
  public request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T> {
    return this._instance.request<T, D>(config);
  }
}
