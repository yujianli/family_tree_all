<template>
	<view class="common">
		<view class="status_bar"></view>
		<form class='loginView'>
			<view style="margin-top:22px;margin-bottom: 33px;justify-content: center;">
				<text style="font-size: 27px;color: #333;">登录</text>
			</view>
			<view class="input-view">
				<input class="input" type="text" placeholder="请输入姓名,首次输入后将不可修改" name="username" placeholder-style="color:#999"/>
			</view>
			<view class="input-view">           
				<input class="input" type="text" placeholder="请输入手机号" name="mobile" placeholder-style="color:#999"/>
			</view>
			
			<view class="input-view" style="position: relative;">
				<input class="input" password placeholder="输入验证码" name="code" placeholder-style="color:#999"/>
				<button style="width: 89px;height: 26px;line-height: 26px;
				position: absolute;
				top:18px;
				right: 0;
				border-radius: 2px;border-style:solid;border-width: 1px;border-color: #999;
				font-size: 16px;padding-left: 0;padding-right: 0;color: #999;" @tap="sendCode">
				{{sendCodeInfo.msg}}
				</button>
			</view>
			<button type="primary"  class="login">快捷登录</button>
		</form>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				quickLoginInfo:{
					mobile:'',
					code:'',
				},
				sendCodeInfo:{
					time:60,
					hasSend:false,
					msg:'获取验证码'
				}
			}
		},
		onLoad() {

		},
		methods: {
			//发送验证码
			sendCode:function(){
				let sendCodeInfo = this.sendCodeInfo;
				if(sendCodeInfo.hasSend == true) {
					uni.showToast({
						title: '验证码已发送，请勿重复点击',
						icon: 'none',
						duration: 800
					});
					return false;
				} else {
					if(this.quickLoginInfo.mobile.length == 0){
						uni.showToast({
							title: '请填写手机号',
							icon: 'none',
							duration: 800
						});
						return false;
					}else {
						sendCodeInfo.msg = '60S';
						sendCodeInfo.hasSend = true;
						let timer = setInterval(function(){
							let time = sendCodeInfo.time;
							time --;
							sendCodeInfo.time = time;
							sendCodeInfo.msg = time + 'S';
							if(time < 1) {
								clearInterval(timer);
								sendCodeInfo.msg = '重新获取';
								sendCodeInfo.time = 60;
								sendCodeInfo.hasSend = false;
							}
						},1000)
					}
				}
				
			}
		}
	}
</script>
<style>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
    view {
        display: flex;
    }
	
	.common{
		display: flex;
		flex: 1;
		flex-direction: column;
	}

    .loginView {
        
		margin-left: 18px;
		margin-right:18px;
        /* width: 750upx;
        padding-top: 30upx; */
    }

    .input-view {
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #E3E3E3;
        background-color: #fff;
        flex-direction: row;
        box-sizing: border-box;
    }
	.input{
		font-size: 17px;
		color: #333;
		height: 60px;
		flex:1;
	}
	.other_opt{
		font-size: 14px;
		color: #333;
	}
	.login{
		margin-top: 50px;;
		font-size: 16px;
		color: #e5e5e5;
		background-color: #4DC578;
		height: 46px;
		line-height: 46px;
	}



 

 
</style>

