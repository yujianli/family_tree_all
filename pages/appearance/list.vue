<!-- 体貌特征 -->
<template>
	<view style="background-color: #fafafa;padding-bottom: 100upx;">
		<view class="float_btn" @tap="add">+</view>
		<view v-if="appearanceList.length>0">
			<view v-for="appearance in appearanceList" v-bind:key="appearance.id" style="padding-top: 40upx;">
<!-- 				<uni-swipe-action>
					<uni-swipe-action-item :options="options" @click="remove(appearance.id)"> -->
						<view class="container" @tap="jumpToDetail(appearance.id)">
							<view style="box-shadow: 2upx 0 18upx #E5E5E5;border-radius: 15upx;padding: 30upx;background-color: #fff;">
								<view>{{appearance.age}}{{i18n.years}}</view>
								<view class="title">{{appearance.title}}</view>
								<view class="row">
									<view>{{i18n.height}}：{{appearance.height}}</view>
									<view>{{i18n.tshirtSize}}：{{appearance.tshirtSize | nullFilter}}</view>
								</view>
								<view class="row">
									<view>{{i18n.weight}}：{{appearance.weight}}</view>
									<view>{{i18n.shirtSize}}：{{appearance.shirtSize | nullFilter}}</view>
								</view>
								<view class="row">
									<view>{{i18n.faceShape}}：{{appearance.faceShape | nullFilter}}</view>
									<view>{{i18n.clothSize}}：{{appearance.clothSize | nullFilter}}</view>
								</view>
								<view class="row">
									<view>{{i18n.characteristics}}：{{appearance.characteristics | nullFilter}}</view>
									<view>{{i18n.trousersSize}}：{{appearance.trousersSize | nullFilter}}</view>
								</view>
								<view class="row">
									<view>{{i18n.shoeSize}}：{{appearance.shoeSize}}</view>
									<view></view>
								</view>
								<view class="row">
									<view style="flex-direction: row;display: flex;">
										<view class="tags_text" v-for="(tag,index) in appearance.tags">{{tag}}</view>
									</view>

									<view style="font-size: 30upx;color: #999999;">{{appearance.createDate | formatDate}}</view>
								</view>
							</view>
						</view>
<!-- 					</uni-swipe-action-item>
				</uni-swipe-action> -->
			</view>
		</view>
		
	</view>
</template>

<script>
	// import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	// import uniSwipeActionItem from '@/components/uni-ui/uni-swipe-action-item/uni-swipe-action-item';
	import dataJson from '@/static/appData.json';
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					language: null
				},
				appearanceList: [],
				options: [{
					text: this.$t('btnText').remove,
					style: {
						backgroundColor: '#ED4848',
						width: '105px'
					}
				}]
			}

		},
		// components: {
		// 	uniSwipeAction,
		// 	uniSwipeActionItem
		// },
		computed: {
			i18n() {
				return this.$t('common')
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value)
			},
			nullFilter:function(value){
				if(!value) return ''
				return value
			}
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.$t('title').appearance
			});
			util.loadObj(this.param, options)
		},
		onShow: function() {
			this.loadData();
		},
		methods: {
			jumpToDetail: function(id) {
				uni.navigateTo({
					url: '/pages/appearance/detail' + util.jsonToQuery({
						userId: this.param.userId,
						moduleId: this.param.moduleId,
						language: this.param.language,
						id: id
					})
				});
			},
			loadData: function() {
				this.$http.get('appearance/query', {
					userId: this.param.userId,
					moduleId: this.param.moduleId,
					language: this.param.language,
					page: 1,
					rows: 10
				}).then((res) => {
					if (res.data.code === 200) {
						let _list = res.data.data.appearanceList;
						for (var i = 0; i < _list.length; i++) {
							if(_list[i].height){
								_list[i].height=_list[i].height+'cm'
							}else{
								_list[i].height=''
							}
							if(_list[i].weight){
								_list[i].weight=_list[i].weight+'kg'
							}else{
								_list[i].weight=''
							}
							if(_list[i].shoeSize){
								_list[i].shoeSize = this.bindProp('size', _list[i].shoeSize)+this.$t('common').yards
							}else{
								_list[i].shoeSize=''
							}
							_list[i].faceShape = this.bindProp('faceShape', _list[i].faceShape);
							_list[i].tshirtSize = this.bindProp('size', _list[i].tshirtSize);
							_list[i].shirtSize = this.bindProp('size', _list[i].shirtSize);
							_list[i].clothSize = this.bindProp('size', _list[i].clothSize);
							_list[i].trousersSize = this.bindProp('size', _list[i].trousersSize);
							
							if (_list[i].tags) {
								_list[i].tags = _list[i].tags.split(',')
							} else {
								_list[i].tags = []
							}
						}
						this.appearanceList = _list
					} else {
						uni.showToast({
							title: '用户模块信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			bindProp: function(key, val) {
				let data=this.$t('selData')
				for (var i = 0; i < data[key].length; i++) {
					if (data[key][i].key === val) {
						return data[key][i].value;
					}
				}
			},
			add: function() {
				uni.navigateTo({
					url: 'edit' + util.jsonToQuery(this.param)
				})
			},
			remove: function(id) {
				uni.showModal({
					title: '删除',
					content: '确认删除该记录？',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.$http.post('appearance/deleteAppearance', {
									appearanceId: id,
									language: this.param.language
								})
								.then(res => {
									if (res.data.code === 200) {
										this.loadData();
									} else {
										uni.showToast({
											title: '删除失败',
											icon: 'none'
										});
									}
								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}

					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		border-top: 1px solid #e5e5e5;
	}
	.container {
		flex: 1;
		padding-left: 30upx;
		padding-right: 30upx;
		background: #fafafa;
	}

	.row {
		margin-top: 40upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		color: #333;
	}

	.title {
		font-size: 36upx;
		color: #333;
		font-weight: 700;
	}

	.float_btn {
		width: 109upx;
		height: 109upx;
		background-color: #4dc578;
		border-radius: 50%;
		position: fixed;
		right: 41upx;
		bottom: 100upx;
		font-size: 70upx;
		line-height: 1.5;
		text-align: center;
		color: #fff;
		z-index: 999999;
		box-shadow: 2upx 0 18upx #25A754;
	}

	.tags_text {
		font-size: 30upx;
		color: #56D282;
		background: #F8F8F8;
		border-radius: 20upx;
		padding: 8upx 20upx;
		vertical-align: middle;
		margin-right: 10upx;
	}
</style>
