import type { FunctionalComponent } from "vue"
import styles from "./XtxTabs.module.less"
// 定义props的类型
interface Props {
    name: string
}
// 导出一个函数式组件
// 函数式组件的类型是FunctionalComponent，这是一个泛型函数，泛型的参数一是限制props的类型，参数二是限制emit自定义事件的类型
export const XtxTabs: FunctionalComponent<Props, { "update:name": (name: string) => void, "onChecked": (index: number) => void }> = (props, context) => {
    // 获取XtxTabs组件的插槽，因为没有指定插槽名称，所以默认就是获取default
    const content = context.slots.default?.()
    const target: any[] = []
    // 点击标题进行切换时要做的事情
    // 1. 切换标题的名字 2. 不同的标题要发送不同的请求
    const onClickHandler = (name: string, index: number) => {
        // 触发双向数据绑定的自定义事件
        // 点击标题如何进行切换？ 获取当前标题的名字，触发自定义事件，通知外部要切换的值，外部通过双向数据绑定进行tab之间的切换
        context.emit("update:name", name)
        context.emit("onChecked", index)
    }
    content?.forEach((item) => {
        // 遍历生成的和把插槽写死的区别是：虚拟节点的type不同
        // 如果插槽是通过遍历生成的
        if (typeof item.type === 'symbol') {
            // 方式一
            // target.push(...item.children)
            // 方式二
            if (item.children instanceof Array) {
                item?.children.forEach(child => target.push(child))
            }
            // 如果插槽是写死的
        } else {
            target.push(item)
        }
    })
    return <div className={styles['xtx-tabs']}>
        <nav>
            {target?.map((item, index) => {

                if (item.props !== null) {
                    {/* 为每个插槽的添加isActive属性，用来控制要显示那个tab内容 */ }
                    item.props.isActive = item.props?.name === props.name
                }
                {/* 为a标签添加href="javascript:;" 可以实现鼠标移上去是手指状 */ }
                return <a href="javascript:;"
                    onClick={() => onClickHandler(item.props?.name, index)}
                    className={item.props?.isActive ? styles.active : ''}>{item.props?.label}
                </a>
            })}
        </nav>
        {content}</div>
}