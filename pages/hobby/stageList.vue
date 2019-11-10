<template>
	<view>
		<view class="float_btn" @tap="add">+</view>
		<view class="card_list">
			<view class="card_item" v-for="(stage, index) in stages" :key="index" @tap="jumpToPage(stage)">
				<image :style="{ display: stage.imageUrl == '' ? 'none' : 'block' }" :src="stage.imageUrl" class="card_pic"></image>
				<view class="card_inner">
					<view class="card_title">{{ stage.name }}</view>
					<!--婚礼时间-->
					<view class="time mt20" v-if="param.moduleId==='32'">{{ stage.startTime | formatDate }}</view>
					<!--车辆日期-->
					<view class="time mt20" v-if="param.moduleId==='31'">{{stage.startTime | buyDesc}}</view>
					<view class="time mt20" v-else>{{ stage.startTime | formatDate }}-{{ stage.endTime | formatDate }}</view>
					<view class="card_others card_others_1">
						<view class="inner_flex">
							<!--车辆已出售-->
							<text class="time" v-if="param.moduleId=='31'">{{ stage.endTime | saleDesc}}</text>
							<text class="time" v-else>{{ stage.description }}</text>
							<image src="../../static/images/icon_arrow_right.png" class="arrow" @tap.stop="jumpToList(stage)"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import config from '@/common/componetConfig.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					name: null,
					flag: null,
					language: null
				},
				stageList: [],
				isEdit: false,
				ctrlEnable: {
					dateFirstCtrl: true,
					dateSecondCtrl: false
				}
			};
		},
		computed: {
			stages: function() {
				let self = this
				for (let i = 0; i < this.stageList.length; i++) {
					if (this.param.moduleId === '32') {
						self.stageList[i].name = self.stageList[i].name.replace(',', '与').concat('的婚礼')
						self.stageList[i].startTime = util.dateFormat(self.stageList[i].startTime, 'yyyy年MM月dd日')
					}
					self.stageList[i].imageUrl = this.$common.picPrefix() + self.stageList[i].imageUrl
				}
				return self.stageList
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return '';
				return util.dateFormat(value, 'yyyy.MM.dd');
			},
			buyDesc: function(value) {
				if (!value) return '';
				return '购买于' + util.dateFormat(value, 'yyyy年MM月dd日')
			},
			saleDesc: function(value) {
				if (!value) return '';
				let curDt = new Date().getDate();
				if (curDt >= value) return '已出售'
			}
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: options.name
			});
			util.loadObj(this.param, options);
			// this.initControl(this.param.moduleId)
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
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '../../common/card.less';

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
	}
</style>
