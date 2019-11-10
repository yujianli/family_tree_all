<template>
	<view class="container_pd">
		<view class="clan_result_container" v-for="(clan,index) in clanList">
			<view class="clan_hd">
				<image :src="clan.pic"></image>
				<text>{{clan.name}}</text>
			</view>
			<view class="clan_item">
				<view>出生年月： {{clan.birth}}</view>
				<view>职业： {{clan.career}}</view>
			</view>
			<view class="clan_item">
				<view>出生地：{{clan.birthPlace}}</view>
				<view>居住省市： {{clan.residencePlace}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				clanList:[{
					id:1,
					pic:'../../../static/images/avatar.png',
					name:'1万家掌柜',
					birth:'11992年11月',
					career:'1开发程序员',
					birthPlace:'1浙江杭州',
					residencePlace:'1浙江温州'
				},{
					id:2,
					pic:'../../../static/images/avatar.png',
					name:'2万家掌柜',
					birth:'21992年11月',
					career:'2开发程序员',
					birthPlace:'2浙江杭州',
					residencePlace:'2浙江温州'
				},{
					id:3,
					pic:'../../../static/images/avatar.png',
					name:'3万家掌柜',
					birth:'31992年11月',
					career:'3开发程序员',
					birthPlace:'3浙江杭州',
					residencePlace:'3浙江温州'
				}]

			}
		},
		methods: {

		}
	}
</script>

<style lang="less" scoped>
	.container_pd {
		padding: 34upx
	}

	.clan_result_container {
		border-radius: 15upx;
		padding: 30upx;
		box-shadow: 2upx 0 10upx #ccc;
		margin-top: 20upx;

		.clan_hd {
			display: flex;
			flex-direction: row;
			align-items: center;

			image {
				width: 92upx;
				height: 92upx;
			}

			text {
				font-size: 35upx;
				color: #333;
				font-weight: 600;
				margin-left: 24upx;
			}
		}

		.clan_item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			font-size: 27upx;
			color: #333;
			margin-top: 30upx;
			margin-bottom: 15upx;
		}
	}
</style>
