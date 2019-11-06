<template>
	<view>
		<view class="avatar_wrapper">
			<image src="../../../static/images/avatar.png"></image>
			<view>万少波</view>
		</view>
		<view class="tab_container">
			<view :class="{ 'active': index == 0 }" @tap="tabFunc(0)">基本信息</view>
			<view :class="{ 'active': index == 1 }" @tap="tabFunc(1)">个人信息</view>
		</view>

		<view class="container" :style="{display: index == 0 ? 'block' : 'none'}">
			<view class="wrapper">
				<text class="inner_title">性别</text>
				<text class="inner_info">女</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">民族</text>
				<text class="inner_info">汉族</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">生肖</text>
				<text class="inner_info">猴</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">出生年月</text>
				<text class="inner_info">1980年12月</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">出生时辰</text>
				<text class="inner_info">0时-2时</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">出生地</text>
				<text class="inner_info">浙江杭州</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">居住地</text>
				<text class="inner_info">浙江杭州</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">职业</text>
				<text class="inner_info">工程师</text>
			</view>
		</view>

		<view class="container" :style="{display: index == 1 ? 'block' : 'none'}">
			<view class="inner_content">
				柳永是北宋著名词人，为河东柳氏之后，出身仕宦之家，父亲柳宜及五位叔父都曾在南唐或宋朝做官，
				兄长柳三复及柳三接都有科第功名。柳永
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index:0
			}
		},
		methods: {
			tabFunc:function(idx){
				this.index = idx;
			},
		}
	}
</script>

<style lang="less" scoped>
	.container {
		padding-left: 30upx;
		padding-right: 30upx;
	}

	.wrapper {
		height: 96upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

	}

	.inner_title,.inner_content {
		font-size: 33upx;
		color: #333;
		margin-right: 40upx;
	}
	.inner_content{
		font-size: 33upx;
		color: #333;
	}

	.inner_info {
		font-size: 34upx;
		color: #303641;
		text-align: right;
	}

	.avatar_wrapper {
		background-color: green;
		height: 323upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		image {
			width: 154upx;
			height: 154upx;
		}

		view {
			font-size: 42upx;
			color: #fff;
			margin-top: 41upx;
		}
	}

	.tab_container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 96upx;
		line-height: 96upx;
		font-size: 33upx;

		view {
			color: #303641;
			text-align: center;
			flex: 1;

			&.active {
				color: #333;
				font-weight: 600;
				text-align: center;
				flex: 1;
			}
		}
	}
</style>
