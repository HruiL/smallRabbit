<script lang="ts" setup>
import { useCategoryStore } from "@/stores/categoryStore";
import type { GoodsRequestParams } from "@/types/Goods";
import transform from "lodash/transform";
import omitBy from "lodash/omitBy";
import { onBeforeRouteUpdate } from "vue-router";

const categoryStore = useCategoryStore();
const { subCategoryFilters } = storeToRefs(categoryStore);
const { getSubCategoryFilters } = categoryStore;
const route = useRoute();
getSubCategoryFilters(route.params.sub as string);
// 父组件需要的商品请求的参数的类型
type FilterParams = Partial<Pick<GoodsRequestParams, "brandId" | "attrs">>;
// 定义当前组件要触发的自定义事件
const emit = defineEmits<{ (e: "onChanged", params: FilterParams): void }>();
// 用户进行筛选条件时使用的类型
interface SelectedFilters {
  brandId: string;
  [groupName: string]: string;
}
// 用于存储用户选择的筛选条件
// 由于所有的筛选条件都是可选的，所以这里使用了partial
const selectedFilters = ref<Partial<SelectedFilters>>({});
// 更新筛选条件
function onSelectedFilterChanged(filters: Partial<SelectedFilters>) {
  selectedFilters.value = { ...selectedFilters.value, ...filters };
  // 重构筛选条件，修改成服务端需要的数据类型
  const params = transform(
    omitBy(selectedFilters.value, (value) => value === undefined),
    (result: FilterParams, value, key) => {
      // 如果属性是品牌id
      if (key === "brandId") {
        // 直接存储品牌id
        result[key] = value;
      } else {
        // 否则是其他的筛选条件
        // 判断attrs数组是否存在，如果不存在，就创建
        if (typeof result.attrs === "undefined") result.attrs = [];
        // 存储筛选条件类别的名字和具体的筛选条件名字
        result.attrs.push({
          groupName: key,
          propertyName: value!,
        });
      }
    },
    {}
  );
  // 把用户选择的筛选条件传递给父组件 以备使用
  emit("onChanged", params);
}
onBeforeRouteUpdate((to) => {
  getSubCategoryFilters(to.params.sub as string);
  selectedFilters.value = {};
});
</script>
<template>
  <div class="sub-filter" v-if="subCategoryFilters.status === 'loading'">
    <XtxSkeleton class="item" width="800px" height="25px" />
    <XtxSkeleton class="item" width="800px" height="25px" />
    <XtxSkeleton class="item" width="600px" height="25px" />
    <XtxSkeleton class="item" width="600px" height="25px" />
    <XtxSkeleton class="item" width="600px" height="25px" />
  </div>
  <div class="sub-filter" v-else>
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:"
          :class="{ active: selectedFilters.brandId === undefined }"
          @click="onSelectedFilterChanged({ brandId: undefined })"
          >全部</a
        >
        <a
          href="javascript:"
          v-for="item in subCategoryFilters.result[route.params.sub as string]?.brands"
          :key="item.id"
          :class="{ active: item.id === selectedFilters.brandId }"
          @click="onSelectedFilterChanged({ brandId: item.id })"
          >{{ item.name }}</a
        >
      </div>
    </div>
    <div
      class="item"
      v-for="saleProperties in subCategoryFilters.result[route.params.sub as string]?.saleProperties"
      :key="saleProperties.id"
    >
      <div class="head">{{ saleProperties.name }}</div>
      <div class="body">
        <a
          href="javascript:"
          :class="{
            active: selectedFilters[saleProperties.name] === undefined,
          }"
          @click="onSelectedFilterChanged({ [saleProperties.name]: undefined })"
          >全部</a
        >
        <a
          href="javascript:"
          v-for="property in saleProperties.properties"
          :key="property.id"
          @click="
            onSelectedFilterChanged({ [saleProperties.name]: property.name })
          "
          :class="{
            active: selectedFilters[saleProperties.name] === property.name,
          }"
          >{{ property.name }}</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
  margin: 10px 0;
}
</style>
