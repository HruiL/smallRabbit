<script setup lang="ts">
import type { Status } from "@/types/Status";
import axios from "axios";

// 声明城市数据类型
interface City {
  code: string;
  level: number;
  name: string;
  areaList: City[];
}
interface AddressCode {
  provinceCode: string;
  cityCode: string;
  countyCode: string;
}

interface AddressName {
  provinceName: string;
  cityName: string;
  countyName: string;
}
// 用于控制弹框的显示和隐藏
const visible = ref(false);
// 获取组件的最外层元素
const target = ref();
// 缓存城市数据
let cachedCities: City[] = [];
// 城市数据的加载状态
const status = ref<Status>("idle");
// 在页面中显示的城市状态
const cities = ref<City[]>();
// 用于存储省市区编码
const addressCode: Partial<AddressCode> = {};
// 用于存储省市区名称
const addressName: Partial<AddressName> = {};
// 声明当前组件要触发的自定义事件
const emit = defineEmits<{
  (e: "onChanged", addressCode: AddressCode): void;
  (e: "update:fullLocation"): void;
}>();
// placeholder 提示用户操作的文字
// 接收外部传递进来的 fullLocation => v-model:fullLocation = ""
const props = withDefaults(
  defineProps<{ placeholder?: string; fullLocation: string }>(),
  {
    placeholder: "请选择收货地址",
  }
);
//存储用户选择的城市名称
const selectCity = useVModel(props, "fullLocation");
// 控制弹框显示
async function show() {
  visible.value = true;
  // 如果没有缓存数据
  if (cachedCities.length === 0) {
    // 更新城市数据加载状态
    status.value = "loading";
    // 发送请求获取城市数据
    const respose = await axios.get(
      " https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
    );
    // 存储数据
    cachedCities = respose.data;
    // 更新城市数据加载状态
    status.value = "success";
  }
  cities.value = cachedCities;
}
// 控制弹框隐藏
function hide() {
  visible.value = false;
}
// 控制弹框切换
function toggle() {
  visible.value ? hide() : show();
}
// 更新城市弹层内容，记录用户选择的城市编码
function updateCities(code: string, level: number, name: string) {
  // 更新城市弹层内容
  cities.value = cities.value?.find((city) => city.code === code)?.areaList;
  // 匹配城市级别
  switch (level) {
    case 0:
      addressCode.provinceCode = code;
      addressName.provinceName = name;
      break;
    case 1:
      addressCode.cityCode = code;
      addressName.cityName = name;
      break;
    case 2:
      addressCode.countyCode = code;
      addressName.countyName = name;
      // 通过自定义事件的方式将用户选择的省市区编码传递到组件外部
      emit("onChanged", addressCode as Required<AddressCode>);
      // 隐藏弹框
      hide();
      // 存储用户选择的城市名称
      selectCity.value =
        addressName.provinceName! +
        addressName.cityName! +
        addressName.countyName!;
  }
}
// 点击别的地方也要隐藏组件
// 参数一，目标元素
// 参数二，回调函数，因为hide本身就是一个函数，所以直接放在参数二的位置
onClickOutside(target, hide);
</script>
<template>
  <div class="xtx-city" ref="target">
    <div :class="['select', visible ? 'active' : '']" @click="toggle">
      <span class="placeholder" v-if="!selectCity">{{ placeholder }}</span>
      <span class="value" v-else>{{ selectCity }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <template v-if="status === 'success'">
        <span
          @click="updateCities(item.code, item.level, item.name)"
          class="ellipsis"
          v-for="item in cities"
          :key="item.code"
          >{{ item.name }}</span
        >
      </template>
      <template v-if="status === 'loading'">
        <div class="loading"></div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(@/assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
