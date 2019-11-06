<template>
	<view>
		<view class="float_btn" @tap="add">+</view>
		<view style="position:relative" v-if="ctrlEnable.tabCtrl">
			<myTab :tabList="moduleList" @tabSelect="tabSelect" :tabActiveIdx="tabActiveIdx" />
		</view>
		<view class="container_pd" v-if="ctrlEnable.selfDescCtrl">
			<view class="self_intro_container">
				<text>{{param.name}}自述</text>
				<image src="../../static/images/edit.png" @tap="editDesc"></image>
			</view>
			<view class="intro_detail">
				{{selfDesc}}
			</view>
		</view>
		<uni-search-bar :radius="100" class="search_info" @confirm="search" />
		<!-- <contentList :param="param"></contentList> -->
		<view class="card_list">

			<view class="card_item" @tap="jumpToDetail(content.contentId)" v-for="(content,i) in contentList" v-bind:key="content.id">
				<uni-swipe-action :options="options">
					<image v-if="content.imageUrl != null" :src="content.imageUrl" class="card_pic"></image>
					<view class="card_inner">
						<text class="card_title">{{content.content}}</text>
						<view class="card_others">
							<view class="tags">
								<text class="tags_text" v-for="(tag,i) in content.tags" v-bind:key="tag">{{tag}}</text>
							</view>
							<text class="time">{{content.createDate}}</text>
						</view>
					</view>
				</uni-swipe-action>
			</view>

		</view>

	</view>

</template>

<script>
	import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar';
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	import myTab from '@/components/xyz-tab';
	// import contentList from '@/components/content-list';
	import util from '@/common/util.js'
	import config from '@/common/componetConfig.js'
	import module from '@/common/moduleLink.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					page: 1,
					rows: 10,
					flag: null,
					flagId: 41,
					name: '',
					language: this.$common.language
				},
				ctrlEnable: {
					tabCtrl: true,
					selfDescCtrl: false
				},
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
				}]
			}
		},
		computed: {

		},
		components: {
			uniSearchBar,
			uniSwipeAction,
			myTab
		},
		onLoad: function(options) {
			let title = null;
			if(module.isStage.indexOf(options.moduleId)>=0){
				title=options.stageName
			}else{
				title=options.name
			}
			uni.setNavigationBarTitle({
				title: title
			})
			util.loadObj(this.param, options)
			this.initControl(this.param.moduleId)
		},
		onShow: function() {
			this.loadSelfDesc()
			this.loadModule(this.param.moduleId)
		},
		methods: {
			initControl: function(moduleId) {
				let id = parseInt(moduleId)
				let listConfig = config.list;
				this.ctrlEnable.tabCtrl = listConfig.tabCtrl.indexOf(id) >= 0;
				this.ctrlEnable.selfDescCtrl = listConfig.selfDescCtrl.indexOf(id) >= 0;
			},
			jumpToDetail: function(id) {
				let p = {
					userId: this.param.userId,
					moduleId: this.param.moduleId,
					flag: this.param.flag,
					contentId: id,
					name: this.param.name
				}
				let url = '/pages/hobby/detail' + util.jsonToQuery(p);
				uni.navigateTo({
					url: url
				});
			},
			loadSelfDesc: function() {
				this.$http.get('selfDesc/detailSelfDesc', {
					userId: this.param.userId,
					moduleId: this.param.moduleId,
					language: this.param.language
				}).then((res) => {
					if (res.data.code === 200) {
						let _data = res.data.data.selfDescriptionInfo;
						if (_data) {
							this.selfDesc = _data.selfDesc
						}
					} else {
						uni.showToast({
							title: '自述信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			loadModule: function(moduleId) {
				this.$http.get('category/query', {
						moduleId: moduleId,
						language: this.$common.language
					})
					.then((res) => {
						if (res.data.code === 200) {
							let _list = res.data.data.contentCategory;
							this.moduleList = util.objectTransfer(_list, ['id', 'name'], ['id', 'label']);
							this.loadContent(this.moduleList[0].id);
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
					language: null
				}
				util.loadObj(reqParam, this.param)
				if (module.requestParam.notFlag.indexOf(this.param.moduleId) == -1) {
					reqParam['flag'] = this.param.flag
				}
				if (module.requestParam.notTypeId.indexOf(this.param.moduleId) == -1) {
					switch (this.param.flag) {
						case 'category':
							reqParam['categoryId'] = flagId
							break;
						case 'period':
							reqParam['periodId'] = flagId
							break;
						case 'place':
							reqParam['placeId'] = flagId
							break;
					}
				}
				this.$http.get('content/query', reqParam).then((res) => {
					if (res.data.code === 200) {
						this.contentList = res.data.data.contentList;
						for (var i = 0; i < this.contentList.length; i++) {
							if (this.contentList[i].tags) {
								this.contentList[i].tags = this.contentList[i].tags.split(',');
							} else {
								this.contentList[i].tags = [];
							}
							if (this.contentList[i].createDate) {
								this.contentList[i].createDate = util.dateFormat(this.contentList[i].createDate)
							}
						}
					} else {
						uni.showToast({
							title: '获取内容列表失败',
							icon: 'none'
						});
					}
				})
			},
			search: function(e) {
				uni.showLoading({
					title: '搜索中'
				});
				let searchParam = this.param
				searchParam['content'] = e.value
				this.$http.get('content/queryLike', searchParam).then((res) => {
					if (res.data.code === 200) {
						this.contentList = res.data.data.contentList;
						for (var i = 0; i < this.contentList.length; i++) {
							if (this.contentList[i].tags) {
								this.contentList[i].tags = this.contentList[i].tags.split(',');
							} else {
								this.contentList[i].tags = [];
							}
							if (this.contentList[i].createDate) {
								this.contentList[i].createDate = util.dateFormat(this.contentList[i].createDate)
							}
						}
						uni.hideLoading()
					} else {
						uni.showToast({
							title: '搜索失败',
							icon: 'none'
						});
					}
				})
			},
			tabSelect(idx) {
				this.tabActiveIdx = idx;
				this.loadContent(this.moduleList[idx].id)
			},
			add: function() {
				uni.navigateTo({
					url: 'edit' + util.jsonToQuery({
						userId: this.param.userId,
						moduleId: this.param.moduleId,
						flag: this.param.flag,
						name: this.param.name,
						language: this.param.language
					})
				})
			},
			editDesc: function() {
				uni.navigateTo({
					url:'selfDesc'+util.jsonToQuery({
						userId:this.param.userId,
						moduleId:this.param.moduleId,
						language:this.param.language,
						name:this.param.name
					})
				})
			}
		}
	}
</script>


<style lang='less' scoped>
	@import '../../common/card.less';

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

	.float_btn {
		width: 109upx;
		height: 109upx;
		background-color: #4DC578;
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
