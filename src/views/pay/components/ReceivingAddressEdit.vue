<script setup lang="ts">
import { useOrderStore } from "@/stores/orderStore";
import type { EditAddressObject } from "@/types/Order";
import Message from "@/utils/Message";

// 控制弹框的显示和隐藏
const visible = ref(false);

const orderStore = useOrderStore();
const emit = defineEmits<{ (e: "onAddressEditSuccess", id: string): void }>();
// 区分是修改地址还是添加地址
const flag = reactive({ isAlter: false, text: "修改" });
// 用户选择的省市区
const fullLocation = ref("");
// 表单的初始值
const initalValues: EditAddressObject = {
  receiver: "",
  contact: "",
  provinceCode: "",
  cityCode: "",
  countyCode: "",
  address: "",
  postalCode: "",
  addressTags: "",
  isDefault: false,
};
const formValues = ref<EditAddressObject>({ ...initalValues });
// 点击确认按钮，添加收货地址
async function onAddressEdit() {
  // 将isDefault的值设置为服务器端需要的值
  const reqParams = {
    ...formValues.value,
    isDefault: formValues.value.isDefault ? 0 : 1,
  };
  try {
    const id = flag.isAlter
      ? await orderStore.updateAddress(reqParams)
      : await orderStore.addAddress(reqParams);
    await orderStore.getAddress();
    Message({ type: "success", msg: `收货地址${flag.text}成功` });
    // 通知父组件地址添加/修改成功
    emit("onAddressEditSuccess", id);
  } catch (e) {
    Message({ type: "error", msg: `收货地址${flag.text}失败` });
  }
  // 关闭弹框
  visible.value = false;
}
// 监听弹框的关闭，清空表单值
watch(visible, (value) => {
  if (!value) {
    formValues.value = { ...initalValues };
    fullLocation.value = "";
  } else {
    flag.isAlter = typeof formValues.value.id !== "undefined";
    flag.text = flag.isAlter ? "修改" : "添加";
  }
});
defineExpose({ visible, flag, formValues, fullLocation });
orderStore.getAddress();
</script>
<template>
  <XtxDialog v-model:visible="visible" :title="`${flag.text}收货地址`">
    <template #body>
      <div class="address-edit">
        <div class="xtx-form">
          <div class="xtx-form-item">
            <div class="label">收货人：</div>
            <div class="field">
              <input
                v-model="formValues.receiver"
                class="input"
                placeholder="请输入收货人"
              />
            </div>
          </div>
          <div class="xtx-form-item">
            <div class="label">手机号：</div>
            <div class="field">
              <input
                v-model="formValues.contact"
                class="input"
                placeholder="请输入手机号"
              />
            </div>
          </div>
          <div class="xtx-form-item">
            <div class="label">地区：</div>
            <div class="field">
              <XtxCity
                @on-changed="
                  formValues.provinceCode = $event.provinceCode;
                  formValues.cityCode = $event.cityCode;
                  formValues.countyCode = $event.countyCode;
                "
                v-model:full-location="fullLocation"
              />
            </div>
          </div>
          <div class="xtx-form-item">
            <div class="label">详细地址：</div>
            <div class="field">
              <input
                v-model="formValues.address"
                class="input"
                placeholder="请输入详细地址"
              />
            </div>
          </div>
          <div class="xtx-form-item">
            <div class="label">邮政编码：</div>
            <div class="field">
              <input
                v-model="formValues.postalCode"
                class="input"
                placeholder="请输入邮政编码"
              />
            </div>
          </div>
          <div class="xtx-form-item">
            <div class="label">地址标签：</div>
            <div class="field">
              <input
                v-model="formValues.addressTags"
                class="input"
                placeholder="请输入地址标签，逗号分隔"
              />
            </div>
          </div>
          <div class="xtx-form-item">
            <div class="label">是否设置为默认地址：</div>
            <div class="field">
              <input
                v-model="(formValues.isDefault as boolean)"
                type="checkbox"
                class="checkbox"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <XtxButton
        @click="visible = false"
        type="gray"
        style="margin-right: 20px"
      >
        取消
      </XtxButton>
      <XtxButton type="primary" @click="onAddressEdit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
  .xtx-city {
    width: 320px;
    :deep(.select) {
      height: 50px;
      line-height: 48px;
      display: flex;
      padding: 0 10px;
      justify-content: space-between;
      .placeholder {
        color: #ccc;
      }
      i {
        color: #ccc;
        font-size: 18px;
      }
      .value {
        font-size: 14px;
      }
    }
    :deep(.option) {
      top: 49px;
    }
  }
}
.xtx-form {
  padding: 0;
  .xtx-form-item {
    width: auto;
    &:last-child {
      padding-bottom: 0;
    }
  }
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
</style>
