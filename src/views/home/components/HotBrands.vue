<script lang="ts" setup>
import { useHomeStore } from "@/stores/homeStore";

const homeStore = useHomeStore();
const { brands } = storeToRefs(homeStore);
const target = ref<0 | -1240>(0);
</script>
<template>
  <HomePanel title="热门品牌" subTitle="国际经典 品质保证">
    <template v-slot:right>
      <a
        href="javascript:"
        class="iconfont icon-angle-left prev"
        @click="target = 0"
        :class="{ disabled: target === 0 }"
      ></a>
      <a
        href="javascript:"
        class="iconfont icon-angle-right next"
        @click="target = -1240"
        :class="{ disabled: target === -1240 }"
      ></a>
    </template>
    <template v-slot:default>
      <div class="box">
        <ul class="list" :style="{ transform: `translateX(${target}px)` }">
          <li v-for="brand in brands.result" :key="brand.id">
            <RouterLink to="/">
              <img :src="brand.picture" alt="" />
            </RouterLink>
          </li>
        </ul>
      </div>
    </template>
  </HomePanel>
</template>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
