<script setup lang="ts">
const validationSchema = {
  // 验证用户名
  username(value: unknown) {
    if (!value) return "请输入用户名";
    if (typeof value !== "string") return "用户名类型错误";
    if (value.length < 2) return "用户名的长度不能小于2";
    return true;
  },
  // 验证密码
  password(value: unknown) {
    if (!value) return "请输入密码";
    if (typeof value !== "string") return "密码类型错误";
    if (value.length < 6) return "密码的长度不能小于6";
    return true;
  },
};
// 创建表单级验证对象
const {
  handleSubmit,
  handleReset,
  useFieldModel,
  setFieldValue,
  errors,
  setValues,
} = useForm<{ username: string; password: string }>({
  validationSchema,
  initialValues: { username: "lisi", password: "123456" },
});
// 这里useFieldModel 里面传递的 username和password是和上面的validationSchema校验规则里的字段保持一致
// 获取表单字段响应式对象
const [username, password] = useFieldModel(["username", "password"]);
// handleSubmit里面传递的函数只有在表单校验通过时才会执行
// handleSubmit会返回一个函数，我们将这个函数和表单的submit事件进行绑定
// 这样做的好处是，只有当表单校验通过，才会发生提交行为
const onSubmit = handleSubmit((value) => {
  console.log(value);
});

// 设置表单值
function onSet() {
  // setFieldValue("username", "王五");
  // setFieldValue("password", "123465");
  setValues({ username: "xiao", password: "4578913565436554" });
}
</script>
<template>
  <form class="container mt-6" @submit="onSubmit">
    <div class="field">
      <label class="label">用户名</label>
      <div class="control has-icons-left">
        <input
          v-model="username"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="errors.username">{{ errors.username }}</p>
    </div>
    <div class="field">
      <label class="label">密码</label>
      <div class="control has-icons-left">
        <input
          v-model="password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-key"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="errors.password">{{ errors.password }}</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">提交</button>
      </div>
      <div class="control">
        <button
          @click="handleReset"
          type="button"
          class="button is-link is-light"
        >
          重置
        </button>
      </div>
      <div class="control">
        <button @click="onSet" type="button" class="button is-link is-light">
          设置表单值
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="less" scoped>
@import "https://bulma.io/vendor/fontawesome-free-5.15.2-web/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>
