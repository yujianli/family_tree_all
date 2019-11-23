<template>
	<view class="container">
		<view class="wrapper" @tap="setLanguage">
			<text class="inner_title">语言选择</text>
			<view>
				<text class="inner_text_1">中文</text>
				<image src="../../static/images/icon_arrow_right.png" class="arrow"></image>
			</view>
		</view>
		<view class="wrapper" @tap="toPay">
			<text class="inner_title">支付年费</text>
			<view>
				<text class="inner_text_1">试用期还有{{day}}到期</text>
				<image src="../../static/images/icon_arrow_right.png" class="arrow"></image>
			</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">关于我们</text>
			<image src="../../static/images/icon_arrow_right.png" class="arrow"></image>
		</view>
		<view class="wrapper">
			<text class="inner_title">隐私政策</text>
			<image src="../../static/images/icon_arrow_right.png" class="arrow"></image>
		</view>
		<view class="wrapper">
			<text class="inner_title">当前版本</text>
			<text class="inner_text_2">1.2.0</text>
		</view>
		<view class="wrapper">
			<text class="inner_title">清除缓存</text>
			<text class="inner_text_2">3.32MB</text>
		</view>
		<button type="primary" @click="bindLogin" class="logout">系统登出</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				param: {
					userId: null,
					language: this.$common.language
				},
				whetherRemind:null,
				day:null,
			}
		},
		onShow: function() {
			let user = uni.getStorageSync("USER");
			this.param.userId = user.id;
			this.loadWhetherRemind();
		},
		
		methods: {
			bindLogin() {
				uni.removeStorageSync('USER');
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			setLanguage(){
				uni.navigateTo({url: '/pages/language/language'});
			},
			toPay(){
				uni.navigateTo({
					url:'/pages/fee/fee'
				})
			},
			loadWhetherRemind:function(){
				this.$http
				.post('content/whetherRemind',{
					language: this.param.language,
					userId: this.param.userId
				})
				.then(res => {
					if(res.data.code == 200){
						 this.whetherRemind = res.data.data.whetherRemind;
						 this.day = res.data.data.day;
					} else {
						uni.showToast({
							title: '用户试用期状态加载失败',
							icon: 'none'
						});
					}
				})
			}
		}
	}
</script>

<style scoped>
	.container{
		padding-left:30upx;
		padding-right:30upx;
	}
	.wrapper{
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.inner_title{
		font-size: 32upx;
		color: #333;
	}
	.inner_text_1{
		font-size: 28upx;
		color: #999;
		margin-right: 12upx;
	}
	.inner_text_2{
		font-size: 28upx;
		color: #333;
	}
	.logout{
		margin-top: 100upx;;
		font-size: 32upx;
		color: #e5e5e5;
		background-color: #4DC578;
		height: 92upx;
		line-height: 92upx;
	}
	.arrow{
		width: 18upx;
		height: 18upx;
	}
</style>
