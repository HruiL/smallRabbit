<script setup lang="ts">
import { AuthAPI } from "@/api/AuthAPI";
import useCountdown from "@/logics/useCountdown";
import { useUserStore } from "@/stores/userStore";
import Message from "@/utils/Message";
import { toFormValidator } from "@vee-validate/zod";
import { AxiosError } from "axios";
import { Field, ErrorMessage } from "vee-validate";
import * as zod from "zod";
const props = defineProps<{ unionId: string }>();
const userStore = useUserStore();
const { login } = userStore;
// 用于存储qq用户信息
const qqUserInfo = reactive({ avatar: "", nickname: "" });
// 获取qq用户的头像和昵称
window.QC.api("get_user_info").success((response: any) => {
  // 存储头像
  qqUserInfo.avatar = response.data.figureurl_1;
  // 存储昵称
  qqUserInfo.nickname = response.data.nickname;
});
// 定义表单校验规则
const validationSchema = toFormValidator(
  zod.object({
    mobile: zod
      .string({
        required_error: "请输入手机号",
      })
      .regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
    code: zod
      .string({
        required_error: "请输入验证码",
      })
      .regex(/^\d{6}$/, "验证码格式不正确"),
  })
);
// 创建表单校验对象
const { handleSubmit, validateField, values } = useForm<{
  mobile: string;
  code: string;
}>({
  validationSchema,
});
// 表单提交
const onSubmit = handleSubmit((formValues) => {
  // 点击立即绑定按钮，发送请求，绑定已有账号
  login(() =>
    AuthAPI.loginByBindAccount(
      formValues.mobile,
      formValues.code,
      props.unionId
    )
  );
});

// 调用短信倒计时的方法
const { start, count, isActive } = useCountdown();
async function sendMsg() {
  // 1. 判断用户是否输入正确的手机号
  const { valid } = await validateField("mobile");
  // 如果没有校验通过，阻止代码向下执行
  if (!valid) return;
  // 如果正在倒计时，阻止代码向下执行
  if (isActive.value) return;
  try {
    // 发送手机验证码
    const response = await AuthAPI.sendMsgCodeOfBindQQ(values.mobile);
    // 成功的消息提示
    Message({ type: "success", msg: "验证码发送成功" });
    // 开启倒计时
    start(60);
  } catch (error) {
    if (error instanceof AxiosError) {
      Message({ type: "error", msg: error.response?.data.message });
    } else if (error instanceof Error) {
      Message({ type: "error", msg: "验证码发送失败" });
    }
  }
}
</script>
<template>
  <form class="xtx-form" @submit="onSubmit">
    <div class="user-info">
      <img :src="qqUserInfo.avatar" alt="" />
      <p>
        Hi, {{ qqUserInfo.nickname }} 欢迎来小兔鲜,
        完成绑定后可以QQ账号一键登录哦~
      </p>
    </div>
    <div class="xtx-form-item">
      <Field name="mobile" as="div" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-phone"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="绑定的手机号"
        />
      </Field>
      <ErrorMessage name="mobile" as="div" class="error" v-slot="{ message }">{{
        message
      }}</ErrorMessage>
    </div>
    <div class="xtx-form-item">
      <Field name="code" as="div" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-code"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="短信验证码"
        />
        <span class="code" @click="sendMsg">{{
          isActive ? `剩余${count}秒` : "发送验证码"
        }}</span>
      </Field>
      <ErrorMessage name="code" as="div" class="error" v-slot="{ message }">{{
        message
      }}</ErrorMessage>
    </div>
    <input type="submit" class="submit" value="立即绑定" />
  </form>
</template>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin: 0 auto 20px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
