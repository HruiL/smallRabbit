import type { FunctionalComponent } from "vue";
import styles from "./XtxSteps.module.less";
interface Props {
    active: number;
}
export const XtxSteps: FunctionalComponent<Props> = (props, ctx) => {
    const defaultSlots = ctx.slots.default?.();
    const target: any[] = [];
    defaultSlots?.map((item) => {
        if (typeof item.type === "symbol") {
            if (item.children instanceof Array) {
                item.children.forEach((item) => target.push(item));
            }
        } else {
            target.push(item);
        }
    });
    return (
        <div className={styles["xtx-steps"]}>
            {target?.map((item, index) => {
                return (
                    <div
                        className={`${styles["xtx-steps-item"]} ${index + 1 <= props.active ? styles.active : ""
                            }`}
                    >
                        <div className={styles.step}>
                            <span>{index + 1}</span>
                        </div>
                        <div className={styles.title}>{item.props.title}</div>
                        <div className={styles.desc}>{item.props.desc}</div>
                    </div>
                );
            })}
        </div>
    );
};
