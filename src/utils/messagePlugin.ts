import type { App } from "vue";
import MyConfirm from "./MyConfirm";
import Message from "./Message";

export default {
  install(app: App) {
    app.config.globalProperties.$message = Message;
    app.config.globalProperties.$confirm = MyConfirm;
  },
};
