(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/login/login"],{"0f5e":function(e,n,t){"use strict";t.r(n);var a=t("114e"),o=t.n(a);for(var i in a)"default"!==i&&function(e){t.d(n,e,function(){return a[e]})}(i);n["default"]=o.a},"114e":function(e,n,t){"use strict";(function(e,a){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=i(t("1874"));function i(e){return e&&e.__esModule?e:{default:e}}var u={data:function(){return{isShow:!1,quickLoginInfo:{nickname:"",mobile:"",code:""},sendCodeInfo:{time:60,hasSend:!1,msg:"获取验证码"}}},onLoad:function(){this.loadExecution()},methods:{sendCode:function(){var n=this,t=this.quickLoginInfo.mobile,a=[{name:"mobile",checkType:"phoneno",checkRule:"",errorMsg:"请填写11位手机号"}],i=o.default.check({mobile:t},a);if(!i)return e.showToast({title:o.default.error,icon:"none"}),!1;this.$http.post("auth/requestCode",{mobile:t,language:"zh_CN"},{hasToken:!1}).then(function(t){if(200!==t.data.code)return e.showToast({title:t.data.message,icon:"none",duration:800}),!1;n.isShow=t.data.data;var a=n.sendCodeInfo;a.msg="60S",a.hasSend=!0;var o=setInterval(function(){var e=a.time;e--,a.time=e,a.msg=e+"S",e<1&&(clearInterval(o),a.msg="重新获取",a.time=60,a.hasSend=!1)},1e3)})},submit:function(n){var t=n.detail.value,i=t.nickname,u=t.mobile,c=t.code,r=[{name:"mobile",checkType:"phoneno",checkRule:"",errorMsg:"请填写11位手机号"},{name:"code",checkType:"string",checkRule:"6",errorMsg:"请填写6位验证码"}];this.isShow&&!i&&r.push({name:"name",checkType:"reg",checkRule:"^[a-zA-Z0-9_一-龥]+$",errorMsg:"请填写姓名"});var l=o.default.check(n.detail.value,r);if(!l)return e.showToast({title:o.default.error,icon:"none"}),!1;this.$http.post("auth/autoLogin",{name:i,username:u,validateCode:c,language:"zn_CH"},{hasToken:!1}).then(function(n){200===n.data.code?(e.setStorageSync("USER",n.data.data.user),console.log(a(n.data.data," at pages\\login\\login.vue:116")),e.switchTab({url:"/pages/index/index"})):e.showToast({title:n.data.message,icon:"none",duration:800})})},loadExecution:function(){try{var n=e.getStorageSync("launchFlag");n?1==n?this.loginThenToIndex():e.redirectTo({url:"/pages/guide/guide"}):(e.setStorage({key:"launchFlag",data:!0,success:function(){console.log(a("存储launchFlag"," at pages\\login\\login.vue:155"))}}),e.redirectTo({url:"/pages/guide/guide"}))}catch(t){e.setStorage({key:"launchFlag",data:!0,success:function(){console.log(a("error时存储launchFlag"," at pages\\login\\login.vue:168"))}}),e.redirectTo({url:"/pages/guide/guide"})}},loginThenToIndex:function(){var n=e.getStorageSync("USER");console.log(a("已经登录"," at pages\\login\\login.vue:178")),console.log(a(n," at pages\\login\\login.vue:179")),n&&e.switchTab({url:"/pages/index/index"})}}};n.default=u}).call(this,t("6e42")["default"],t("0de9")["default"])},"6d49":function(e,n,t){"use strict";var a=function(){var e=this,n=e.$createElement;e._self._c},o=[];t.d(n,"a",function(){return a}),t.d(n,"b",function(){return o})},"70d1":function(e,n,t){"use strict";var a=t("ef79"),o=t.n(a);o.a},9998:function(e,n,t){"use strict";(function(e){t("a45e"),t("921b");a(t("66fd"));var n=a(t("b374"));function a(e){return e&&e.__esModule?e:{default:e}}e(n.default)}).call(this,t("6e42")["createPage"])},b374:function(e,n,t){"use strict";t.r(n);var a=t("6d49"),o=t("0f5e");for(var i in o)"default"!==i&&function(e){t.d(n,e,function(){return o[e]})}(i);t("70d1");var u=t("2877"),c=Object(u["a"])(o["default"],a["a"],a["b"],!1,null,"0c3033e0",null);n["default"]=c.exports},ef79:function(e,n,t){}},[["9998","common/runtime","common/vendor"]]]);