<script setup lang="ts">
import { AuthAPI } from "@/api/AuthAPI";
import { useUserStore } from "@/stores/userStore";
import { toFormValidator } from "@vee-validate/zod";
import { Field, ErrorMessage } from "vee-validate";
import * as zod from "zod";
const userStore = useUserStore();
const { login } = userStore;
const validationSchema = toFormValidator(
  zod.object({
    account: zod
      .string({
        required_error: "请输入用户名",
      })
      .regex(/^[a-zA-Z]\w{2,19}$/, "字母开头且要是6-20个字符"),
    password: zod
      .string({ required_error: "请输入密码" })
      .regex(/^\w{6,24}$/, "密码是6-24个字符"),
    isAgree: zod.literal(true, {
      errorMap: () => ({ message: "请勾选用户协议" }),
    }),
  })
);
// 创建表单验证对象
const { handleSubmit, setFieldValue, validateField, values } = useForm<{
  account: string;
  password: string;
  isAgree: boolean;
}>({
  // 设置表单校验规则
  validationSchema,
  // 设置表单初始值
  // initialValues: {
  //   account: "",
  //   password: "",
  //   isAgree: false,
  // },
});
const onSubmit = handleSubmit((formValues) => {
  login(() => AuthAPI.loginByAccount(formValues.account, formValues.password));
});
</script>
<template>
  <form @submit.prevent="onSubmit">
    <Field name="account" as="div" class="form-item" v-slot="{ field }">
      <div class="input">
        <i class="iconfont icon-user"></i>
        <input v-bind="field" type="text" placeholder="请输入用户名" />
      </div>
      <ErrorMessage name="account" v-slot="{ message }">
        <div class="error">
          <i class="iconfont icon-warning"></i> {{ message }}
        </div>
      </ErrorMessage>
    </Field>
    <Field name="password" as="div" class="form-item" v-slot="{ field }">
      <div class="input">
        <i class="iconfont icon-lock"></i>
        <input
          v-bind="field"
          autocomplete="on"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <ErrorMessage name="password" v-slot="{ message }">
        <div class="error">
          <i class="iconfont icon-warning"></i> {{ message }}
        </div>
      </ErrorMessage>
    </Field>
    <Field name="isAgree" as="div" class="form-item" :validateOnChange="true">
      <div class="agree">
        <XtxCheckbox
          :checked="values.isAgree"
          @onChange="
            setFieldValue('isAgree', $event);
            validateField('isAgree');
          "
        />
        <span>我已同意</span>
        <a href="javascript:">《隐私条款》</a>
        <span>和</span>
        <a href="javascript:">《服务条款》</a>
      </div>
      <ErrorMessage name="isAgree" v-slot="{ message }">
        <div class="error">
          <i class="iconfont icon-warning"></i> {{ message }}
        </div>
      </ErrorMessage>
    </Field>
    <button type="submit" class="btn">登录</button>
  </form>
</template>
