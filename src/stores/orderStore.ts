import { OrderAPI } from "@/api/OrderAPI";
import type {
  Address,
  EditAddressObject,
  LogisticsResponse,
  OrderOfCreateResponse,
  OrderResponse,
  OrderState,
  SubmitOrderObject,
  SubmitOrderResponse,
} from "@/types/Order";
import type { Pagination } from "@/types/Response";
import type { Status } from "@/types/Status";

type States = {
  // 订单
  orderOfCreate: {
    result: Partial<OrderOfCreateResponse>;
    status: Status;
  };
  // 收货地址
  addressList: {
    result: Address[];
    status: Status;
  };
  // 订单信息
  orderInfo: {
    result: Partial<OrderResponse>;
    status: Status;
  };
  // 我的订单
  myOrderList: {
    [key in OrderState]: {
      result: Partial<Pagination<OrderResponse>>;
      status: Status;
    };
  };
  // 物流信息
  logistics: {
    result: Partial<LogisticsResponse>;
    status: Status;
  };
};
type Getters = {};
type Actions = {
  // 创建订单
  createOrder(): Promise<void>;
  // 添加收货地址
  addAddress(address: EditAddressObject): Promise<string>;
  // 获取收货地址列表
  getAddress(): Promise<void>;
  // 修改收货地址
  updateAddress(reqParams: EditAddressObject): Promise<string>;
  // 提交订单
  submitOrder(order: SubmitOrderObject): Promise<SubmitOrderResponse>;
  // 获取订单信息
  getOrderInfoById(id: string): Promise<void>;
  // 获取我的订单
  getMyOrderList(args: {
    page: number;
    pageSize: number;
    orderState: OrderState;
  }): Promise<void>;
  // 取消订单
  cancelOrder(id: string, cancelReason: string): Promise<OrderResponse>;
  // 删除订单
  deleteOrder(ids: string[]): Promise<null>;
  // 确认收货
  confirmReceiveGoods(id: string): Promise<OrderResponse>;
  // 查看物流
  viewLogistics(id: string): Promise<void>;
  // 再次购买
  againBuy(id: string): Promise<void>;
};
export const useOrderStore = defineStore<"order", States, Getters, Actions>(
  "order",
  {
    state: () => ({
      orderOfCreate: {
        result: {},
        status: "idle",
      },
      // 收货地址列表
      addressList: {
        result: [],
        status: "idle",
      },
      orderInfo: {
        result: {},
        status: "idle",
      },
      myOrderList: {
        0: { result: {}, status: "idle" },
        1: { result: {}, status: "idle" },
        2: { result: {}, status: "idle" },
        3: { result: {}, status: "idle" },
        4: { result: {}, status: "idle" },
        5: { result: {}, status: "idle" },
        6: { result: {}, status: "idle" },
      },
      logistics: {
        result: {},
        status: "idle",
      },
    }),
    getters: {},
    actions: {
      // 创建订单
      async createOrder() {
        this.orderOfCreate.status = "loading";
        try {
          const response = await OrderAPI.createOrder();
          this.orderOfCreate.result = response.result;
          this.orderOfCreate.status = "success";
        } catch (e) {
          this.orderOfCreate.status = "error";
        }
      },
      // 添加收货地址
      async addAddress(address) {
        // 发送添加收货地址的请求
        const response = await OrderAPI.addAddress(address);
        // 返回新添加的收货地址的id
        return response.result.id;
      },
      // 获取收货地址列表
      async getAddress() {
        this.addressList.status = "loading";
        try {
          const response = await OrderAPI.getAddress();
          this.addressList.result = response.result;
          this.addressList.status = "success";
        } catch (e) {
          this.addressList.status = "error";
        }
      },
      // 更新收货地址
      async updateAddress(reqParams) {
        // 解构出 更新收货地址方法 所需要的参数
        const { id, ...rest } = reqParams;
        // 发送请求，修改收货地址
        const response = await OrderAPI.updateAddress(id!, rest);
        // 返回被修改的收货地址的id
        return response.result.id;
      },
      // 提交订单
      async submitOrder(order) {
        const response = await OrderAPI.submitOrder(order);
        return response.result;
      },
      // 获取订单信息
      async getOrderInfoById(id) {
        this.orderInfo.status = "loading";
        try {
          const response = await OrderAPI.getOrderInfoById(id);
          this.orderInfo.result = response.result;
          this.orderInfo.status = "success";
        } catch (e) {
          this.orderInfo.status = "error";
        }
      },
      // 获取我的订单
      async getMyOrderList(args) {
        this.myOrderList[args.orderState].status = "loading";
        try {
          const response = await OrderAPI.getMyOrdersList(args);
          this.myOrderList[args.orderState].result = response.result;
          this.myOrderList[args.orderState].status = "success";
        } catch (e) {
          this.myOrderList[args.orderState].status = "error";
        }
      },
      // 取消订单
      async cancelOrder(id, cancelReason) {
        const response = await OrderAPI.cancelOrder(id, cancelReason);
        return response.result;
      },
      // 删除订单
      async deleteOrder(ids) {
        const response = await OrderAPI.deleteOrder(ids);
        return response.result;
      },
      // 确认收货
      async confirmReceiveGoods(id) {
        const response = await OrderAPI.confirmReceiveGoods(id);
        console.log(response);
        return response.result;
      },
      // 查看物流
      async viewLogistics(id) {
        this.logistics.status = "loading";
        try {
          const response = await OrderAPI.viewLogistics(id);
          this.logistics.result = response.result;
          this.logistics.status = "success";
        } catch (e) {
          this.logistics.status = "error";
        }
      },
      // 再次购买
      async againBuy(id) {
        this.orderOfCreate.status = "loading";
        try {
          const response = await OrderAPI.againBuy(id);
          this.orderOfCreate.result = response.result;
          this.orderOfCreate.status = "success";
        } catch (e) {
          this.orderOfCreate.status = "error";
        }
      },
    },
  }
);
