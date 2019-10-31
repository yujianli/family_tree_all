import Vue from 'vue'
import App from './App'
import http from '@/common/vmeitime-http/interface.js'
import common from '@/common/common.js'

Vue.config.productionTip = false
Vue.prototype.$http=http
Vue.prototype.$common = common
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
