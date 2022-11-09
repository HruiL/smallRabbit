import type {
  EditAddressObject,
  OrderOfCreateResponse,
  OrderResponse,
  OrderState,
  SubmitOrderObject,
  SubmitOrderResponse,
  LogisticsResponse,
} from "@/types/Order";
import type { XtxResponse } from "@/types/Response";
import { XTXRequestManager } from "@/utils/XTXRequestManager";

export class OrderAPI {
  // 生成订单
  static createOrder() {
    return XTXRequestManager.instance.request<
      XtxResponse<OrderOfCreateResponse>
    >({
      url: "/member/order/pre",
    });
  }
  // 添加收货地址
  static addAddress(address: EditAddressObject) {
    return XTXRequestManager.instance.request<XtxResponse<{ id: string }>>({
      url: "/member/address",
      method: "post",
      data: address,
    });
  }
  // 获取收货地址列表
  static getAddress() {
    return XTXRequestManager.instance.request({
      url: "/member/address",
    });
  }
  // 修改收货地址
  static updateAddress(id: string, reqParams: EditAddressObject) {
    return XTXRequestManager.instance.request<XtxResponse<{ id: string }>>({
      url: `/member/address/${id}`,
      method: "put",
      data: reqParams,
    });
  }
  // 提交订单
  static submitOrder(order: SubmitOrderObject) {
    return XTXRequestManager.instance.request<XtxResponse<SubmitOrderResponse>>(
      {
        url: "/member/order",
        method: "post",
        data: order,
      }
    );
  }
  // 获取订单详情
  static getOrderInfoById(id: string) {
    return XTXRequestManager.instance.request<XtxResponse<OrderResponse>>({
      url: `/member/order/${id}`,
    });
  }
  // 获取我的订单
  static getMyOrdersList(args: {
    page: number;
    pageSize: number;
    orderState: OrderState;
  }) {
    return XTXRequestManager.instance.request({
      url: "/member/order",
      params: args,
    });
  }
  // 取消订单
  static cancelOrder(id: string, cancelReason: string) {
    return XTXRequestManager.instance.request<XtxResponse<OrderResponse>>({
      url: `/member/order/${id}/cancel`,
      method: "put",
      data: { cancelReason },
    });
  }
  // 删除订单
  static deleteOrder(ids: string[]) {
    return XTXRequestManager.instance.request<XtxResponse<null>>({
      url: "/member/order",
      method: "delete",
      data: { ids },
    });
  }
  // 确认收货
  static confirmReceiveGoods(id: string) {
    return XTXRequestManager.instance.request<XtxResponse<OrderResponse>>({
      url: `/member/order/${id}/receipt`,
      method: "put",
    });
  }
  // 查看物流
  static viewLogistics(id: string) {
    return XTXRequestManager.instance.request<XtxResponse<LogisticsResponse>>({
      url: `/member/order/${id}/logistics`,
    });
  }
  // 再次购买
  static againBuy(id: string) {
    return XTXRequestManager.instance.request<
      XtxResponse<OrderOfCreateResponse>
    >({
      url: `/member/order/repurchase/${id}`,
    });
  }
}
