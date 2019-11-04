<template>
	<view>
		<view class="float_btn" @tap="jumpToDetail">+</view>
		<view class="card_list">
			<view class="card_item" v-for="(schedule ,index) in scheduleList" :key="index" @tap="jumpToDetail">
				<image :style="{display: schedule.pic == '' ? 'none' : 'block'}" :src="schedule.pic" class="card_pic"></image>
				<view class="card_inner">
					<view class="card_title">{{schedule.content}}</view>
					<view class="time mt20">{{schedule.timeRange}}</view>
					<view class="card_others card_others_1">
						<view class="inner_flex">
							<text class="time">小学简介</text>
							<image src="../../../static/images/icon_arrow_right.png" class="arrow"></image>
						</view>
					</view>
				</view>
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
	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width: '210upx'
					}
				}],
				scheduleList:[{
					id: 1,
					content: '初中',
					timeRange:'2011.11-2014.12',
					pic: '../../../static/images/icon_func_1.png',
				},{
					id: 2,
					content: '高中',
					timeRange:'2015.11-2017.12',
					pic: '../../../static/images/icon_func_1.png',
				},{
					id: 3,
					content: '小学',
					timeRange:'2019.11-2019.12',
					pic: '../../../static/images/icon_func_1.png',
				}]
			}
		},
		components: {
			uniSearchBar
		},
		onLoad: function(options) {
			let user = uni.getStorageSync("USER");
			this.loadData(options.moduleId,user.id);
		},
		methods: {
			jumpToDetail:function(){
				uni.navigateTo({
					url:'/pages/schedule/edit/edit'
				})
			},
			loadData: function(moduleId,userId) {
				this.$http.get('contentPeriod/query', {
					    userId: userId,
						moduleId: moduleId,
						language: this.$common.language
					})
					.then((res) => {
						if (res.data.code === 200) {
							console.log(res.data);
						} else {
							uni.showToast({
								title: '阶段信息加载失败',
								icon: 'none'
							});
						}
					})
			},
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../common/card.less';

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
