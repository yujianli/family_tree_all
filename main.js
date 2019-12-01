import Vue from 'vue'
import App from './App'
import http from '@/common/vmeitime-http/interface.js'
import common from '@/common/common.js'
import zhCN from '@/common/language/zh_CN.js'
import enUS from '@/common/language/en_US.js'

Vue.config.productionTip = false
Vue.prototype.$http=http
Vue.prototype.$common = common
Vue.prototype.$zhCN = zhCN
Vue.prototype.$enUS = enUS
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
