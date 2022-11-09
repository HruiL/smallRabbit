<script setup lang="ts">
const {
  // 要绑定校验的数据 这是一个响应式对象
  value: usernameField,
  // 校验的错误提示
  errorMessage: usernameError,
  // 字段的校验情况
  meta: usernameMeta,
  // 重置字段，重置为初始状态，并不是清空状态
  resetField: usernameReset,
  // 设置字段的值
  setValue: usernameSet,
  // validate是一个方法，我们可以通过调用它来手动（动态）校验字段
  validate: usernameValidate,
} = useField<string>("username", username);
function username(value: unknown) {
  if (!value) return "请输入用户名";
  if (typeof value !== "string") return "用户名类型不正确";
  if (value.length < 2) return "用户名长度不能小于2";
  return true;
}
function onReset() {
  usernameReset();
  passwordReset();
}
function onSet() {
  usernameSet("王五");
  passwordSet("132465789");
}

// 手动对进行校验 应用场景：点击发送验证码时，需要先对手机号进行校验
function handle() {
  // 代码1
  usernameValidate();
  // 代码2
  console.log(usernameMeta);
  // 如果没有代码1，那么代码2的validated为false，如果有代码1,那么代码2的validated为true，也就是说代码1对字段进行了校验
  passwordValidate();
  console.log(passwordMeta);
}
function submit(event: Event) {
  event.preventDefault();
  if (usernameMeta.valid && usernameMeta.validated) {
    console.log("用户名校验通过");
  } else {
    console.log("用户名校验不通过");
  }
  if (passwordMeta.valid && passwordMeta.validated) {
    console.log("密码校验通过");
  } else {
    console.log("密码校验不通过");
  }
}

const {
  value: passwordValue,
  errorMessage: passwordError,
  meta: passwordMeta,
  validate: passwordValidate,
  setValue: passwordSet,
  resetField: passwordReset,
} = useField<string>("password", password);
function password(value: unknown) {
  if (!value) return "请输入密码";
  if (typeof value !== "string") return "密码类型不正确";
  if (value.length < 2) return "密码的长度不能小于2";
  return true;
}
</script>
<template>
  <form class="container mt-6">
    <div class="field">
      <label class="label">用户名</label>
      <div class="control has-icons-left">
        <input
          v-model="usernameField"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="usernameError">{{ usernameError }}</p>
    </div>
    <div class="field">
      <label class="label">密码</label>
      <div class="control has-icons-left">
        <input
          v-model="passwordValue"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-key"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="passwordError">{{ passwordError }}</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" @click="submit" class="button is-link">
          提交
        </button>
      </div>
      <div class="control">
        <button type="button" @click="onReset" class="button is-link is-light">
          重置
        </button>
      </div>
      <div class="control">
        <button type="button" @click="onSet" class="button is-link is-light">
          设置表单值
        </button>
      </div>
      <div class="control">
        <button type="button" @click="handle" class="button is-link is-light">
          validate是否执行
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="less" scoped>
@import "https://bulma.io/vendor/fontawesome-free-5.15.2-web/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>
