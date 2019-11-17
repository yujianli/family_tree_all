<template>
	<view class="card_list">
		<view class="more" @tap="toMore">更多</view>
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
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	export default {
		name: 'index-content-list',
		props: {
			userId: Number,
			language: String,
			isFamily: Number
		},
		data() {
			return {
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
		components: {
			uniSwipeAction
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value)
			}
		},
		mounted() {
			this.loadIndexContent()
		},
		methods: {
			jumpToDetail: function(content) {
				let p = {
					userId: this.userId,
					moduleId: content.moduleId,
					flag: content.flag,
					contentId: content.id,
					name: content.moduleName
				};
				let url = '/pages/hobby/detail' + util.jsonToQuery(p);
				uni.navigateTo({
					url: url
				});
			},
			loadIndexContent: function() {
				this.$http.get('content/userCards', {
					userId: this.userId,
					page: 1,
					rows: 10,
					language: this.language,
					isFamily: this.isFamily
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
			toMore: function() {
				uni.navigateTo({
					url: '/pages/all/all' + util.jsonToQuery({
						userId: this.userId,
						language: this.language,
						isFamily: this.isFamily
					})
				})
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
									language: self.language,
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
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../common/card.less';
</style>
