<template>
	<view>
		<view class="float_btn" @tap="add">+</view>
		<view style="position:relative" v-if="ctrlEnable.tabCtrl">
			<myTab :tabList="moduleList" @tabSelect="tabSelect" :tabActiveIdx="tabActiveIdx" />
		</view>
		<view class="container_pd" v-if="ctrlEnable.selfDescCtrl">
			<view class="self_intro_container">
				<text>{{ param.name }}{{i18n.selfDesc}}</text>
				<image src="../../static/images/edit.png" @tap="editDesc"></image>
			</view>
			<view class="intro_detail">{{ selfDesc }}</view>
		</view>
		<view v-if="['4','14','15','16'].indexOf(param.moduleId)===-1">
			<uni-search-bar :radius="100" class="search_info" @confirm="search" />
		</view>
		<!-- <contentList :param="param"></contentList> -->
		<view class="card_list" v-if="contentList.length>0">
			<view v-for="(content, i) in contentList" v-bind:key="content.contentId">
				<uni-swipe-action>
					<uni-swipe-action-item :options="options" @click="deleteContent(content.contentId)">
						<view class="card_item" @tap="jumpToDetail(content)">
							<view style="position: absolute;left: 0;top:0;width: 88upx;height: 37upx;line-height: 37upx;text-align: center;background: #ED4848;color: #fff;
							border-bottom-left-radius: 8upx;border-bottom-right-radius: 8upx;font-size: 20upx;left: 30upx;">我的格言</view>
							<image v-if="content.imageUrl != null" :src="content.imageUrl" class="card_pic"></image>
							<view class="card_inner">
								<text class="card_title">{{ content.content }}</text>
								<view class="card_others">
									<view class="tags">
										<view v-if="content.tags.length>2">
											<text class="tags_text" v-for="(tag, i) in content.tags.splice(0,2)" v-bind:key="tag">{{tag}}</text>
										</view>
										<view v-else>
											<text class="tags_text" v-for="(tag, i) in content.tags" v-bind:key="tag">{{tag}}</text>
										</view>
									</view>
									<text class="time">{{ content.createDate | formatDate}}</text>
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
	import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar';
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	import uniSwipeActionItem from '@/components/uni-ui/uni-swipe-action-item/uni-swipe-action-item';
	import myTab from '@/components/xyz-tab';
	import util from '@/common/util.js';
	import config from '@/common/componetConfig.js';
	import module from '@/common/moduleLink.js';
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					page: 1,
					rows: 10,
					flag: null,
					flagId: null,
					name: '',
					language: null,
					isFamily: null
				},
				ctrlEnable: {
					tabCtrl: true,
					selfDescCtrl: false
				},
				seledFlagId: null,
				selfDesc: '',
				moduleList: [],
				tabActiveIdx: 0,
				contentList: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width: '105px'
					}
				}],
				suffixUrl: '&style=image/resize,m_fill,w_123,h_92'
			};
		},
		components: {
			uniSearchBar,
			uniSwipeAction,
			uniSwipeActionItem,
			myTab
		},
		computed:{
			i18n() {
				return this.$t('common')
			},
			defaultText(){
				return this.$t('defaultText')
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value)
			}
		},
		onLoad: function(options) {
			let title = null;
			let modId = parseInt(options.moduleId);
			if (module.isStage.indexOf(modId) >= 0) {
				title = options.stageName;
			} else {
				title = options.name;
			}
			uni.setNavigationBarTitle({
				title: title
			});
			util.loadObj(this.param, options);
			this.initControl(this.param.moduleId);
		},
		onShow: function() {
			this.loadSelfDesc();
			this.loadModule(this.param.moduleId);
		},
		methods: {
			initControl: function(moduleId) {
				let id = parseInt(moduleId);
				let listConfig = config.list;
				this.ctrlEnable.tabCtrl = listConfig.tabCtrl.indexOf(id) >= 0;
				this.ctrlEnable.selfDescCtrl = listConfig.selfDescCtrl.indexOf(id) >= 0;
			},
			jumpToDetail: function(content) {
				let p = {
					userId: this.param.userId,
					moduleId: this.param.moduleId,
					flag: this.param.flag,
					contentId: content.contentId,
					name: this.param.name,
					language: this.param.language,
					isFamily: this.param.isFamily
				};
				let url = '/pages/hobby/detail' + util.jsonToQuery(p);
				uni.navigateTo({
					url: url
				});
			},
			loadSelfDesc: function() {
				this.$http
					.get('selfDesc/detailSelfDesc', {
						userId: this.param.userId,
						moduleId: this.param.moduleId,
						language: this.param.language
					})
					.then(res => {
						if (res.data.code === 200) {
							let _data = res.data.data.selfDescriptionInfo;
							if (_data) {
								this.selfDesc = _data.selfDesc;
							}
						} else {
							uni.showToast({
								title: '自述信息加载失败',
								icon: 'none'
							});
						}
					});
			},
			loadModule: function() {
				if (this.param.flag == 'category') {
					this.initCategory()
				} else if (this.param.flag == 'period') {
					this.initPeriod()
				} else {
					this.loadContent(null)
				}
			},
			initCategory: function() {
				this.$http.get('category/query', {
					moduleId: this.param.moduleId,
					language: this.param.language,
					type:'1',
					userId:this.param.userId
				}).then(res => {
						if (res.data.code === 200) {
							let _list = res.data.data.contentCategory;
							this.moduleList = util.objectTransfer(_list, ['id', 'name'], ['id', 'label']);
							if (!this.seledFlagId && this.moduleList.length) {
								this.seledFlagId = this.moduleList[0].id
							}
							this.loadContent(this.seledFlagId);
						} else {
							uni.showToast({
								title: '模块信息加载失败',
								icon: 'none'
							});
						}
					});
			},
			initPeriod: function() {
				this.$http.get('contentPeriod/query', {
						userId: this.param.userId,
						moduleId: this.param.moduleId,
						language: this.param.language,
						type:'1',
						userId:this.param.userId
					})
					.then((res) => {
						if (res.data.code === 200) {
							let _list = res.data.data.contentPeriodList;
							this.moduleList = util.objectTransfer(_list, ['id', 'name'], ['id', 'label']);
							if (!this.seledFlagId) {
								this.seledFlagId = this.moduleList[0].id
							}
							this.loadContent(this.seledFlagId);
						} else {
							uni.showToast({
								title: '模块信息加载失败',
								icon: 'none'
							});
						}
					})
			},
			loadContent: function(flagId) {
				let reqParam = {
					userId: null,
					moduleId: null,
					page: null,
					rows: null,
					language: null,
					isFamily:null
				};
				util.loadObj(reqParam, this.param);
				let modId = parseInt(this.param.moduleId)
				if (module.requestParam.notFlag.indexOf(modId) == -1) {
					reqParam['flag'] = this.param.flag;
				}
				if (module.requestParam.notTypeId.indexOf(modId) == -1) {
					switch (this.param.flag) {
						case 'category':
							reqParam['categoryId'] = flagId;
							break;
						case 'period':
							reqParam['periodId'] = flagId;
							break;
						case 'place':
							reqParam['placeId'] = flagId;
							break;
					}
				}
				this.$http.get('content/query', reqParam).then(res => {
					if (res.data.code === 200) {
						this.contentList = res.data.data.contentList;
						for (var i = 0; i < this.contentList.length; i++) {
							if (this.contentList[i].tags) {
								this.contentList[i].tags = this.contentList[i].tags.split(',');
							} else {
								this.contentList[i].tags = [];
							}
							if (this.contentList[i].imageUrl) {
								this.contentList[i].imageUrl = this.$common.picPrefix() + this.contentList[i].imageUrl+this.suffixUrl;
							}
						}
					} else {
						uni.showToast({
							title: '获取内容列表失败',
							icon: 'none'
						});
					}
				});
			},
			search: function(e) {
				uni.showLoading({
					title: '搜索中'
				});
				let searchParam = this.param;
				searchParam['content'] = e.value;
				this.$http.get('content/queryLike', searchParam).then(res => {
					if (res.data.code === 200) {
						this.contentList = res.data.data.contentList;
						for (var i = 0; i < this.contentList.length; i++) {
							if (this.contentList[i].tags) {
								this.contentList[i].tags = this.contentList[i].tags.split(',');
							} else {
								this.contentList[i].tags = [];
							}
							if (this.contentList[i].imageUrl) {
								this.contentList[i].imageUrl = this.$common.picPrefix() + this.contentList[i].imageUrl;
							}
						}
						uni.hideLoading();
					} else {
						uni.showToast({
							title: '搜索失败',
							icon: 'none'
						});
					}
				});
			},
			tabSelect(idx) {
				this.tabActiveIdx = idx;
				this.seledFlagId = this.moduleList[idx].id;
				this.loadContent(this.seledFlagId);
			},
			add: function() {
				uni.navigateTo({
					url: 'edit' +
						util.jsonToQuery({
							userId: this.param.userId,
							moduleId: this.param.moduleId,
							flag: this.param.flag,
							name: this.param.name,
							language: this.param.language,
							isFamily: this.param.isFamily
						})
				});
			},
			editDesc: function() {
				uni.navigateTo({
					url: 'selfDesc' +
						util.jsonToQuery({
							userId: this.param.userId,
							moduleId: this.param.moduleId,
							language: this.param.language,
							name: this.param.name
						})
				});
			},
			deleteContent(contentId) {
				var self = this
				uni.showModal({
					title: '删除',
					content: '确认删除该记录？',
					confirmText: '确认',
					success: function(res) {
						if (res.confirm) {
							self.$http.post('content/delete', {
								language: self.param.language,
								contentId: contentId
							}).then(res => {
								if (res.data.code === 200) {
									self.loadSelfDesc();
									self.loadModule(self.param.moduleId);
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
	page{
		border-top: 1px solid #e5e5e5;
	}
	.category_container {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.category_hd {
		font-size: 32upx;
		color: #000;
		padding-bottom: 34upx;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-color: #ffffff;
	}

	.category_hd_active {
		color: #4dc578;
		border-color: #4dc578;
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
		z-index: 9999999;
		box-shadow: 2upx 0 18upx #25A754;
	}
	
</style>
