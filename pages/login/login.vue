<template>
	<view class="common">
		<view class="status_bar"></view>
		<form class="loginView" @submit="submit">
			<view style="margin-top:22px;margin-bottom: 33px;justify-content: center;"><text style="font-size: 27px;color: #333;">{{i18n.login}}</text></view>
			<view v-if="isShow" class="input-view"><input class="input" type="text" v-model="quickLoginInfo.nickname" :placeholder="msg.msg1" name="nickname" placeholder-style="color:#999" /></view>
			<view v-if="isShow" class="input-view">
				<text class="inner_title">{{i18n.gender}}</text>
				<picker @change="sexBindPickerChange" :value="sexIdx" :range="sexData" range-key="value" name="sex">
					<view class="input">{{ sexData[sexIdx].value }}</view>
				</picker>
			</view>
			<view class="input-view"><input class="input" type="text" v-model="quickLoginInfo.mobile" :placeholder="msg.msg2" name="mobile" placeholder-style="color:#999" /></view>
			<view class="input-view" style="position: relative;">
				<input class="input" v-model="quickLoginInfo.code" :placeholder="msg.msg3" name="code" placeholder-style="color:#999" />
				<button class="sendCode" :disabled="sendCodeInfo.hasSend" @tap="sendCode">
				<!-- :class="{disabled: sendCodeInfo.hasSend}" -->
					{{ sendCodeInfo.msg }}
				</button>
			</view>
			<button type="primary" form-type="submit" class="login">{{btnText.speedLogin}}</button>
		</form>
	</view>
</template>

<script>
//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
import graceChecker from '@/common/graceChecker.js'
import dataJson from '@/static/appData.json'


export default {
	data() {
		return {
			isShow: false,
			quickLoginInfo: {
				nickname: '',
				mobile: '',
				code: '',
				sex:'',
			},
			sexData:dataJson['sex'],
			sexIdx:0,
			sendCodeInfo: {
				time: 60,
				hasSend: false,
				msg: this.$t('btnText').getCode
			}
		};
	},
	computed:{
		i18n() {
			return this.$t('common')
		},
		msg(){
			return this.$t('msg')
		},
		btnText(){
			return this.$t('btnText')
		}
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
				{ name: "mobile", checkType: "phoneno", checkRule: "", errorMsg: this.$t('msg').msg4 }
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
					let self = this
					let timer = setInterval(function() {
						let time = sendInfo.time;
						time--;
						sendInfo.time = time;
						sendInfo.msg = time + 'S';
						if (time < 1) {
							clearInterval(timer);
							sendInfo.msg = self.$t('btnText').reacquire;
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
			let {nickname, mobile, code,sex} = e.detail.value;
			
			let rule = [
				{ name: "mobile", checkType: "phoneno", checkRule: "", errorMsg: this.$t('msg').msg4 },
				{ name: "code", checkType: "string", checkRule: "6", errorMsg: this.$t('msg').msg5 },
			];
			if(this.isShow && !nickname){
				rule.push({name: "name", checkType: "reg", checkRule: "^[a-zA-Z0-9_\u4e00-\u9fa5]+$", errorMsg: this.$t('msg').msg6})
			}
			if(this.isShow && !sex){
				rule.push({name: "sex", checkType: "in", checkRule: "1,2", errorMsg: this.$t('msg').msg7})
			}
			let checkLogin = graceChecker.check(e.detail.value, rule);
			if(!checkLogin){
				uni.showToast({ title: graceChecker.error, icon: "none" });
				return false;
			}
			let formData = {
				username:mobile,
				validateCode: code,
				language: 'zn_CH',
			}
			if(this.isShow){
				formData.sex = sex;
				formData.name = nickname;
			}
			
			this.$http.post('auth/autoLogin',formData,{hasToken:false}).then((res)=>{
				//console.log(res);
				if(res.data.code===200){
					//缓存用户信息
					uni.setStorageSync("USER", res.data.data.user);
					//uni.setStorageSync("USER", res.data.user);
					console.log(res.data.data);
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
		},
		sexBindPickerChange: function(e) {
		    this.sexIndex = e.target.value
			this.selProp('sex', e.target.value)
		},
		selProp:function(prop, index){
			this.sexIdx=index;
			this.quickLoginInfo[prop]=this.$t('selData')[prop][index].key;
		},
	}
};
</script>
<style lang="less" scoped>
	page{
		background: #fff;
	}
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
		align-items: center;
	}

	.input {
		font-size: 34upx;
		color: #333;
		height: 120upx;
		flex: 1;
		line-height: 120upx;
	}

	.other_opt {
		font-size: 28upx;
		color: #333;
	}

	.login {
		margin-top: 100upx;
		font-size: 32upx;
		color: #ffffff;
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
		border-color: #333;
		font-size: 32upx;
		padding-left: 0;
		padding-right: 0;
		color: #333;
		z-index: 999;
		background: #fff;
	}

	button:after {
		border: 0;
		border-radius: 0;
	}
	
	.wrapper{
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.inner_title{
		font-size: 34upx;
		color: #333;
		margin-right: 40upx;
	}
</style>