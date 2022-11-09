<script setup lang="ts">
import { AuthAPI } from "@/api/AuthAPI";
import { useUserStore } from "@/stores/userStore";
import Message from "@/utils/Message";

const hasAccount = ref(true);
// 获取路由跳转信息对象
const router = useRouter();
// 获取userStore
const userStore = useUserStore();
const unionId = ref<undefined | string>();
// 检测当前的登录状态
// 如果已经进行了qq登录
window.QC.Login.getMe((openId: string) => {
  unionId.value = openId;
  userStore.login(() => AuthAPI.loginByQQOpenid(openId));
});
// 监听登录状态
watch(
  () => userStore.profile.status,
  (status) => {
    if (status === "success") {
      Message({ type: "success", msg: "登陆成功" });
      router.push("/");
    } else if (status === "error") {
      Message({ type: "error", msg: userStore.profile.error + "请绑定账号" });
    }
  }
);
</script>

<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="userStore.profile.status == 'loading'">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:"
      >
        <i class="iconfont icon-bind"></i>
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:"
      >
        <i class="iconfont icon-edit"></i>
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <QQLoginBindPhone :unionId="unionId" v-if="unionId" />
    </div>
    <div class="tab-content" v-else>
      <QQLoginRegisterNew :unionId="unionId" v-if="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<style scoped lang="less">
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(@/assets/images/load.gif) no-repeat center / 100px
        100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
