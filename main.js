import Vue from 'vue'
import App from './App'
import http from '@/common/vmeitime-http/interface.js'
import common from '@/common/common.js'
import zhCN from '@/common/language/zh_CN.js'
import enUS from '@/common/language/en_US.js'
import VueI18n from 'vue-i18n' 
import messages from '@/common/language/lang.js'

Vue.use(VueI18n) 

Vue.config.productionTip = false
const i18n = new VueI18n({  
  locale: 'zh_CN',  // 默认选择的语言
  messages: messages
})  
Vue.prototype.$http=http
Vue.prototype.$common = common
Vue.prototype.$zhCN = zhCN
Vue.prototype.$enUS = enUS
Vue.prototype._i18n = i18n
App.mpType = 'app'

const app = new Vue({
	i18n,
    ...App
})
app.$mount()
