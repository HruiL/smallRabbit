<script lang="ts" setup>
// const checked = ref(false);
const emit = defineEmits<{
  //   (e: "update:modelValue", checked: boolean): void;
  (e: "onChange", checked: boolean): void;
}>();
// 如果外部没有传modelValue那么modelValue的值是false，不符合我们的要求，我们给他设置一个初始值为undefined
const props = withDefaults(
  defineProps<{ modelValue?: boolean; checked?: boolean }>(),
  {
    modelValue: undefined,
  }
);
// 是否使用双向数据绑定 isVModel为true 说明用了双向数据绑定 为false说明没有用双向数据绑定
const isVModel = typeof props.modelValue !== "undefined";
// 声明复选框是否选中状态
const isChecked = isVModel
  ? useVModel(props, "modelValue", emit)
  : ref(props.checked);
// 切换复选框选中、取消选中状态
const toggle = () => {
  isChecked.value = !isChecked.value;
  //   emit("update:modelValue", checked.value);
  if (!isVModel) emit("onChange", isChecked.value);
};
watch(
  () => props.checked,
  (current) => {
    if (!isVModel) {
      isChecked.value = current;
    }
  }
);
</script>
<template>
  <div class="xtx-checkbox" @click="toggle">
    <i class="iconfont icon-checked" v-if="isChecked"></i>
    <i class="iconfont icon-unchecked" v-else></i>
    <span v-if="$slots.default"><slot></slot></span>
  </div>
</template>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
