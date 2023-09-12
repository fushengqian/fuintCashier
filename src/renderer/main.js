import Vue from 'vue'
import { ipcRenderer } from 'electron'
import { createPinia, PiniaVuePlugin } from 'pinia'
import Router from 'vue-router'

import App from './App'
import router from './router'
import { usePermission } from './permission'
import directive from './directive'
// 分页组件
import Pagination from "@/components/Pagination";
// 打印插件
import Print from 'vue-print-nb'
// 引用element
import ElementUI from 'element-ui'
import { getName, resetForm, addDateRange, parseTime } from '@/utils/fuint'
import 'element-ui/lib/theme-chalk/index.css'
// 日志
import './error'
import './icons'
import '@/styles/index.scss'
import '@/styles/dark-mode.scss'
import '@/styles/fuint.scss'

// 引入 i18n 语言包
import VueI18n from 'vue-i18n'
import loadLanguage from "./i18n"
const languages = loadLanguage()
const pinia = createPinia()

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.prototype.getName = getName
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.parseTime = parseTime

if (!process.env.IS_WEB) {
   ipcRenderer.invoke("IsUseSysTitle").then(res => {
     if (!res) {
        require('@/styles/custom-title.scss')
     }
  });
}
Vue.use(PiniaVuePlugin) // 确保pinia在最先挂载
Vue.use(directive)
Vue.use(Print);
Vue.use(Router)
// 创建 i18n
Vue.use(VueI18n) // 新版本必须要这个，不知道为什么

usePermission() // 放在后面，确保加载顺序

const i18n = new VueI18n({
  locale: 'zh-CN', // 设置默认语言
  messages: languages, // 设置语言包
});
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  pinia,
  i18n,
  template: '<App/>',
}).$mount('#app')

