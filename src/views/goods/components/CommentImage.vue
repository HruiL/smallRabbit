<!-- 评价列表商品组件: src/views/goods/components/CommentImage.vue -->
<script setup lang="ts">
// 接收商品图片列表
defineProps<{ pictures: string[] }>();
// 用来存储要显示哪张大图
const current = ref();
</script>

<template>
  <div class="goods-comment-image">
    <div class="list">
      <a href="javascript:" v-for="item in pictures" :key="item">
        <!-- 点击图片修改current为当前图片的链接 -->
        <img :src="item" alt="" @click="current = item" />
      </a>
    </div>
    <!-- 设置大图只有在current有值的情况下才能展示 -->
    <div class="preview" v-if="current">
      <!-- 大图的链接为current -->
      <img :src="current" alt="" />
      <!-- 点击×，将大图的链接设置为'' -->
      <i class="iconfont icon-close-new" @click="current = ''"></i>
    </div>
  </div>
</template>

<style scoped lang="less">
.goods-comment-image {
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    a {
      width: 120px;
      height: 120px;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      &.active {
        border-color: @xtxColor;
      }
    }
  }
  .preview {
    width: 480px;
    height: 480px;
    border: 1px solid #e4e4e4;
    background: #f8f8f8;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    i {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      text-align: center;
      line-height: 30px;
    }
  }
}
</style>
