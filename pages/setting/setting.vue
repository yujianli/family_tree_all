<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">语言选择</text>
			<view>
				<text class="inner_text_1">中文</text>
				<image src="../../static/images/icon_arrow_right.png" style="width: 9px;height: 9px;"></image>
			</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">支付年费</text>
			<view>
				<text class="inner_text_1">试用期2019年5月18日到期</text>
				<image src="../../static/images/icon_arrow_right.png" style="width: 9px;height: 9px;"></image>
			</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">关于我们</text>
			<image src="../../static/images/icon_arrow_right.png" style="width: 9px;height: 9px;"></image>
		</view>
		<view class="wrapper">
			<text class="inner_title">隐私政策</text>
			<image src="../../static/images/icon_arrow_right.png" style="width: 9px;height: 9px;"></image>
		</view>
		<view class="wrapper">
			<text class="inner_title">当前版本</text>
			<text class="inner_text_2">1.2.0</text>
		</view>
		<view class="wrapper">
			<text class="inner_title">清除缓存</text>
			<text class="inner_text_2">3.32MB</text>
		</view>
		<button type="primary"  class="logout">系统登出</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.container{
		padding-left:15px;
		padding-right:15px;
	}
	.wrapper{
		height: 55px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.inner_title{
		font-size: 16px;
		color: #333;
	}
	.inner_text_1{
		font-size: 14px;
		color: #999;
		margin-right: 6px;
	}
	.inner_text_2{
		font-size: 14px;
		color: #333;
	}
	.logout{
		margin-top: 50px;;
		font-size: 16px;
		color: #e5e5e5;
		background-color: #4DC578;
		height: 46px;
		line-height: 46px;
	}
</style>
