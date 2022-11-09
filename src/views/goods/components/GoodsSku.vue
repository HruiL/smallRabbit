<script setup lang="ts">
import type { Sku, Spec } from "@/types/Goods";
import type { Data } from "@/stores/goodsStore";
import bwPowerSet from "@/vendors/power-set";
const props = defineProps<{ specs: Spec[]; skus: Sku[]; skuId?: string }>();
const emit = defineEmits<{
  (e: "complete", data: Data): void;
  (e: "unComplete"): void;
}>();
// 用户选择规格时的UI状态类型
interface UIStatus {
  // 选中
  selected: boolean;
  // 禁用
  disabled: boolean;
}
// 创建specs的映射状态
function createUIStatus(specs: Spec[]): UIStatus[][] {
  // 存储UI状态的数组
  const uiStatus: UIStatus[][] = [];
  // 遍历源规格数据
  specs.forEach((spec) => {
    // 规格组
    const skuUiGroup: UIStatus[] = [];
    // 遍历每个规格下的多个选项
    spec.values.forEach(() => {
      // 设置每个规格的选中状态和禁用状态
      skuUiGroup.push({ selected: false, disabled: false });
    });
    // 将规格组对象添加到UI状态中
    uiStatus.push(skuUiGroup);
  });
  // 返回UI状态数组
  return uiStatus;
}
// specs的映射状态
const UIState = reactive(createUIStatus(props.specs));

// 更新用户的选中状态
function updateSelectedUIState(i: number, j: number) {
  // 获取当前用户点击的规格
  const current = UIState[i][j];
  // 如果当前规格是禁用状态，则不能被选择，阻止代码向下执行
  if (current.disabled) return;
  // 获取当前用户点击的规格对应的规格组
  const skuUiGroup = UIState[i];
  // 如果当前规格已经被选中，再次点击后取消选中
  if (current.selected) {
    current.selected = false;
  } else {
    // 一个规格组中只能有一个规格被选中
    // 1. 先将该规格组中的所有规格取消选中
    skuUiGroup.forEach((item) => (item.selected = false));
    // 2. 将当前用户点击的规格设置为true
    current.selected = true;
  }
  // getUserSelected();
  setDisabledUIState();
  sendGoodsInfoToParent();
}
// 获取规格查询字典
const pathMap = createPathMap();

// 规范查询字典类型规范
interface PathMap {
  [key: string]: string | null;
}

// 创建规格查询字典
function createPathMap() {
  // 存储查询对象
  const pathMap: PathMap = {};
  const a = props.skus
    // 过滤出所有有库存的商品
    .filter((sku) => sku.inventory > 0)
    // 遍历所有有库存的商品
    .forEach((sku) => {
      // 存储规格名称
      const valueNames = sku.specs.map((item) => item.valueName);
      // 获取用户所有可以选择的规格以及规格组合
      // [['蓝色'],['20cm'],['中国'],['蓝色','20cm']]
      const sets = bwPowerSet(valueNames).filter((item) => item.length > 0);
      // 获取当前规格的商品数量，用来判断某个规格是否是完整的
      const max = valueNames.length;
      // 遍历用户可以选择的所有可能的规格及规格组合
      sets.forEach((item) => {
        // 将规格名称以_进行拼接
        const key = item.join("_");
        // 当前规格是否完整
        const isCompleted = item.length === max;
        // 判断规格查询对象中是否已经存储了当前规格
        // 在没有的情况下，才进行存储
        if (!(key in pathMap)) {
          // 判断当前规格是否完整
          if (isCompleted) {
            // 将当前规格或者规格组合添加到规格查询对象中，并赋值sku id
            pathMap[key] = sku.id;
          } else {
            // 将当前规格或者规格组合添加到规格查询对象中
            pathMap[key] = null;
          }
        }
      });
    });
  // 返回查询对象
  return pathMap;
}

// 设置规格的禁用状态
// 更新规格的禁用状态（初始化）
function setDisabledUIState() {
  // 获取页面中显示的规格数据
  const specs = props.specs;
  specs.forEach((spec, index) => {
    // 获取用户选择的规格名称数组
    const selected = getUserSelected();
    // 遍历每一组规格中的具体数据
    spec.values.forEach((value, i) => {
      // 如果当前规格已经被选中，说明可以选，不需要被禁用
      if (UIState[index][i].selected) return;
      // 将当前规格名称替换到selected数组中
      // 比如：原先 => ['黑色','日本',undefined]
      // 替换之后：['蓝色',‘日本,undefined]
      selected[index] = value.name;
      // 检测当前规格是否可以被选中，过滤出值为undefined的
      const key = selected.filter((name) => name).join("_");
      // 设置规格的禁用状态
      // 如果当前规格名称在规格查询对象中存在，说明这个规格可以选择
      UIState[index][i].disabled = !(key in pathMap);
    });
  });
}

// 获取用户选择的规格名称数组
// 想得到的格式：['黑色',undefined,'30cm'] ['黑色','日本',undefined] ['黑色',undefined,undefined]
function getUserSelected() {
  // 存储用户选择的规格名称数组
  const names: (string | undefined)[] = [];
  props.specs.forEach((spec, index) => {
    // 查找当前规格组中被选中的规格的索引
    const selectIndex = UIState[index].findIndex((item) => item.selected);
    // findIndex 找到返回对应的索引，找不到返回-1
    if (selectIndex !== -1) {
      // 如果找到了 将选中的规格名称添加到names数组中相对应的位置上
      names[index] = spec.values[selectIndex].name;
    } else {
      // 如果没有找到，用undefined占位
      names[index] = undefined;
    }
  });
  // 返回用户选择的规格名称数组
  return names;
}
// 设置规格默认选中
function setSpecDefaultSelected() {
  // 判断有没有传skuId
  if (typeof props.skuId !== "undefined") {
    // 查找默认选中的规格对象, 从中获取规格名称
    const selected = props.skus.find((sku) => sku.id === props.skuId);
    // 判断有没有找到规格对象，没找到阻止代码向下执行
    if (typeof selected === "undefined") return;
    // 获取默认选中的规格名称数组
    const names = selected.specs.map((item) => item.valueName);
    // 遍历页面显示的规格数据
    props.specs.forEach((spec, index) => {
      // 遍历规格选项
      spec.values.forEach((value, i) => {
        // 匹配到要显示的规格，将要显示的规格selected设置为true
        if (names.includes(value.name)) {
          UIState[index][i].selected = true;
        }
      });
    });
  }
}

// 向父组件传递商品信息
function sendGoodsInfoToParent() {
  // 获取用户选择的规格名称数组
  const selected = getUserSelected().filter((name) => name);
  // 判断用户是否选择的是完整的规格信息
  if (selected.length === props.specs.length) {
    // 获取规格id
    const skuId = pathMap[selected.join("_")]!;
    // 根据id查找规格对象
    const sku = props.skus.find((sku) => sku.id === skuId);
    // 如果找到了规格对象
    if (typeof sku !== "undefined") {
      const { price, oldPrice, inventory } = sku;
      // 触发自定义事件，向外部传递最新商品信息
      emit("complete", {
        price,
        oldPrice,
        inventory,
        skuId,
      });
    }
  } else {
    // 用户没有选择完整的规格
    emit("unComplete");
  }
}
setDisabledUIState();
setSpecDefaultSelected();
</script>
<template>
  <div class="goods-sku">
    <dl v-for="(spec, i) in specs" :key="spec.id">
      <dt>{{ spec.name }}</dt>
      <dd>
        <!-- 规格中有图片，优先显示图片，否则显示文字 -->
        <template v-for="(item, j) in spec.values">
          <img
            v-if="item.picture"
            :src="item.picture"
            :alt="item.name"
            :class="{
              selected: UIState[i][j].selected,
              disabled: UIState[i][j].disabled,
            }"
            @click="updateSelectedUIState(i, j)"
          />
          <span
            v-else
            :class="{
              selected: UIState[i][j].selected,
              disabled: UIState[i][j].disabled,
            }"
            @click="updateSelectedUIState(i, j)"
            >{{ item.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 5px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
