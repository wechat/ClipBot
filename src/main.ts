import { createApp } from "vue";
import { createPinia } from "pinia";
import { main } from "./common/index";

import "@arco-design/web-vue/dist/arco.css";
import "./assets/css/style.css";
import "./assets/css/iconfont.css";
import App from "./App.vue";

const app = createApp(App);
app.use(createPinia());

main(() => {
  app.mount("#app");
});
