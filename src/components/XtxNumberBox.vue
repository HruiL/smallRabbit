<script setup lang="ts">
// 接受外部传递进来的状态
const props = withDefaults(
  defineProps<{
    // 库存量
    max: number;
    // 数量
    count: number;
    // 数量选择框左边的文字
    label?: string;
  }>(),
  {
    label: "数量",
  }
);
// 声明当前组件要出发的自定义事件
const emit = defineEmits<{ (e: "update:count"): void }>();
// 实现[数量]的双向数据绑定
// useVModel的返回值就是 父组件传递过来的count的值
const number = useVModel(props, "count", emit);
// 修改数量
function onChange(step: 1 | -1) {
  const currentNum = number.value + step;
  if (currentNum < 1) {
    number.value = 1;
  } else if (currentNum > props.max) {
    number.value = props.max;
  } else {
    number.value = currentNum;
  }
}
</script>
<template>
  <div class="xtx-number-box">
    <div class="label">{{ label }}</div>
    <div class="number-box">
      <a href="javascript:" @click="onChange(-1)">-</a>
      <input type="text" readonly :value="count" />
      <a href="javascript:" @click="onChange(1)">+</a>
    </div>
  </div>
</template>

<style scoped lang="less">
.xtx-number-box {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .number-box {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
