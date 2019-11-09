<template>
	<view>
		<view class="float_btn" @tap="add">+</view>
		<view class="card_list">
			<view class="card_item" v-for="(stage, index) in stageList" :key="index" @tap="jumpToPage(stage)">
				<image :style="{ display: stage.imageUrl == '' ? 'none' : 'block' }" :src="stage.imageUrl" class="card_pic"></image>
				<view class="card_inner">
					<view class="card_title">{{ stage.name }}</view>
					<view class="time mt20">{{ stage.startTime | formatDate }}-{{ stage.endTime | formatDate }}</view>
					<view class="card_others card_others_1">
						<view class="inner_flex">
							<text class="time">{{ stage.description }}</text>
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
				isEdit:false
			};
		},
		filters: {
			formatDate: function(value) {
				if (!value) return '';
				return util.dateFormat(value, 'yyyy.MM.dd');
			}
		},
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
			// let pages = getCurrentPages();
			// let page = pages[pages.length - 1];
			// let currentWebview = page.$getAppWebview();
			// let titleObj = currentWebview.getStyle().titleNView;
			// console.log(titleObj)
			// console.log(currentWebview)
			// var tn = currentWebview.getStyle().titleNView;
			// tn.buttons[0].text = buttons;
			// currentWebview.setStyle({
			// 	titleNView: tn
			// });
			
			const buttonIndex = e.index;
			if (buttonIndex === 0) {
				console.log(e.text);
				this.edit = !this.edit;
							
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				let titleObj = currentWebview.getStyle().titleNView;
				console.log(JSON.stringify(titleObj.buttons[0]));
				if (!titleObj.buttons) return;
				if(titleObj.buttons[0].text == '编辑'){
					this.isEdit=true
					titleObj.buttons[0].text = "完成";
				}else{
					this.isEdit=false
					titleObj.buttons[0].text = "编辑";
				}
				currentWebview.setStyle({
					titleNView: titleObj
				});
				// #endif
			}
			
			// let url = 'placeEdit' + util.jsonToQuery(this.param)
			// uni.navigateTo({
			// 	url: url
			// })
		},
		methods: {
			jumpToPage: function(item) {
				if(this.isEdit){
					let url = 'stageEdit' + util.jsonToQuery({
						userId:this.param.userId,
						moduleId:this.param.moduleId,
						language:this.param.language,
						id:item.id,
						name: this.param.name
					})
					uni.navigateTo({
						url: url
					})
				}else{
					let _param = this.param;
					_param['stageId'] = item.id;
					_param['stageName'] = item.name;
					uni.navigateTo({
						url: 'list' + util.jsonToQuery(_param)
					});
				}
				// let _param = this.param;
				// _param['id'] = item.id;
				// uni.navigateTo({
				// 	url: 'stageDetail' + util.jsonToQuery(_param)
				// });
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
