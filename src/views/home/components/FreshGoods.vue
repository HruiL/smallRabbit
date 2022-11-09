<script setup lang="ts">
import useLazyLoad from "@/logics/useLazyLoad";
import { useHomeStore } from "@/stores/homeStore";

const homeStore = useHomeStore();
const { getFreshGoods } = homeStore;
const { freshGoods } = storeToRefs(homeStore);
getFreshGoods();
const target = useLazyLoad(getFreshGoods);
</script>
<template>
  <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
    <template v-slot:right>
      <XtxMore />
    </template>
    <template v-slot:default>
      <div class="relative">
        <ul class="goods-list" ref="target">
          <li v-for="item in freshGoods.result" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
        <Transition name="fade">
          <HomeSkeleton v-if="freshGoods.status === 'loading'" />
        </Transition>
      </div>
    </template>
  </HomePanel>
</template>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
