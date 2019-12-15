<template>
	<view>
		<view class="float_btn" @tap="add">+</view>

		<view class="card_list" v-if="stages.length>0">
			<view v-for="(stage, index) in stages" :key="index">
<!-- 				<uni-swipe-action>
					<uni-swipe-action-item :options="options" @click="deleteContent(stage.id)"> -->
						<view class="card_item" @tap="jumpToPage(stage)">
							<image v-if="stage.imageUrl != null" :src="stage.imageUrl" class="card_pic"></image>
							<view class="card_inner">
								<!--同事朋友-->
								<view class="inner_flex" v-if="param.moduleId=='27'">
									<view class="card_title">{{stage.name}}</view>
									<view class="card_title">{{stage.mobile}}</view>
								</view>
								<view class="card_title" v-else>{{ stage.name }}</view>
								<!--婚礼时间-->
								<view class="time mt20" v-if="param.moduleId==='32'">{{ stage.startTime}}</view>
								<!--车辆日期-->
								<view class="time mt20" v-if="param.moduleId==='31'">{{stage.startTime}}</view>
								<view class="time mt20" v-if="enableDateCtrl">{{ stage.startTime | formatDate }}-{{ stage.endTime | formatDate }}</view>
								<view class="card_others card_others_1">
									<view class="inner_flex">
										<!--车辆已出售-->
										<text class="time" v-if="param.moduleId=='31'">{{ stage.endTime}}</text>
										<text class="time" v-else>{{ stage.description }}</text>
										<view v-if="!isEdit">
											<image src="../../static/images/icon_arrow_right.png" class="arrow" @tap.stop="jumpToList(stage)"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
<!-- 					</uni-swipe-action-item>
				</uni-swipe-action> -->
			</view>
<!-- 			<view @tap="loadMore">
				<uni-load-more :status="status" style="height: 100upx;"></uni-load-more>
			</view> -->
		</view>
		<view v-else style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
			<image src="../../static/images/null_data.png" style="width: 464upx;height: 417upx;"></image>
			<view style="font-size: 36upx;color: #999;">{{defaultText.nullData}}</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import config from '@/common/componetConfig.js'
	// import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	// import uniSwipeActionItem from '@/components/uni-ui/uni-swipe-action-item/uni-swipe-action-item';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					name: null,
					flag: null,
					language: null,
					isFamily: null
				},
				stageList: [],
				isEdit: false,
				ctrlEnable: {
					dateFirstCtrl: true,
					dateSecondCtrl: false
				},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width: '105px'
					}
				}],
				suffixUrl: '&style=image/resize,m_fill,w_100,h_100',
				status: 'more'
			};
		},
		computed: {
			defaultText() {
				return this.$t('defaultText')
			},
			other() {
				return this.$t('other')
			},
			enableDateCtrl: function() {
				return ['27', '31', '32'].indexOf(this.param.moduleId) === -1
			},
			stages: function() {
				let self = this
				for (let i = 0; i < this.stageList.length; i++) {
					if (this.param.moduleId === '32') {
						self.stageList[i].name = self.stageList[i].name.replace(',', this.other.and).concat(this.other.marriage)
						self.stageList[i].startTime = util.dateFormat(self.stageList[i].startTime)
					} else if (this.param.moduleId === '31') {
						if (self.stageList[i].startTime) {
							self.stageList[i].startTime = this.other.buy + util.dateFormat(self.stageList[i].startTime)
						}else{
							self.stageList[i].startTime = ''
						}
						if (self.stageList[i].endTime) {
							// let curDt = new Date().getDate();
							if(self.stageList[i].endTime){
								self.stageList[i].endTime=this.other.sell
							}
						}else{
							self.stageList[i].endTime=''
						}
					}
					if (self.stageList[i].imageUrl != null) {
						self.stageList[i].imageUrl = this.$common.picPrefix() + self.stageList[i].imageUrl + this.suffixUrl
					}
				}
				return self.stageList
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return '';
				return util.dateFormat(value);
			},
			buyDesc: function(value) {
				if (!value) return '';
				return '购买于' + util.dateFormat(value)
			},
			saleDesc: function(value) {
				if (!value) return '';
				let curDt = new Date().getDate();
				if (curDt >= value) return '已出售'
			}
		},
		components: {uniLoadMore},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: options.name
			});
			util.loadObj(this.param, options);
		},
		onShow: function() {
			this.loadData();
		},
		onNavigationBarButtonTap(e) {
			this.isEdit = !this.isEdit;
			const buttonIndex = e.index;
			if (buttonIndex === 0) {

				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				let titleObj = currentWebview.getStyle().titleNView;
				console.log(JSON.stringify(titleObj.buttons[0]));
				if (!titleObj.buttons) return;
				if (titleObj.buttons[0].text == '编辑') {
					titleObj.buttons[0].text = "完成";
				} else {
					titleObj.buttons[0].text = "编辑";
				}
				currentWebview.setStyle({
					titleNView: titleObj
				});
				// #endif
			}
		},
		methods: {
			// initControl: function(moduleId) {
			// 	let id = parseInt(moduleId);
			// 	let stageListConfig = config.stageList;
			// 	this.ctrlEnable.dateFirstCtrl = stageListConfig.dateFirstCtrl.indexOf(id) >= 0;
			// 	this.ctrlEnable.dateSecondCtrl = stageListConfig.dateSecondCtrl.indexOf(id) >= 0;
			// },
			jumpToPage: function(item) {
				if (this.isEdit) {
					let url = 'stageEdit' + util.jsonToQuery({
						userId: this.param.userId,
						moduleId: this.param.moduleId,
						language: this.param.language,
						id: item.id,
						name: this.param.name
					})
					uni.navigateTo({
						url: url
					})
				} else {
					let _param = this.param;
					_param['stageId'] = item.id;
					_param['stageName'] = item.name;
					uni.navigateTo({
						url: 'list' + util.jsonToQuery(_param)
					});
				}
			},
			jumpToList: function(item) {
				let _param = this.param;
				_param['stageId'] = item.id;
				_param['stageName'] = item.name;
				uni.navigateTo({
					url: 'list' + util.jsonToQuery(_param)
				});
			},
			loadData: function() {
				this.$http.get('contentPeriod/query', this.param).then(res => {
					if (res.data.code === 200) {
						this.stageList = res.data.data.contentPeriodList;
					} else {
						uni.showToast({
							title: '阶段信息加载失败',
							icon: 'none'
						});
					}
				});
			},
			add: function() {
				uni.navigateTo({
					url: 'stageEdit' + util.jsonToQuery({
						userId: this.param.userId,
						moduleId: this.param.moduleId,
						name: this.param.name,
						language: this.param.language
					})
				});
			},
			deleteContent: function(id) {
				var self = this
				uni.showModal({
					title: '删除',
					content: '确认删除该记录？',
					confirmText: '确认',
					success: function(res) {
						if (res.confirm) {
							self.$http.post('contentPeriod/deletePeriod', {
								language: self.param.language,
								contentPeriodId: id
							}).then(res => {
								if (res.data.code === 200) {
									self.loadData();
								} else {
									uni.showToast({
										title: '内容删除失败',
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
	};
</script>

<style lang="less" scoped>
	@import '../../common/card.css';

	page {
		border-top: 1px solid #e5e5e5;
	}

	.search_info {
		margin-top: 40upx;
		margin-bottom: 40upx;
		height: 68upx;
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
</style>
