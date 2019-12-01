<template>
	<view>
		<view class="fee_info fee_pd" style="margin-top: 18px;">会员类型：VIP年费会员</view>
		<view class="fee_info fee_pd">{{startTime}}-{{endTime}}</view>
		<view class="fee_tips">有效期还有{{day}}过期</view>
		<view class="more_tips fee_pd">直接购买更多年限有更多优惠</view>
		<view class="fee_wrapper">
			<view v-for="(fee,index) in feeList">
				<view @tap="setActive(fee.name,fee.price,fee.startTime,fee.endTime,fee.year)" 
				:class="['fee_item',{active : activeTitle == fee.name}]">
					<text class="fee_title">{{fee.name}}</text>
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
				<view v-for="(pay,index) in providerList" class="pay_item" :key="index">
					<view @click="requestPayment(pay,index)">
						<image :src="pay.pic"></image>
						<text>{{pay.name}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				param: {
					userId: null,
					language: this.$common.language
				},
				feeList: null,
				activeTitle: null,
				activePrice:null,
				activeYear:null,
				startTime:null,
				endTime:null,
				day:null,
				providerList: null,
				// payList: [{
				// 	id: 1,
				// 	name: '支付宝',
				// 	pic: '../../static/images/icon_zfb.png'
				// }, {
				// 	id: 2,
				// 	name: '微信支付',
				// 	pic: '../../static/images/icon_wx.png'

				// }, {
				// 	id: 3,
				// 	name: '苹果支付',
				// 	pic: '../../static/images/icon_pg.png'

				// }]
			}
		},
		components: {
			uniPopup
		},
		onShow: function() {
			let user = uni.getStorageSync("USER");
			this.param.userId = user.id;
			this.loadWhetherRemind();
			this.loadAnnualFeeList();
		},
		onLoad: function() {
		    // #ifdef APP-PLUS
		    uni.getProvider({
		        service: "payment",
		        success: (e) => {
		            console.log("payment success:" + JSON.stringify(e));
		            let providerList = [];
		            e.provider.map((value) => {
		                switch (value) {
		                    case 'alipay':
		                        providerList.push({
		                            name: '支付宝',
		                            id: value,
									pic:'../../static/images/icon_zfb.png',
		                        });
		                        break;
		                    case 'wxpay':
		                        providerList.push({
		                            name: '微信',
		                            id: value,
									pic:'../../static/images/icon_wx.png'
		                        });
		                        break;
		                    default:
		                        break;
		                }
		            })
		            this.providerList = providerList;
		        },
		        fail: (e) => {
		            console.log("获取支付通道失败：", e);
		        }
		    });
		    // #endif
		},
		methods: {
			setActive: function(name,price,startTime,endTime,year) {
				this.activeTitle = name;
				this.activePrice = price;
				this.activeYear = year;
				this.startTime = util.dateFormat(startTime,"yyyy年MM月dd日");
				this.endTime = util.dateFormat(endTime,"yyyy年MM月dd日");
			},
			openPopup: function() {
				this.$refs.fee_popup.open();
			},
			closePopup: function() {
				this.$refs.fee_popup.close();
			},
			// 获取年费类型列表
			loadAnnualFeeList:function(){
				this.$http
				.get('annualFee/query',{
					language: this.param.language,
					userId: this.param.userId
				})
				.then(res => {
					if(res.data.code == 200){
						 let list = res.data.data.annualFeeList;
						 if(list.length > 0) {
							 let firstAnnualFee = list[0];
							 this.feeList = list;
							 this.activeTitle = firstAnnualFee.name;
							 this.activePrice = firstAnnualFee.price;
							 this.activeYear = firstAnnualFee.year;
							 this.startTime = util.dateFormat(firstAnnualFee.startTime,"yyyy年MM月dd日");
							 this.endTime = util.dateFormat(firstAnnualFee.endTime,"yyyy年MM月dd日");
						 }
						 
					} else {
						uni.showToast({
							title: '年费费类型列表加载失败',
							icon: 'none'
						});
					}
				})
			},
			//获取用户试用状态
			loadWhetherRemind:function(){
				this.$http
				.post('content/whetherRemind',{
					language: this.param.language,
					userId: this.param.userId
				})
				.then(res => {
					if(res.data.code == 200){
						 this.day = res.data.data.day;
					} else {
						uni.showToast({
							title: '用户试用期状态加载失败',
							icon: 'none'
						});
					}
				})
			},
			
			async requestPayment(e, index) {
			   await this.getOrderInfo(e).then(res => {
					if(res.data.code == 200){
						console.log('---------------------------------')
						console.log(res.data)
						uni.requestPayment({
						    provider: e.id,
						    orderInfo: res.data.data[e.id],
						    success: (e) => {
						        console.log("success", e);
						        uni.showToast({
						            title: "支付成功"
						        })
						    },
						    fail: (e) => {
						        console.log("fail", e);
						        uni.showModal({
						            content: "支付失败",
						            showCancel: false
						        })
						    },
						    complete: () => {
						        //支付完成
						    }
						})
					} else {
						uni.showToast({
							title: '订单创建失败',
							icon: 'none'
						});
					}
				});
				
			   
			
			    
			},
			getOrderInfo(e) {
				console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
				console.log(e)
				//创建订单
				return this.$http.post('order/createOrder',{
					userCode: this.param.userId,
					pay_type: e.name,
					amount:this.activePrice,
					language: this.param.language,
					upgradeDay: this.activeYear,
					unit:1,
					type:2
				})
				
				
				
			    // let appid = "";
			    // // #ifdef APP-PLUS
			    // appid = plus.runtime.appid;
			    // // #endif
			    // let url = 'https://demo.dcloud.net.cn/payment/?payid=' + e + '&appid=' + appid + '&total=' + this.price;
			    // return new Promise((res) => {
			    //     uni.request({
			    //         url: url,
			    //         success: (result) => {
			    //             res(result);
			    //         },
			    //         fail: (e) => {
			    //             res(e);
			    //         }
			    //     })
			    // })
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
