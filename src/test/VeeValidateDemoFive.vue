<script setup lang="ts">
import { toFormValidator } from "@vee-validate/zod";
import { Field, ErrorMessage } from "vee-validate";
import * as zod from "zod";
const validationSchema = toFormValidator(
  zod.object({
    username: zod
      .string({
        required_error: "请输入用户名",
        invalid_type_error: "用户名类型错误",
      })
      .min(2, { message: "用户名的长度不能小于2" })
      .max(16, { message: "用户名的长度不能大于16" }),
    password: zod
      .string({
        required_error: "请输入密码",
        invalid_type_error: "密码类型错误",
      })
      .regex(/^\w{6,24}/, "密码是6-24个字符"),
  })
);
const { handleSubmit } = useForm<{ username: string; password: string }>({
  validationSchema,
});
const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>
<template>
  <form class="container mt-6" @submit="onSubmit">
    <Field
      as="div"
      name="username"
      class="field"
      v-slot="{ field }"
      :validate-on-input="true"
    >
      <label class="label">用户名</label>
      <div class="control has-icons-left">
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
      <ErrorMessage name="username" v-slot="{ message }">
        <p class="help is-danger">{{ message }}</p>
      </ErrorMessage>
    </Field>
    <Field as="div" name="password" class="field" v-slot="{ field }">
      <label class="label">密码</label>
      <div class="control has-icons-left">
        <input
          v-bind="field"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-key"></i>
        </span>
      </div>
      <ErrorMessage name="password" v-slot="{ message }">
        <p class="help is-danger">{{ message }}</p>
      </ErrorMessage>
    </Field>
    <div class="field is-grouped mt-3">
      <div class="control">
        <button type="submit" class="button is-link">提交</button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light">重置</button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light">
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
