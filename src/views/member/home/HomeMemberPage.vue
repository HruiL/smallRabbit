<script setup lang="ts">
import { useMemeberStore } from "@/stores/memberStore";

const memberStore = useMemeberStore();
const { getCollections } = memberStore;
const { collections } = storeToRefs(memberStore);
getCollections({ page: 1, pageSize: 4, collectType: 1 });
</script>
<template>
  <div class="member-home">
    <MemberHomeOverview />
    <MemberHomePanel title="我的收藏">
      <Gooditem
        v-for="item in collections[1].result.items.slice(0, 4)"
        :key="item.id"
        :goods="item"
      />
    </MemberHomePanel>
    <MemberHomePanel title="我的足迹" />
    <GoodsRelevant />
  </div>
</template>
<style scoped lang="less">
.member-home {
  :deep(.xtx-carousel) .carousel-btn.prev {
    left: 5px;
  }
  :deep(.xtx-carousel) .carousel-btn.next {
    right: 5px;
  }
}
</style>
