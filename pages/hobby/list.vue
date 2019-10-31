<template>
	<view>
		<view class="category_container">
			<view class="category_hd category_hd_active">
				足球
			</view>
			<view class="category_hd">
				旅行
			</view>
			<view class="category_hd">
				咖啡
			</view>
		</view>
		<uni-search-bar :radius="100" class="search_info" />
		<view class="card_list">
			<uni-swipe-action :options="options">
				<view class="card_item" @tap="jumpToDetail">
					<image src="../../../static/images/test.png" class="card_pic"></image>
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
			</uni-swipe-action>

			<uni-swipe-action :options="options">
				<view class="card_item" @tap="jumpToDetail">
					<image src="../../../static/images/test.png" class="card_pic"></image>
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
			</uni-swipe-action>
			
			<uni-swipe-action :options="options">
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
			</uni-swipe-action>
		</view>
		
	</view>

</template>

<script>
	import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar';
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width:'105px'
					}
				}]
			}
		},
		components: {
			uniSearchBar,
			uniSwipeAction
		},
		methods: {
			jumpToDetail:function(){
				uni.navigateTo({
				    url: '/pages/hobby/detail'
				});
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
