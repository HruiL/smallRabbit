<script setup lang="ts">
import { useGoodsStore } from "@/stores/goodsStore";

const goodsStore = useGoodsStore();
// 从store对象中获取商品图片信息
const { mainPictures } = storeToRefs(goodsStore);
// 要显示的图片索引
const current = ref(0);
// 获取中图元素
const middleElement = ref();
// 获取鼠标距离中图的位置
const { isOutside, elementX, elementY } = useMouseInElement(middleElement);
// 记录镜片的位置
const layerPosition = reactive({ left: 0, top: 0 });
// 记录大图的位置
const bgPosition = reactive({ x: 0, y: 0 });
watchEffect(() => {
  // 记录镜片的位置
  layerPosition.left = elementX.value - 100;
  layerPosition.top = elementY.value - 100;
  // 对镜片元素的水平方向位置进行限制
  if (layerPosition.left < 0) {
    layerPosition.left = 0;
  } else if (layerPosition.left > 200) {
    layerPosition.left = 200;
  }
  // 对镜片元素的水平方向位置进行限制
  if (layerPosition.top < 0) {
    layerPosition.top = 0;
  } else if (layerPosition.top > 200) {
    layerPosition.top = 200;
  }
  // 记录大图位置
  bgPosition.x = -layerPosition.left * 2;
  bgPosition.y = -layerPosition.top * 2;
});
</script>

<template>
  <div class="goods-image">
    <div
      class="large"
      :style="{
        backgroundImage: `url(${mainPictures[current]})`,
        backgroundPositionX: bgPosition.x + 'px',
        backgroundPositionY: bgPosition.y + 'px',
      }"
      v-if="!isOutside"
    ></div>
    <div class="middle" ref="middleElement">
      <img :src="mainPictures[current]" alt="" />
      <div
        class="layer"
        v-if="!isOutside"
        :style="{
          left: layerPosition.left + 'px',
          top: layerPosition.top + 'px',
        }"
      ></div>
    </div>
    <ul class="small">
      <li
        :class="{ active: index === current }"
        v-for="(item, index) in mainPictures"
        :key="item"
        @mouseenter="current = index"
      >
        <img :src="item" alt="" />
      </li>
    </ul>
  </div>
</template>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
}
</style>
