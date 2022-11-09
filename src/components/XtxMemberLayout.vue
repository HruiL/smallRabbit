<!-- src/components/XtxMemberLayout.vue -->
<template>
  <div class="container">
    <XtxMemberSidebar />
    <article class="article">
      <RouterView />
    </article>
  </div>
</template>

<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
    position: relative;
  }
}
</style>
