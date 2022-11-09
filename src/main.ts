import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "normalize.css";
import "@/assets/styles/common.less";
import piniaPersistedState from "pinia-plugin-persistedstate";
import messagePlugin from "./utils/messagePlugin";
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedState);
app.use(router);
app.use(pinia);
app.use(messagePlugin);

app.mount("#app");
if (process.env.NODE_ENV === "development") {
  const worker = require("@/mocks/browser").default;
  worker.start({ onUnhandledRequest: "bypass" });
}
