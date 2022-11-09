<script setup lang="ts">
import { AuthAPI } from "@/api/AuthAPI";
import { toFormValidator } from "@vee-validate/zod";
import { Field, ErrorMessage } from "vee-validate";
import * as zod from "zod";
import Message from "@/utils/Message";
import { AxiosError } from "axios";
import useCountdown from "@/logics/useCountdown";
import { useUserStore } from "@/stores/userStore";
// 定义表单校验规则

const validationSchema = toFormValidator(
  zod.object({
    mobile: zod
      .string({
        required_error: "请输入手机号",
        invalid_type_error: "手机号类型错误",
      })
      .regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
    code: zod
      .string({
        required_error: "请输入验证码",
        invalid_type_error: "验证码类型错误",
      })
      .regex(/^\d{6}$/, "验证码格式不正确"),
    isAgree: zod.literal(true, {
      errorMap: () => ({ message: "请勾选同意用户协议" }),
    }),
  })
);
// 创建表单校验对象
const { handleSubmit, values, setFieldValue, validateField } = useForm<{
  mobile: string;
  code: string;
  isAgree: boolean;
}>({
  validationSchema,
});
const userStore = useUserStore();
const { login } = userStore;
// 表单提交事件
const onSumbit = handleSubmit((formVlues) => {
  login(() => AuthAPI.loginByMobileMsgCode(formVlues.mobile, formVlues.code));
});
// 规范以use开头的方法只在script的最外层调用
const { start, count, isActive } = useCountdown();
// 发送手机验证码
async function sendMsgCode() {
  // 手机号是否校验通过 如果校验不通过阻止代码继续向下执行
  const { valid } = await validateField("mobile");
  if (!valid) return;
  // 如果倒计时正在进行 就阻止代码继续向下执行
  if (isActive.value) return;
  try {
    // 校验通过，发送手机验证码
    await AuthAPI.sendMsgCodeOfMobileLogin(values.mobile);
    // 消息提示
    Message({ type: "success", msg: "手机验证码发送成功" });
    // 开启倒计时
    start(60);
  } catch (e) {
    // 错误提示
    if (e instanceof AxiosError) {
      Message({ type: "error", msg: e.response?.data.message });
    } else {
      Message({ type: "error", msg: "手机验证码发送失败" });
    }
  }
}
</script>
<template>
  <form @submit="onSumbit">
    <Field name="mobile" as="div" class="form-item" v-slot="{ field }">
      <div class="input">
        <i class="iconfont icon-user"></i>
        <input v-bind="field" type="text" placeholder="请输入手机号" />
      </div>
      <ErrorMessage name="mobile" v-slot="{ message }">
        <div class="error">
          <i class="iconfont icon-warning"></i> {{ message }}
        </div>
      </ErrorMessage>
    </Field>
    <Field name="code" as="div" class="form-item" v-slot="{ field }">
      <div class="input">
        <i class="iconfont icon-code"></i>
        <input v-bind="field" type="password" placeholder="请输入验证码" />
        <span class="code" @click="sendMsgCode">{{
          isActive ? `剩余${count}秒` : "发送验证码"
        }}</span>
      </div>
      <ErrorMessage name="code" v-slot="{ message }">
        <div class="error">
          <i class="iconfont icon-warning"></i> {{ message }}
        </div>
      </ErrorMessage>
    </Field>
    <Field name="isAgree" as="div" class="form-item">
      <div class="agree">
        <XtxCheckbox
          :checked="values.isAgree"
          @onChange="setFieldValue('isAgree', $event), validateField('isAgree')"
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
