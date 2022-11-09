<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";

const categoryStore = useCategoryStore();
const route = useRoute();
const target = computed(() =>
  categoryStore.currentTop(route.params.id as string)
);
</script>
<template>
  <XtxBread>
    <XtxBreadItem path="/">首页</XtxBreadItem>
    <transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="target?.id">{{ target?.name }}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>
