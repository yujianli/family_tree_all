<template>
	<view>
		<view class="types_wrapper">
			<view v-for="(module,index) in selectedModules">{{module.name}}</view>
		</view>
		<uni-search-bar :radius="200" class="search_info" />
		<view class="card_list">
			<view v-for="(contentInfo,i) in contentList" v-bind:key="contentInfo.id">
				<uni-swipe-action :options="options" @click="deleteContent(contentInfo.id)">
					<view class="card_item" @tap="jumpToDetail(contentInfo)">
						<image v-if="contentInfo.imageUrl!=null" :src="contentInfo.imageUrl" class="card_pic"></image>
						<view class="card_inner">
							<text class="card_title">{{contentInfo.content}}</text>
							<view class="card_others">
								<view class="tags">
									<text class="tags_text" v-for="(tag,i) in contentInfo.tags" v-bind:key="tag">
										{{tag}}
									</text>
								</view>
								<text class="time">{{contentInfo.createDate | formatDate}}</text>
							</view>
						</view>
					</view>
				</uni-swipe-action>
			</view>

			<!-- 	</uni-swipe-action> -->
		</view>
		<uni-drawer :visible="showDrawer" mode="right" @close="closeDrawer">
			<view>
				<view class="pd18">
					<view class="text">模块选择</view>
				</view>
				<view class="all_types_container">
					<view class="all_types_wrapper" v-for="(module,index) in modules">
						<view :class="{'active' : module.hasActive == true }" @tap="selectType(module,index)">{{module.name}}</view>
					</view>
				</view>
				<view class="pd18">
					<view class="text" style="margin-top: 62upx;">时间选择</view>
					<view class="text">起始时间：2013年9月6日</view>
					<view class="text">结束时间：2013年9月6日</view>
				</view>
				<view class="all_opt_btn_container">
					<button class="all_opt_btn" @tap="clearCondition">清空条件</button>
					<button class="all_opt_btn active" @tap='confirmCondition'>确认</button>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar';
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	import uniDrawer from '@/components/uni-ui/uni-drawer/uni-drawer.vue'
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					language: null,
					isFamily: null
				},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width: '210upx'
					}
				}],
				showDrawer: false,
				selectedModules: [],
				modules: [{
					id: 1,
					name: '日记',
					hasActive: false
				}, {
					id: 2,
					name: '工资理财',
					hasActive: false
				}, {
					id: 3,
					name: '体貌特征',
					hasActive: false
				}, {
					id: 4,
					name: '爱好',
					hasActive: false
				}, {
					id: 5,
					name: '健康状况',
					hasActive: false
				}],
				contentList: []
			}
		},
		components: {
			uniSearchBar,
			uniSwipeAction,
			uniDrawer
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value)
			}
		},
		onLoad: function(options) {
			util.loadObj(this.param, options)
			this.loadIndexContent()
			this.loadAllModule()
		},
		methods: {
			jumpToDetail: function(content) {
				let p = {
					userId: this.param.userId,
					moduleId: content.moduleId,
					flag: content.flag,
					contentId: content.id,
					name: content.moduleName
				}
				let url = '/pages/hobby/detail' + util.jsonToQuery(p);
				uni.navigateTo({
					url: url
				});
			},
			loadIndexContent: function() {
				this.$http.get('content/userCards', {
					userId: this.param.userId,
					page: 1,
					rows: 10,
					language: this.param.language,
					isFamily: this.param.isFamily
				}).then((res) => {
					if (res.data.code === 200) {
						this.contentList = res.data.data.contentList;
						for (let i = 0; i < this.contentList.length; i++) {
							if (this.contentList[i].tags) {
								this.contentList[i].tags = this.contentList[i].tags.split(',')
							}
							if (this.contentList[i].imageUrl) {
								this.contentList[i].imageUrl = this.$common.picPrefix() + this.contentList[i].imageUrl
							}
						}
					} else {
						uni.showToast({
							title: '首页内容加载失败',
							icon: 'none'
						});
					}
				})
			},
			loadAllModule: function() {
				this.$http.get('module/all', {
					isFamily: this.param.isFamily,
					language: this.param.language
				}).then((res) => {
					if (res.data.code === 200) {
						this.modules = res.data.data.module;
						for (let i = 0; i < this.modules.length; i++) {
							this.modules[i]['hasActive'] = false
						}
					} else {
						uni.showToast({
							title: '模块信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			show: function() {
				this.showDrawer = true
			},
			closeDrawer: function() {
				this.showDrawer = false
			},
			selectType: function(module, index) {
				//this.selectedModules.push(module);
				if (module.hasActive) {
					this.$forceUpdate();
					this.$set(module, 'hasActive', false);

				} else {
					this.$forceUpdate();
					this.$set(module, 'hasActive', true);
				}
				console.log(this.modules);
				// console.log(index);
			},
			clearCondition: function() {
				this.selectedModules = [];
				this.activeModuleIndex = null;
				this.modules.forEach(module => module.hasActive = false)
				this.closeDrawer();
			},
			confirmCondition: function() {
				let activeArr = this.modules.filter((module) => {
					return module.hasActive == true
				});
				this.selectedModules = activeArr;
				this.closeDrawer();
			},
			deleteContent(contentId) {
				var self = this
				uni.showModal({
					title: '删除',
					content: '确认删除该记录？',
					confirmText: '确认',
					success: function(res) {
						if (res.confirm) {
							self.$http
								.post('content/delete', {
									language: self.param.language,
									contentId: contentId
								})
								.then(res => {
									if (res.data.code === 200) {
										self.loadIndexContent();
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
			},
		},
		onNavigationBarButtonTap(event) {
			const buttonIndex = event.index;
			if (buttonIndex === 0) {
				this.showDrawer = !this.showDrawer;

			}
		},
		onBackPress() {
			if (this.showDrawer) {
				this.closeDrawer();
				return true;
			}
		},

	}
</script>

<style lang="less" scoped>
	@import '../../common/card.less';

	.pd18 {
		padding: 18upx;
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
		color: #4DC578;
		border-color: #4DC578;
	}

	.search_info {
		margin-top: 40upx;
		margin-bottom: 40upx;
		height: 68upx;
	}

	.types_wrapper {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		padding-left: 40upx;
		padding-right: 40upx;
		padding-top: 36upx;

		view {
			border: 1px solid #FF9797;
			border-radius: 8upx;
			font-size: 32upx;
			color: #FF9797;
			height: 56upx;
			line-height: 56upx;
			min-width: 136upx;
			text-align: center;
			margin-right: 14upx;
			margin-bottom: 18upx;
			padding-left: 2upx;
			padding-right: 2upx;
		}
	}

	.all_types_container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;

		.all_types_wrapper {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;

			view {
				border: 1px solid #999;
				border-radius: 8upx;
				font-size: 28upx;
				color: #333;
				height: 56upx;
				line-height: 56upx;
				min-width: 130upx;
				text-align: center;
				margin-left: 12upx;
				margin-bottom: 10upx;
				padding-left: 2upx;
				padding-right: 2upx;

				&.active {
					color: #4DC578;
					border-color: #4DC578;
				}
			}
		}

	}

	.text {
		font-size: 31upx;
		color: #666;
		margin-bottom: 18upx;
	}

	.all_opt_btn_container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 85upx;

		.all_opt_btn {
			flex: 1;
			font-size: 31upx;
			color: #4DC578;
			background-color: #f9f9f9;
			border-radius: 0;

			&:after {
				border: 0px;
			}

			&.active {
				background-color: #4DC578;
				color: #ffffff;
			}

		}
	}
</style>
