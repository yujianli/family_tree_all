<template>
	<view>
		<view class="types_wrapper">
			<view>日记</view>
			<view>工资理财</view>
			<view>工资理财</view>
			<view>工资理财</view>
			<view>工资理财</view>
			<view>工资理财</view>
			<view>工资理财基金投资</view>
		</view>
		<uni-search-bar :radius="200" class="search_info" />
		<view class="card_list">
			<!-- <uni-swipe-action :options="options"> -->
				<view class="card_item" @tap="jumpToDetail">
					<image src="../../static/images/test.png" class="card_pic"></image>
					<view class="card_inner">
						<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
						<view class="card_others">
							<view class="tags">
								<text class="tags_text">旅行</text>
								<text class="tags_text">游记</text>
							</view>
							<text class="time">2018/10/12</text>
						</view>
					</view>
				</view>
			<!-- </uni-swipe-action> -->

			<!-- <uni-swipe-action :options="options"> -->
				<view class="card_item" @tap="jumpToDetail">
					<image src="../../static/images/test.png" class="card_pic"></image>
					<view class="card_inner">
						<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
						<view class="card_others">
							<view class="tags">
								<text class="tags_text">旅行</text>
							</view>
							<text class="time">2018/10/12</text>
						</view>
					</view>
				</view>
		<!-- 	</uni-swipe-action> -->

			<!-- <uni-swipe-action :options="options"> -->
				<view class="card_item" @tap="jumpToDetail">
					<view class="card_inner">
						<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
						<view class="card_others">
							<view class="tags">
								<text class="tags_text">旅行</text>
								<text class="tags_text">旅行</text>
								<text class="tags_text">旅行</text>
								<text class="tags_text">旅行</text>
								<text class="tags_text">旅行</text>
							</view>
							<text class="time">2018/10/12</text>
						</view>
					</view>
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
						<view class="active">{{module.name}}</view>
					</view>
				</view>
				<view class="pd18">
					<view class="text" style="margin-top: 62upx;">时间选择</view>
					<view class="text">起始时间：2013年9月6日</view>
					<view class="text">结束时间：2013年9月6日</view>
				</view>
				<view class="all_opt_btn_container">
					<button class="all_opt_btn">清空条件</button>
					<button class="all_opt_btn active">确认</button>
				</view>
			</view>
				
				
				
			
		</uni-drawer>
	</view>

</template>

<script>
	import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar';
	//import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	import uniDrawer from '@/components/uni-ui/uni-drawer/uni-drawer.vue'
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
				showDrawer: false,
				modules: [{
					name: '日记'
				}, {
					name: '工资理财'
				}, {
					name: '体貌特征'
				}, {
					name: '爱好'
				}, {
					name: '健康状况'
				}, {
					name: '生活习惯'
				},{
					name:'文摘'
				},{
					name:'喜好'
				},{
					name:'同事朋友'
				},{
					name:'获奖成就'
				},{
					name:'艺术创作'
				},{
					name:'通讯记录'
				},{
					name:'婚礼'
				},{
					name:'车辆'
				},{
					name:'照片视频'
				},{
					name:'自媒体关注'
				},{
					name:'节日纪事'
				},{
					name:'收藏品'
				},{
					name:'校园经历'
				},{
					name:'恋爱经历'
				},{
					name:'工作经历'
				},{
					name:'住宅居室'
				},{
					name:'工资理财'
				}]
			}
		},
		components: {
			uniSearchBar,
			// uniSwipeAction,
			uniDrawer
		},
		methods: {
			jumpToDetail: function() {
				uni.navigateTo({
					url: '/pages/hobby/detail/detail'
				});
			},
			show() {
				this.showDrawer = true
			},
			hide() {
				this.showDrawer = false
			},
			closeDrawer() {
				this.showDrawer = false
			},
		},
		onNavigationBarButtonTap(event) {
			const buttonIndex = event.index;
			if (buttonIndex === 0) {
				this.showDrawer = !this.showDrawer
			}
		},
		onBackPress() {
			if (this.showDrawer) {
				this.hide()
				return true
			}
		}
	}
</script>

<style lang="less">
	@import '../../common/card.css';
	.pd18{
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
	.all_types_container{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		.all_types_wrapper{
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
				&.active{
					color: #4DC578;
					border-color: #4DC578;
				}
			}
		}
		
	}
	.text{
		font-size: 31upx;color: #666;
		margin-bottom: 18upx;
	}
	.all_opt_btn_container{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 85upx;
		.all_opt_btn{
			flex:1;
			font-size:31upx;
			color: #4DC578;
			background-color: #f9f9f9;
			border-radius: 0;
			&:after{
				border:0px;
			}
			&.active{
				background-color: #4DC578;
				color: #ffffff;
			}
			
		}	
	}
	
	
</style>
