<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">{{i18n.begintime}}</text>
			<view>{{stageInfo.begintime}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.endtime}}</text>
			<view>{{stageInfo.endtime}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{typeCtrlName}}</text>
			<view>{{stageInfo.name}}</view>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">{{i18n.content}}</text>
			<view>{{stageInfo.description}}</view>
		</view>
		<view class="opt_container">
			<button class="btn_delete" @tap="remove">{{btnText.remove}}</button>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import module from '@/common/moduleLink.js'
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
					begintime: util.getDate(),
					endtime: util.getDate(),
					description: '',
					name: '',
					id: null
				}
			};
		},
		computed: {
			i18n() {
				return this.$t('common')
			},
			btnText(){
				return this.$t('btnText')
			},
			typeCtrlName: function() {
				let _name = module.viewCtrlName[this.param.moduleId]
				if (_name) {
					return _name;
				} else {
					return '类型';
				}
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
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					}
				})
			},
			remove: function() {
				this.$http.post('contentPeriod/deletePeriod', {
					contentPeriodId: this.param.id,
					language: this.param.language
				}).then((res) => {
					if (res.data.code === 200) {
						uni.navigateBack({
							delta: 1
						})
					} else {
						uni.showToast({
							title: '删除失败',
							icon: 'none'
						});
					}
				})
			}
		}
	}
</script>

<style>
	page{
		border-top: 1px solid #e5e5e5;
	}
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
	.opt_container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: -8upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 114upx;
	
	}
	
	.btn_delete {
		flex: 1;
		font-size: 38upx;
		color: #ffffff;
		background-color: #FB4F4F;
		border-radius: 0;
	}
	
	.btn_delete:after {
		border: 0px;
	}
</style>
