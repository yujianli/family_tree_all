<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">起始年月</text>
			<view>{{stageInfo.startTime | formatDate}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">结束年月</text>
			<view>{{stageInfo.endTime | formatDate}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">计划名称</text>
			<view>{{stageInfo.name}}</view>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">内容</text>
			<view>{{stageInfo.description}}</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					language: null,
					name: null,
					id: null
				},
				stageInfo: {
					startTime: util.getDate(),
					endTime: util.getDate(),
					description: '',
					name: '',
					id: null
				}
			}
		},
		filters:{
			formatDate: function(value) {
				if (!value) return '';
				return util.dateFormat(value);
			}
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
			util.loadObj(this.param, options)

		},
		onShow: function() {
			this.loadData(this.param.id)
		},
		onNavigationBarButtonTap(e) {
			let url = 'stageEdit' + util.jsonToQuery(this.param)
			uni.navigateTo({
				url: url
			})
		},
		methods: {
			loadData: function(id) {
				this.$http.get('contentPeriod/detailPeriod', {
					contentPeriodId: id,
					language: this.param.language
				}).then((res) => {
					if (res.data.code === 200) {
						let _data = res.data.data.contentPeriodInfo
						util.loadObj(this.stageInfo, _data)
						this.stageInfo.begintime=_data.begintime
						this.stageInfo.endtime=_data.begintime
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style>
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
	.mul_wrapper{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-top: 20upx;
	}
	.mul_input{
		height: 492upx;
		font-size: 34upx;
		color: #303641;
		flex: 1;
		border:1px solid #E5E5E5;
		border-radius: 8upx;
		padding: 18upx;
	}
</style>
