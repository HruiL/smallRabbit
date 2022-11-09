// 1. 导入 XtxConfirm 单文件组件对象
import XtxConfirm from "@/components/XtxConfirm.vue";
// @ts-ignore
import type { callback } from "@/components/XtxConfirm.vue";
import { h, render } from "vue";

export default function MyConfirm(props: { title?: string; content: string }) {
  return new Promise(function (resolve, reject) {
    // 2. 将 XtxConfirm 单文件组件对象转换成虚拟DOM对象 h
    const vNode = h(XtxConfirm, {
      ...props,
      sure: resolve,
      cancel: reject,
      close,
    });
    // 创建虚拟DOM的渲染容器
    const container = document.createElement("div");
    document.body.appendChild(container);
    // 3. 将虚拟DOM对象渲染成真实DOM对象  render
    render(vNode, container);
    // 关闭弹框
    function close() {
      render(null, container);
      document.body.removeChild(container);
    }
  });
}
