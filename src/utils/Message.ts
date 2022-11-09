import type { Props } from "@/components/XtxMessage.vue";
import XtxMessage from "@/components/XtxMessage.vue";
import { h, render } from "vue";
export default function Message(props: Props) {
  // 将单文件组件转换为虚拟节点对象
  const vNode = h(XtxMessage, props);
  // 创建渲染容器
  const container = document.createElement("div");
  // 将容器追加到页面中
  document.body.appendChild(container);
  // 将虚拟节点对象转为真实dom对象
  render(vNode, container);
  // 延迟3m执行离场动画
  setTimeout(() => {
    if (vNode.component && vNode.component.exposed) {
      vNode.component.exposed.toggle.value = false;
      setTimeout(() => {
        document.body.removeChild(container);
      }, 800);
    }
  }, 3000);
}
