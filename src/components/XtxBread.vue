<script setup lang="ts">
import type { VNode } from "vue";

const defaults = useSlots().default?.();
function render() {
  let result = defaults?.reduce((res: VNode[], item, index, array) => {
    return res.concat(
      index < array.length - 1
        ? [item, h("i", { class: "iconfont icon-angle-right" })]
        : [item]
    );
  }, []);
  return h("div", { class: "xtx-bread" }, result);
}
</script>
<template>
  <render />
</template>
<style scoped lang="less">
.xtx-bread {
  display: flex;
  padding: 25px 10px;
}

:deep(i) {
  font-size: 12px;
  margin-left: 5px;
  margin-right: 5px;
  line-height: 20px;
}
</style>
