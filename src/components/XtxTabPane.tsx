import type { FunctionalComponent } from "vue";

interface Props {
    name: string;
    label: string;
    isActive: boolean
}
export const XtxTabPane: FunctionalComponent<Props> = (props, context) => {
    return props.isActive ? <div>{context.slots.default?.()}</div> : null
}