import Message from "./utils/Message";
import MyConfirm from "./utils/MyConfirm";
declare module "vue" {
  interface ComponentCustomProperties {
    $message: typeof Message;
    $confirm: typeof MyConfirm;
  }
}
declare global {
  interface Window {
    QC: any;
  }
}
