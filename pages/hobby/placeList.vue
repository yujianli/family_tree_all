<template>
	<view>
		<view class="float_btn" @tap="add">+</view>
		<view class="card_list" v-if="places.length>0">
			<view v-for="(place, index) in places" :key="index">
				<uni-swipe-action>
					<uni-swipe-action-item :options="options" @click="deleteContent(place.id)">
						<view class="card_item" @tap="jumpToPage(place)">
							<image v-if="place.imageUrl != null" :src="place.imageUrl" class="card_pic"></image>
							<view class="card_inner">
								<view class="card_title">{{ place.address }}</view>
								<view class="time mt20">{{place.begintime}}</view>
								<view class="card_others card_others_1">
									<view class="inner_flex">
										<text class="time">{{ place.endtime}}</text>
										<view v-if="!isEdit">
											<image src="../../static/images/icon_arrow_right.png" class="arrow" @tap.stop="jumpToList(place)"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
		<view v-else style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
			<image src="../../static/images/null_data.png" style="width: 464upx;height: 417upx;"></image>
			<view style="font-size: 36upx;color: #999;">{{defaultText.nullData}}</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	import uniSwipeActionItem from '@/components/uni-ui/uni-swipe-action-item/uni-swipe-action-item';
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
				placeList: [],
				isEdit: false,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width: '105px'
					}
				}],
				suffixUrl: '&style=image/resize,m_fill,w_123,h_92'
			}
		},
		computed: {
			defaultText() {
				return this.$t('defaultText')
			},
			places: function() {
				let self = this
				for (let i = 0; i < this.placeList.length; i++) {
					if(self.placeList[i].imageUrl){
						self.placeList[i].imageUrl = this.$common.picPrefix() + self.placeList[i].imageUrl + this.suffixUrl;
					}
					if(self.placeList[i].begintime){
						self.placeList[i].begintime= this.$t('other').buy + util.dateFormat(self.placeList[i].begintime)
					}else{
						self.placeList[i].begintime=''
					}
					if(self.placeList[i].endtime){
						let curDt = new Date().getDate();
						if(curDt>=self.placeList[i].endtime){
							self.placeList[i].endtime=this.$t('other').sell
						}else{
							self.placeList[i].endtime=''
						}
					}else{
						self.placeList[i].endtime=''
					}
				}
				return self.placeList
			}
		},
		filters: {
			buyDesc: function(value) {
				if (!value) return '';
				return '购买于' + util.dateFormat(value)
			},
			saleDesc: function(value) {
				if (!value) return '';
				let curDt = new Date().getDate();
				if (curDt >= value) return '已售出'
			}
		},
		components:{uniSwipeAction,uniSwipeActionItem},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: options.name
			});
			util.loadObj(this.param, options);
		},
		onShow: function() {
			this.loadData()
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
			jumpToPage: function(item) {
				if (this.isEdit) {
					let url = 'placeEdit' + util.jsonToQuery({
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
					_param['stageName'] = item.address;
					uni.navigateTo({
						url: 'list' + util.jsonToQuery(_param)
					});
				}
			},
			jumpToList: function(item) {
				let _param = this.param;
				_param['stageId'] = item.id;
				_param['stageName'] = item.address;
				uni.navigateTo({
					url: 'list' + util.jsonToQuery(_param)
				});
			},
			loadData: function() {
				this.$http.get('contentPlace/query', this.param).then(res => {
					if (res.data.code === 200) {
						this.placeList = res.data.data.contentPlaceList;
					} else {
						uni.showToast({
							title: '地点信息加载失败',
							icon: 'none'
						});
					}
				});
			},
			add: function() {
				uni.navigateTo({
					url: 'placeEdit' + util.jsonToQuery({
						userId: this.param.userId,
						moduleId: this.param.moduleId,
						name: this.param.name,
						language: this.param.language
					})
				});
			},
			deleteContent:function(id){
				var self = this
				uni.showModal({
					title: '删除',
					content: '确认删除该记录？',
					confirmText: '确认',
					success: function(res) {
						if (res.confirm) {
							self.$http.post('contentPlace/deletePlace', {
									language: self.param.language,
									contentPlaceId: id
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
	}
</script>

<style lang="less" scoped>
	@import '../../common/card.css';
	page{
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
