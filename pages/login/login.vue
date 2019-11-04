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
	onLoad(){
		//uni.removeStorageSync('launchFlag');
		this.loadExecution();
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
				rule.push({name: "name", checkType: "reg", checkRule: "^[a-zA-Z0-9_\u4e00-\u9fa5]+$", errorMsg: "请填写姓名"})
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
					uni.setStorageSync("USER", res.data.data.user);
					uni.setStorageSync("USER", res.data.user);
					console.log(res.data);
					//跳转到主页
					//this.login(res.data.data.user);
					uni.switchTab({
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
		},
		loadExecution: function(){
			/**
			 * 获取本地存储中launchFlag的值
			 * 若存在，说明不是首次启动，直接进入首页；
			 * 若不存在，说明是首次启动，进入引导页；
			 */
			try {
				const value = uni.getStorageSync('launchFlag');
				console.log("has launch");
				console.log(value);
				if (value) {
					if (value == true) {
						//判断是否已经成功登录
						//成功登录 switchTab进入index页面
						this.loginThenToIndex();
						
					} else {
						uni.redirectTo({
							url: '/pages/guide/guide'
						});
					}
				} else {
					uni.setStorage({
						key: 'launchFlag',
						data: true,
						success: function() {
							console.log('存储launchFlag');
						}
					});
					uni.redirectTo({
						url: '/pages/guide/guide'
					});
				}
			} catch(e) { 
				// error 
				uni.setStorage({ 
					key: 'launchFlag', 
					data: true, 
					success: function () {
						console.log('error时存储launchFlag');
					} 
				}); 
				uni.redirectTo({ url: '/pages/guide/guide' }); 
			}
			return;
			loginThenToIndex();
		},
		loginThenToIndex:function(){
			const user = uni.getStorageSync('USER');
			console.log('已经登录');
			console.log(user);
			if(user){
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
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
		margin-left: 36upx;
		margin-right: 36upx;
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
		font-size: 34upx;
		color: #333;
		height: 120upx;
		flex: 1;
	}

	.other_opt {
		font-size: 28upx;
		color: #333;
	}

	.login {
		margin-top: 100upx;
		font-size: 32upx;
		color: #e5e5e5;
		background-color: #4dc578;
		height: 92upx;
		line-height: 92upx;
	}

	.sendCode {
		width: 178upx;
		height: 52upx;
		line-height: 52upx;
		position: absolute;
		top: 36upx;
		right: 0;
		border-radius: 2px;
		border-style: solid;
		border-width: 1px;
		border-color: #999;
		font-size: 32upx;
		padding-left: 0;
		padding-right: 0;
		color: #999;
		z-index: 999999;
	}

	button:after {
		border: 0;
		border-radius: 0;
	}
</style>