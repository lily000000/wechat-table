import Vue from 'vue'
import router from "./router";
import Element from "element-ui";
import {API,URL} from '@/api';
import Tool from '@/utils/tool'
import Http from '@/utils/http'
import 'element-ui/lib/theme-chalk/index.css';
import GlobalLayout from "@/layout/globalLayout";
import Blob from '@/utils/excel/Blob'
import Export2Excel from '@/utils/excel/Export2Excel.js'
import Cookie from "@/utils/cookie";
Vue.use(Element, {
  size: "small"
});
Vue.prototype.$API = API;
Vue.prototype.URL = URL;
Vue.prototype.$Tool = Tool;
Vue.prototype.$Http = Http;
Vue.config.productionTip = false
const Bus = new Vue();
//权限判断／将当前时间戳写入json文件
new Vue({
  el: '#app',
  router,
  data:{
    Bus
  },
  components: { GlobalLayout },
  template: '<GlobalLayout/>'
})
