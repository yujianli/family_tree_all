<template>
	<view>
		<view class="fee_info fee_pd" style="margin-top: 18px;">会员类型：VIP年费会员</view>
		<view class="fee_info fee_pd">2019年1月20日-2020年1月19日</view>
		<view class="fee_tips">有效期还有256天过期</view>
		<view class="more_tips fee_pd">直接购买更多年限有更多优惠</view>
		<view class="fee_wrapper">
			<view v-for="(fee,index) in feeList">
				<view @tap="setActive(fee.title,fee.price)" :class="['fee_item',{active : activeTitle == fee.title}]">
					<text class="fee_title">{{fee.title}}</text>
					<view class="fee_inner">
						<text class="fee_unit">￥</text>
						<text class="fee_price">{{fee.price}}</text>
					</view>
					<text class="fee_year">元/年</text>
				</view>
			</view>
		</view>
		<view  style="margin-left: 15upx;margin-right: 15upx;margin-bottom: 80upx;">
			<button type="primary" @click="openPopup" class="btn_open">立即开通</button>
		</view>
		<uni-popup ref="fee_popup" type="bottom">
			<view class="pay_wrapper">
				<view class="pay_hd">
					<text class="f18">支付年费</text>
					<text class="f15" @click="closePopup">取消</text>
				</view>
				<view class="fee_type">类型：{{activeTitle}}{{activePrice}}</view>
				<view v-for="(pay,index) in payList" class="pay_item">
					<view>
						<image :src="pay.pic"></image>
						<text>{{pay.name}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				feeList: [{
						title: '1年VIP年费',
						price: '360',
					},
					{
						title: '2年VIP年费',
						price: '700',
					},
					{
						title: '3年VIP年费',
						price: '1280',
					},
				],
				activeTitle: "1年VIP年费",
				activePrice:'360',
				payList: [{
					id: 1,
					name: '支付宝',
					pic: '../../static/images/icon_zfb.png'
				}, {
					id: 2,
					name: '微信支付',
					pic: '../../static/images/icon_wx.png'

				}, {
					id: 3,
					name: '苹果支付',
					pic: '../../static/images/icon_pg.png'

				}]
			}
		},
		components: {
			uniPopup
		},
		methods: {
			setActive: function(name,price) {
				this.activeTitle = name;
				this.activePrice = price;
			},
			openPopup: function() {
				this.$refs.fee_popup.open()
			},
			closePopup: function() {
				this.$refs.fee_popup.close();
			}
		}
	}
</script>

<style lang='less' scoped>
	.fee_pd {
		padding-left: 30upx;
		padding-bottom: 30upx;
	}

	.fee_info {
		margin-top: 36upx;
		color: #333;
		font-size: 32upx;
	}

	.fee_tips {
		font-size: 28upx;
		color: #999;
		text-align: center;
		margin-top: 36upx;
	}

	.more_tips {
		font-size: 28upx;
		color: #333;
		margin-top: 88upx;
	}

	.fee_wrapper {
		margin-top: 32upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;

	}

	.fee_item {
		border: 1px solid #ccc;
		border-radius: 10upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 52upx 28upx;
		&.active {
			border-color: #FCB65F;
			background-color: #F4D9B7;
		}
		.fee_title {
			font-size: 32upx;
			color: #333;
		}
		.fee_inner {
			margin-top: 26upx;
			display: flex;
			align-items:center;
			.fee_unit {
				font-size: 32upx;
				color: #ED9D3A;
				font-weight: 600;
			}
			.fee_price {
				font-size: 60upx;
				color: #ED9D3A;
				font-weight: 600;
			}
		}
		.fee_year {
			font-size: 30upx;
			color: #999;
			margin-top: 16upx;
		}
	}
	.btn_open {
		margin-top: 160upx;
		font-size: 32upx;
		color: #e5e5e5;
		background-color: #4DC578;
		height: 92upx;
		line-height: 92upx;
	}

	.pay_wrapper {
		padding: 34upx;
		background-color: #fff;
		padding-bottom: 90upx;

		.pay_hd {
			color: #333;
			padding-bottom: 30upx;
			border-bottom-width: 1px;
			border-bottom-color: #E5E5E5;
			border-bottom-style: solid;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.f18 {
				font-size: 36upx;
			}
			.f15 {
				font-size: 30upx;
			}
		}
		.fee_type {
			margin-top: 20upx;
			font-size: 30upx;
			color: #333;
			margin-bottom: 70upx;
		}
		.pay_item {
			margin-top: 40upx;
			view {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			image {
				width: 60upx;
				height: 60upx;
				margin-right: 20upx;
			}
			text {
				font-size: 30upx;
				color: #333;
			}
		}
	}
</style>
