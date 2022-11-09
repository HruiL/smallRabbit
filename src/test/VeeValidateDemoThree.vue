<script setup lang="ts">
import { Field, Form, ErrorMessage } from "vee-validate";
// 验证用户名
function username(value: unknown) {
  if (!value) return "请输入用户名";
  if (typeof value !== "string") return "用户名类型错误";
  if (value.length < 2) return "用户名的长度不能小于2";
  return true;
}

// 验证密码
function password(value: unknown) {
  if (!value) return "请输入密码";
  if (typeof value !== "string") return "密码类型错误";
  if (value.length < 6) return "密码的长度不能小于6";
  return true;
}
// 表单提交
function onSubmit(value: any) {
  console.log(value);
}
</script>
<template>
  <Form
    as=""
    :initial-values="{ username: 'lisi', password: '132456' }"
    v-slot="{ handleSubmit, handleReset, setValues }"
    :validate-on-mount="true"
  >
    <form class="container mt-6" @submit.prevent="handleSubmit(onSubmit)">
      <Field
        name="username"
        as="div"
        class="field"
        :rules="username"
        :validate-on-mount="true"
        :validate-on-input="true"
        :validate-on-blur="true"
        v-slot="{ field }"
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
      <Field
        name="password"
        as="div"
        class="field"
        :rules="password"
        :validate-on-mount="true"
        v-slot="{ field }"
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
        <ErrorMessage name="password" v-slot="{ message }">
          <p class="help is-danger">{{ message }}</p>
        </ErrorMessage>
      </Field>

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
          <button
            type="button"
            class="button is-link is-light"
            @click="setValues({ username: '小白', password: '368416874867' })"
          >
            设置表单值
          </button>
        </div>
      </div>
    </form>
  </Form>
</template>

<style lang="less" scoped>
@import "https://bulma.io/vendor/fontawesome-free-5.15.2-web/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>
