<script setup lang="ts">
import { AuthAPI } from "@/api/AuthAPI";
import useCountdown from "@/logics/useCountdown";
import { useUserStore } from "@/stores/userStore";
import Message from "@/utils/Message";
import { toFormValidator } from "@vee-validate/zod";
import { AxiosError } from "axios";
import { ErrorMessage, Field } from "vee-validate";
import * as zod from "zod";
const props = defineProps<{ unionId: string }>();
const userStore = useUserStore();
// 创建表单的校验规则
const validationSchema = toFormValidator(
  zod
    .object({
      account: zod
        .string({
          required_error: "请输入用户名",
          invalid_type_error: "用户名类型不正确",
        })
        .regex(/^[a-zA-Z]\w{2,19}$/, "字母开头且2-19个字符"),
      mobile: zod
        .string({
          required_error: "请输入手机号",
          invalid_type_error: "手机号类型不正确",
        })
        .regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
      code: zod
        .string({
          required_error: "请输入验证码",
          invalid_type_error: "验证码类型不正确",
        })
        .regex(/^\d{6}$/, "验证码格式错误"),
      password: zod
        .string({
          required_error: "请输入密码",
          invalid_type_error: "密码类型不正确",
        })
        .regex(/^\w{6,24}$/, "密码是6-24位"),
      confirm: zod.string({ required_error: "请再次输入密码" }),
    })
    // refine回调函数里的data是实时监听到的表单的输入值，comfirm的值只要发生变化就会监听到
    .refine((data) => data.password === data.confirm, {
      message: "俩次密码输入不一致",
      path: ["confirm"],
    })
);
// 创建表单验证对象
const { handleSubmit, setFieldError, validateField, values } = useForm({
  validationSchema,
});

// 验证用户名是否唯一
const checkAccountUnique = zod.string().refine(
  async (account) => {
    const response = await AuthAPI.checkAccountUnique(account);
    // valid: true 用户名已存在
    // valid: false 用户名不存在可以注册
    // 用户名存在不能通过校验，要有错误提示，用户名不存在，才可通过校验
    return !response.result.valid;
  },
  {
    message: "用户名已存在",
  }
);
// 表单提交
const onSubmit = handleSubmit(async (formValues: any) => {
  try {
    // checkAccountUnique函数的返回值是account的值
    await checkAccountUnique.parseAsync(formValues.account);
    userStore.login(() =>
      AuthAPI.loginByBindNewAccount(props.unionId, formValues)
    );
  } catch (e) {
    if (e instanceof zod.ZodError) {
      setFieldError("account", e.errors[0].message);
    }
  }
});
const { start, count, isActive } = useCountdown();
// 发送验证码
async function sendMsg() {
  // 判断用户是否输入合法的手机号
  const { valid } = await validateField("mobile");
  // 如果没有输入合法的手机号，阻止代码向下执行
  if (!valid) return;
  if (isActive.value) return;
  // 发送短信验证码，捕获错误
  try {
    // 发送请求，获取手机验证码
    await AuthAPI.sendMsgCodeOfRegister(values.mobile);
    // 消息弹框提示
    Message({ type: "success", msg: "手机验证码发送成功" });
    // 开启倒计时
    start(60);
  } catch (e) {
    if (e instanceof AxiosError) {
      Message({ type: "error", msg: e.response?.data.message });
    } else {
      Message({ type: "error", msg: "手机验证码发送失败" });
    }
  }
}
</script>
<template>
  <form class="xtx-form" @submit="onSubmit">
    <Field name="account" as="div" class="xtx-form-item" v-slot="{ field }">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <ErrorMessage name="account" v-slot="{ message }">
        <div class="error">{{ message }}</div>
      </ErrorMessage>
    </Field>
    <Field name="mobile" as="div" class="xtx-form-item" v-slot="{ field }">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <ErrorMessage name="mobile" v-slot="{ message }">
        <div class="error">{{ message }}</div>
      </ErrorMessage>
    </Field>
    <Field name="code" as="div" class="xtx-form-item" v-slot="{ field }">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="code" @click="sendMsg">{{
          isActive ? `剩余${count}秒` : "发送验证码"
        }}</span>
      </div>
      <ErrorMessage name="code" v-slot="{ message }">
        <div class="error">{{ message }}</div>
      </ErrorMessage>
    </Field>
    <Field name="password" as="div" class="xtx-form-item" v-slot="{ field }">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <input
          v-bind="field"
          class="input"
          type="password"
          placeholder="请输入密码"
          autocomplete="on"
        />
      </div>
      <ErrorMessage name="password" v-slot="{ message }">
        <div class="error">{{ message }}</div>
      </ErrorMessage>
    </Field>
    <Field name="confirm" as="div" class="xtx-form-item" v-slot="{ field }">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <input
          v-bind="field"
          class="input"
          type="password"
          placeholder="请确认密码"
          autocomplete="on"
        />
      </div>
      <ErrorMessage name="confirm" v-slot="{ message }">
        <div class="error">{{ message }}</div>
      </ErrorMessage>
    </Field>
    <input type="submit" class="submit" value="立即绑定" />
  </form>
</template>

<style scoped lang="less">
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
