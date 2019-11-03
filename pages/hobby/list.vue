<template>
	<view>
		<view class="category_container">
			<view v-for="(module,i) in moduleList" v-bind:key="module.id" @tap="selModule(module.id)">
				<!-- 	<view class="category_hd category_hd_active">
				足球
			</view> -->
				<view class="category_hd">{{module.name}}</view>
			</view>
		</view>
		<uni-search-bar :radius="100" class="search_info" @confirm="search" />
		<!-- <contentList :cParam="cParam"></contentList> -->
		<view class="card_list">

			<view class="card_item" @tap="jumpToDetail" v-for="(content,i) in contentList" v-bind:key="content.id">
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
	// import contentList from '@/components/content-list';
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				cParam: {
					userId: null,
					moduleId: null,
					page: 0,
					rows: 10,
					flag: 'category',
					flagId: 41,
					language: this.$common.language
				},
				moduleList: [],
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
			// contentList
		},
		onLoad: function(options) {
			this.cParam = options;
			this.loadModule(options.moduleId)
		},
		methods: {
			jumpToDetail: function() {
				uni.navigateTo({
					url: '/pages/hobby/detail'
				});
			},
			loadModule: function(moduleId) {
				this.$http.get('category/query', {
						moduleId: moduleId,
						language: this.$common.language
					})
					.then((res) => {
						if (res.data.code === 200) {
							this.moduleList = res.data.data.contentCategory;
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
				this.cParam['categoryId'] = flagId
				this.$http.get('content/query', this.cParam).then((res) => {
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
			search:function(e){
				uni.showLoading({
				    title: '搜索中'
				});
				let searchParam = this.cParam
				searchParam['content']=e.value
				this.$http.get('content/queryLike',searchParam).then((res)=>{
					if(res.data.code===200){
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
					}else{
						uni.showToast({
							title: '搜索失败',icon:'none'
						});
					}
				})
			},
			selModule: function(id) {
				this.loadContent(id)
			}
		}
	}
</script>

<style>
	@import '../../common/card.css';

	.category_container {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.category_hd {
		font-size: 16px;
		color: #000;
		padding-bottom: 17px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-color: #ffffff;
	}

	.category_hd_active {
		color: #4DC578;
		border-color: #4DC578;
	}

	.search_info {
		margin-top: 20px;
		margin-bottom: 20px;
		height: 34px;
	}
</style>
