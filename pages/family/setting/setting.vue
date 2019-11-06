<template>
	<view class="container">
		<view class="clan_set_title">家族树名字</view>
		<view class="clan_set_item">
			<text class="label">名称</text>
			<text>万氏家族树</text>
		</view>
		<view class="clan_set_title">发起人</view>
		<view class="clan_set_item">
			<image src="../../../static/images/avatar.png"></image>
			<text>万少波</text>
		</view>
		<view class="clan_set_title">家族树管理员</view>
		<view class="clan_set_item" v-for="(admin,index) in adminList">
			<image :src="admin.avatar"></image>
			<text>{{admin.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				adminList:[{
					id:1,
					avatar:'../../../static/images/avatar.png',
					name:'admin one'
				},{
					id:2,
					avatar:'../../../static/images/avatar.png',
					name:'admin two'
				},{
					id:3,
					avatar:'../../../static/images/avatar.png',
					name:'admin three'
				}]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
	.container{
		background-color: #fcfcfc;
	}
	.clan_set_title{
		font-size: 30upx;
		color: #9999;
		height: 77upx;
		line-height: 77upx;
		padding-left: 30upx;padding-right: 30upx;
	}
	.clan_set_item{
		padding-left: 30upx;padding-right: 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 106upx;
		line-height: 106upx;
		background-color: #fff;
		text{
			font-size: 31upx;
			color: #333;
			&.label{
				margin-right: 52upx;
			}
		}
		image{
			width: 65upx;
			height: 65upx;
			margin-right: 52upx;
		}
		
		
		
	}
</style>
