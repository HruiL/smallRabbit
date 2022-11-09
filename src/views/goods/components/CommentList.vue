<script setup lang="ts">
import { useGoodsStore } from "@/stores/goodsStore";
import type { EvaluateRequestParams, EvaluateSpec } from "@/types/Goods";
import { onBeforeRouteUpdate } from "vue-router";

const props = defineProps<{ reqParams: EvaluateRequestParams }>();
const goodsStore = useGoodsStore();
const { evaluateList } = storeToRefs(goodsStore);
const { getEvaluateList } = goodsStore;
const route = useRoute();
getEvaluateList(route.params.id as string, props.reqParams);
// 格式化用户昵称
function formatNickname(nickname: string) {
  return nickname.slice(0, 1) + "****" + nickname.slice(-1);
}
// 格式化商品规格
function formatSpecs(specs: EvaluateSpec[]) {
  return specs.map((item) => `${item.name}: ${item.nameValue}  `).join("  ");
}
// 监听reqParams的变化
watch(
  () => props.reqParams,
  () => {
    getEvaluateList(route.params.id as string, props.reqParams);
  },
  {
    immediate: true,
    deep: true,
  }
);
onBeforeRouteUpdate((to) => {
  getEvaluateList(to.params.id as string, props.reqParams);
});
</script>
<template>
  <div class="list">
    <div class="item" v-for="item in evaluateList.result.items">
      <div class="user">
        <img :src="item.member.avatar" alt="" />
        <span>{{ formatNickname(item.member.nickname) }}</span>
      </div>
      <div class="body">
        <div class="score">
          <i
            v-for="i in 5"
            :class="['iconfont', i <= item.score ? 'icon-wjx01' : 'icon-wjx02']"
          ></i>
          <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
        </div>
        <div class="text">
          {{ item.content }}
        </div>
        <!-- 评价图片 -->
        <CommentImage
          :pictures="item.pictures"
          v-if="item.pictures.length > 0"
        />
        <div class="time">
          <span>{{ item.createTime }}</span>
          <span class="zan"
            ><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.list {
  padding: 0 20px;
  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    .user {
      width: 160px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span {
        padding-left: 10px;
        color: #666;
      }
    }
    .body {
      flex: 1;
      .score {
        line-height: 40px;
        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }
        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }
    .text {
      color: #666;
      line-height: 24px;
    }
    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
</style>
