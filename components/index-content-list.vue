<template>
	<view class="card_list" v-if="contentList.length">
		<view class="more" @tap="toMore">更多</view>
		<view v-for="(contentInfo, i) in contentList" v-bind:key="contentInfo.id">
			<!-- 			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @click="deleteContent(contentInfo.id)"> -->
			<view class="card_item" @tap="jumpToDetail(contentInfo)">
				<image v-if="contentInfo.imageUrl != null" :src="contentInfo.imageUrl" class="card_pic"></image>
				<view class="card_inner">
					<text class="card_title">{{ contentInfo.content }}</text>
					<view class="card_others">
						<view class="tags">
							<text class="tags_text" v-for="(tag, i) in contentInfo.tags" v-bind:key="tag">{{ tag }}</text>
						</view>
						<text class="time">{{ contentInfo.createDate | formatDate }}</text>
					</view>
				</view>
			</view>
			<!-- 				</uni-swipe-action-item>
			</uni-swipe-action> -->
		</view>
		<view @tap="loadMore"><uni-load-more :status="status" style="height: 100upx;"></uni-load-more></view>
	</view>
	<view v-else style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
		<image src="../../static/images/null_data.png" style="width: 464upx;height: 417upx;"></image>
		<view style="font-size: 36upx;color: #999;">暂无数据</view>
	</view>
</template>

<script>
import util from '@/common/util.js';
import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
import uniSwipeActionItem from '@/components/uni-ui/uni-swipe-action-item/uni-swipe-action-item';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
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
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width: '105px'
					}
				}
			],
			page: 1,
			suffixUrl: '&style=image/resize,m_fill,w_123,h_92',
			status: 'more'
		};
	},
	components: {
		uniSwipeAction,
		uniSwipeActionItem,
		uniLoadMore
	},
	filters: {
		formatDate: function(value) {
			if (!value) return '';
			return util.dateFormat(value);
		}
	},
	mounted() {
		// this.loadIndexContent();
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
		loadIndexContent: function(isMore) {
			this.$http
				.get('content/userCards', {
					userId: this.userId,
					page: this.page,
					rows: 5,
					language: this.language,
					isFamily: this.isFamily
				})
				.then(res => {
					if (res.data.code === 200) {
						let contents = res.data.data.contentList;
						for (let i = 0; i < contents.length; i++) {
							if (contents[i].tags) {
								contents[i].tags = contents[i].tags.split(',');
							}
							if (contents[i].imageUrl) {
								contents[i].imageUrl = this.$common.picPrefix() + contents[i].imageUrl + this.suffixUrl;
							}
						}
						
						if (isMore) {
							setTimeout(() => {
								this.contentList = this.contentList.concat(contents);
								this.status = contents.length == 0 ? 'noMore' : 'more';
							}, 1000);
						} else {
							this.contentList = contents;
							this.status = contents.length == 5 ? 'more' : 'noMore';
						}
					} else {
						uni.showToast({
							title: '首页内容加载失败',
							icon: 'none'
						});
					}
				});
		},
		loadMore: function() {
			this.status = 'loading';
			this.page++;
			this.loadIndexContent(true);
		},
		toMore: function() {
			uni.navigateTo({
				url:
					'/pages/all/all' +
					util.jsonToQuery({
						userId: this.userId,
						language: this.language,
						isFamily: this.isFamily
					})
			});
		},
		deleteContent(contentId) {
			var self = this;
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
};
</script>

<style lang="less" scoped>
@import '../common/card.css';

.slide_list {
	transition: all 100ms;
	transition-timing-function: ease-out;
	min-width: 200%;
	height: 160upx;
}

.now-message-info {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	/* justify-content: space-between; */
	font-size: 16px;
	clear: both;
	height: 160upx;
	padding: 0 30upx;
	margin-bottom: 20upx;
	background: #ffffff;
}

.now-message-info,
.group-btn {
	float: left;
}

.group-btn {
	display: flex;
	flex-direction: row;
	height: 160upx;
	min-width: 100upx;
	align-items: center;
}

.group-btn .btn-div {
	height: 160upx;
	color: #fff;
	text-align: center;
	padding: 0 50upx;
	font-size: 34upx;
	line-height: 160upx;
}

.group-btn .top {
	background-color: #c4c7cd;
}

.group-btn .removeM {
	background-color: #ff3b32;
}
</style>
