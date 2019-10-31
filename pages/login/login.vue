<template>
	<view class="common">
		<view class="status_bar"></view>
		<form class="loginView" @submit="submit">
			<view style="margin-top:22px;margin-bottom: 33px;justify-content: center;"><text style="font-size: 27px;color: #333;">登录</text></view>
			<view v-if="isShow" class="input-view"><input class="input" type="text" v-model="quickLoginInfo.nickname" placeholder="请输入姓名,首次输入后将不可修改" name="nickname" placeholder-style="color:#999" /></view>
			<view class="input-view"><input class="input" type="text" v-model="quickLoginInfo.mobile" placeholder="请输入手机号" name="mobile" placeholder-style="color:#999" /></view>

			<view class="input-view" style="position: relative;">
				<input class="input" v-model="quickLoginInfo.code" placeholder="输入验证码" name="code" placeholder-style="color:#999" />
				<button class="sendCode" :disabled="sendCodeInfo.hasSend" @tap="sendCode">
				<!-- :class="{disabled: sendCodeInfo.hasSend}" -->
					{{ sendCodeInfo.msg }}
				</button>
			</view>
			<button type="primary" form-type="submit" class="login">快捷登录</button>
		</form>
	</view>
</template>

<script>
//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
import graceChecker from '@/common/graceChecker.js'


export default {
	data() {
		return {
			isShow: false,
			quickLoginInfo: {
				nickname: '',
				mobile: '',
				code: ''
			},
			sendCodeInfo: {
				time: 60,
				hasSend: false,
				msg: '获取验证码'
			}
		};
	},
	methods: {
		//发送验证码
		sendCode: function() {
			let mobile = this.quickLoginInfo.mobile;
			let rule = [
				{ name: "mobile", checkType: "phoneno", checkRule: "", errorMsg: "请填写11位手机号" }
			];
			let checkSendCode = graceChecker.check({mobile}, rule);
			if(!checkSendCode){
				uni.showToast({ title: graceChecker.error, icon: "none" });
				return false;
			}
			this.$http.post('auth/requestCode', {
				mobile, 
				language: 'zh_CN',
			},{hasToken:false}).then((res)=>{
				if(res.data.code===200){
					this.isShow = res.data.data;
					let sendInfo = this.sendCodeInfo;
					sendInfo.msg = '60S';
					sendInfo.hasSend = true;
					let timer = setInterval(function() {
						let time = sendInfo.time;
						time--;
						sendInfo.time = time;
						sendInfo.msg = time + 'S';
						if (time < 1) {
							clearInterval(timer);
							sendInfo.msg = '重新获取';
							sendInfo.time = 60;
							sendInfo.hasSend = false;
						}
					}, 1000);
				}else {
					uni.showToast({
						title: res.data.message,
						icon: 'none',
						duration: 800
					});
					return false;
				}
			})
			
		},
		submit: function(e){
			let {nickname, mobile, code} = e.detail.value;
			let rule = [
				{ name: "mobile", checkType: "phoneno", checkRule: "", errorMsg: "请填写11位手机号" },
				{ name: "code", checkType: "string", checkRule: "6", errorMsg: "请填写6位验证码" }
			];
			if(this.isShow && !nickname){
				rule.push({name: "name", checkType: "reg", checkRule: "^[a-zA-Z0-9_-]{4,16}$", errorMsg: "请填写姓名"})
			}
			let checkLogin = graceChecker.check(e.detail.value, rule);
			if(!checkLogin){
				uni.showToast({ title: graceChecker.error, icon: "none" });
				return false;
			}
			
			this.$http.post('auth/autoLogin', {
				name:nickname,
				username:mobile, 
				validateCode: code, 
				language: 'zn_CH',
			},{hasToken:false}).then((res)=>{
				//console.log(res);
				if(res.data.code===200){
					//缓存用户信息
					uni.setStorageSync("USER", res.data.user);
					//跳转到主页
					uni.navigateTo({
						url: '/pages/index/index'
					});
				}else {
					uni.showToast({
						title: res.data.message,
						icon: 'none',
						duration: 800
					});
				}
			})
		}
	}
};
</script>
<style>
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
view {
	display: flex;
}

.common {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.loginView {
	margin-left: 18px;
	margin-right: 18px;
	/* width: 750upx;
        padding-top: 30upx; */
}

.input-view {
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-bottom-color: #e3e3e3;
	background-color: #fff;
	flex-direction: row;
	box-sizing: border-box;
}
.input {
	font-size: 17px;
	color: #333;
	height: 60px;
	flex: 1;
}
.other_opt {
	font-size: 14px;
	color: #333;
}
.login {
	margin-top: 50px;
	font-size: 16px;
	color: #e5e5e5;
	background-color: #4dc578;
	height: 46px;
	line-height: 46px;
}
.sendCode{
	width: 89px;height: 26px;line-height: 26px;
	position: absolute;
	top:18px;
	right: 0;
	border-radius: 2px;
	border-style:solid;
	border-width: 1px;
	border-color: #999;
	font-size: 16px;
	padding-left: 0;
	padding-right: 0;
	color: #999;
	z-index: 999999;
}
button:after{
	border:0;
	border-radius: 0;
}
</style>
