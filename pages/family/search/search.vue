<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">族人姓名</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="族人姓名" />
		</view>
		<view class="wrapper">
			<text class="inner_title">出生年月</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="出生年月" />
		</view>
		<view class="wrapper">
			<text class="inner_title">手机号码</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="手机号码" />
		</view>
		<view class="more_container" @tap="showMoreCondition">
			<text v-if="!showMore">展开更多搜索条件</text>
			<text v-else="showMore">收起更多搜索条件</text>
			<image src="../../../static/images/arrow.png"></image>
		</view>
		<view :style="{display: showMore ? 'block' : 'none'}">
			<view class="wrapper">
				<text class="inner_title">性别</text>
				<input class="input" type="text" placeholder-style="color:#999" placeholder="性别" />
			</view>
			<view class="wrapper">
				<text class="inner_title">出生地</text>
				<input class="input" type="text" placeholder-style="color:#999" placeholder="出生地" />
			</view>
			<view class="wrapper">
				<text class="inner_title">民族</text>
				<input class="input" type="text" placeholder-style="color:#999" placeholder="民族" />
			</view>
		</view>
		<view class="opt_container">
			<button class="btn_search">开始搜索</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showMore:false
			}
		},

		methods: {
			showMoreCondition:function(){
				this.showMore = !this.showMore;
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		border-top: 1px solid #e5e5e5;
	}
	.container {
		padding-left: 30upx;
		padding-right: 30upx;
		padding-bottom: 120upx;
	}

	.wrapper {
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #E5E5E5; */
	}

	.inner_title {
		font-size: 34upx;
		color: #333;
		margin-right: 40upx;
	}

	.input {
		font-size: 34upx;
		color: #303641;
		flex: 1;
		text-align: left;
	}

	.opt_container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 114upx;

	}

	.btn_search {
		flex: 1;
		font-size: 38upx;
		color: #ffffff;
		background-color: #4DC578;
		border-radius: 0;
	}

	.btn_delete:after {
		border: 0px;
	}

	.more_container {
		font-size: 27upx;
		color: #303641;
		text-align: center;
		margin-top: 53upx;

		text {
			margin-right: 10upx;
		}

		image {
			width: 23upx;
			height: 23upx;
		}
	}
</style>
