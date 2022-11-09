<script setup lang="ts">
import { CATEGORIES } from "@/contants/categories";
import { useCategoryStore } from "@/stores/categoryStore";
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const { getCategories, toggle } = categoryStore;
getCategories();
</script>
<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <!-- 真实数据未请求成功之前，使用假数据 -->
    <template v-if="categories.status !== 'success'">
      <li v-for="category in CATEGORIES" :key="category.id">
        <a href="javascript:;">{{ category.name }}</a>
      </li>
    </template>
    <!-- 真是数据请求 完成之后，显示真实数据 -->
    <template v-else>
      <li
        v-for="category in categories.headerNav"
        :key="category.id"
        @mouseenter="toggle(category.id, true)"
        @mouseleave="toggle(category.id, false)"
        @click="toggle(category.id, false)"
      >
        <RouterLink :to="`/category/${category.id}`">{{
          category.name
        }}</RouterLink>
        <div class="layer" :class="{ open: category.isOpen }">
          <ul>
            <li v-for="subcategory in category.children" :key="subcategory.id">
              <RouterLink
                :to="`/category/sub/${category.id}/${subcategory.id}`"
              >
                <img :src="subcategory.picture" />
                <p>{{ subcategory.name }}</p>
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
    </template>
  </ul>
</template>
<style scoped lang="less">
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  .layer {
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ccc;
    transition: all 0.2s 0.1s;
    &.open {
      height: 132px;
      opacity: 1;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 70px;
      align-items: center;
      height: 132px;
      li {
        width: 110px;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          padding-top: 10px;
        }
        &:hover {
          p {
            color: @xtxColor;
          }
        }
      }
    }
  }
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }

    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }

      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}
</style>
