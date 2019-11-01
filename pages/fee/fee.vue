<template>
	<view>
		<view class="fee_info fee_pd" style="margin-top: 18px;">会员类型：VIP年费会员</view>
		<view class="fee_info fee_pd">2019年1月20日-2020年1月19日</view>
		<view class="fee_tips">有效期还有256天过期</view>
		<view class="more_tips fee_pd">直接购买更多年限有更多优惠</view>
		<view class="fee_wrapper">
			<view v-for="(fee,index) in feeList">
				<view @tap="setActive(fee.title)" :class="['fee_item',{active : active == fee.title}]">
					<text class="fee_title">{{fee.title}}</text>
					<view class="fee_inner">
						<text class="fee_unit">￥</text>
						<text class="fee_price">{{fee.price}}</text>
					</view>
					<text class="fee_year">元/年</text>
				</view>
			</view>
		</view>
		<view class="fee_pd">
			<button type="primary" @click="openPopup" class="btn_open fee_pd">立即开通</button>
		</view>
		<uni-popup ref="fee_popup" type="bottom">
			<view class="pay_wrapper">
				<view class="pay_hd">
					<text class="f18">支付年费</text>
					<text class="f15" @click="closePopup">取消</text>
				</view>
				<view class="fee_type">类型：支付1年VIP360元</view>
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
				active: "1年VIP年费",
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
			setActive: function(name) {
				this.active = name;
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

<style lang='less'>
	.fee_pd {
		padding-left: 15px;
		padding-bottom: 15px;
	}

	.fee_info {
		margin-top: 18px;
		color: #333;
		font-size: 16px;
	}

	.fee_tips {
		font-size: 14px;
		color: #999;
		text-align: center;
		margin-top: 18px;
	}

	.more_tips {
		font-size: 14px;
		color: #333;
		margin-top: 44px;
	}

	.fee_wrapper {
		margin-top: 16px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;

	}

	.fee_item {
		border: 1px solid #ccc;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 26px 14px;

		&.active {
			border-color: #FCB65F;
			background-color: #F4D9B7;
		}
	}

	.fee_title {
		font-size: 16px;
		color: #333;
	}

	.fee_inner {
		margin-top: 13.5px;
		display: flex;
		align-items:center;

		.fee_unit {
			font-size: 16px;
			color: #ED9D3A;
		
			font-weight: 600;
		}

		.fee_price {
			font-size: 30px;
			color: #ED9D3A;
			font-weight: 600;
		}

		.fee_year {
			font-size: 15px;
			color: #999;
			margin-top: 8.5px;
		}
	}

	.btn_open {
		margin-top: 80px;
		font-size: 16px;
		color: #e5e5e5;
		background-color: #4DC578;
		height: 46px;
		line-height: 46px;
	}

	.pay_wrapper {
		padding: 17px;
		background-color: #fff;
		padding-bottom: 45px;

		.pay_hd {
			color: #333;
			padding-bottom: 15px;
			border-bottom-width: 1px;
			border-bottom-color: #E5E5E5;
			border-bottom-style: solid;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.f18 {
				font-size: 18px;
			}

			.f15 {
				font-size: 15px;
			}
		}

		.fee_type {
			margin-top: 10px;
			font-size: 15px;
			color: #333;
			margin-bottom: 35px;
		}

		.pay_item {
			margin-top: 20px;

			view {
				display: flex;
				flex-direction: row;
			}

			image {
				width: 30px;
				height: 30px;
				margin-right: 10px;
			}

			text {
				font-size: 15px;
				color: #333;
			}
		}
	}
</style>
