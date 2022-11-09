<script lang="ts" setup>
import { Field, ErrorMessage } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import * as zod from "zod";
const validationSchema = toFormValidator(
  zod.object({
    users: zod.array(
      zod.object({
        username: zod
          .string({
            required_error: "请输入用户名",
            invalid_type_error: "用户名类型错误",
          })
          .min(2, { message: "用户名长度不能小于2" })
          .max(16, { message: "用户名长度不能大于16" }),
        password: zod
          .string({
            required_error: "请输入密码",
            invalid_type_error: "密码类型错误",
          })
          .regex(/^\w{6,24}$/, "密码是6-24位"),
      })
    ),
  })
);
const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    users: [{ username: "", password: "" }],
  },
});
const { remove, push, fields } = useFieldArray<{
  username: string;
  password: string;
}>("users");
const onSumbit = handleSubmit((value) => {
  console.log(value);
});
</script>
<template>
  <form class="container mt-6" @submit="onSumbit">
    <template v-for="(item, index) in fields" :key="item.key">
      <Field
        :name="`users[${index}].username`"
        class="field"
        v-slot="{ field }"
        as="div"
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
        <ErrorMessage :name="`users[${index}].username`" v-slot="{ message }">
          <p class="help is-danger">{{ message }}</p>
        </ErrorMessage>
      </Field>
      <Field
        :name="`users[${index}].password`"
        class="field"
        v-slot="{ field }"
        as="div"
      >
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
        <ErrorMessage :name="`users[${index}].password`" v-slot="{ message }">
          <p class="help is-danger">{{ message }}</p>
        </ErrorMessage>
      </Field>
      <div class="control">
        <button type="button" class="button is-danger" @click="remove(index)">
          删除
        </button>
      </div>
    </template>
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">提交</button>
      </div>

      <div class="control">
        <button type="button" class="button is-link is-light">重置</button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="push({ username: '', password: '' })"
        >
          添加
        </button>
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
