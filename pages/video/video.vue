<template>
	<view class="">
		<view class="status_bar"></view>
		<view class="video_tabs">
			<view class="item active">
				全部
			</view>
			<view class="item">
				基本信息
			</view>
			<view class="item">
				主要大事
			</view>
		</view>
		<view class="media_list" v-for="(media,index1) in mediaList">
			<view class="date" style="">{{media.date}}</view>
			<view class="container">
				<view v-for="(item,index2) in media.list" class="item">
					<!-- <video
					src="https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4"
					                    @error="videoErrorCallback" 
										show-play-btn={false}
										show-center-play-btn={false}
										controls></video> -->
					<image :src="item.url" ></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mediaList: [{
					id: 1,
					date: '2月8日',
					list: [{
						url: '../../static/images/icon_func_1.png'
					}, {
						url: '../../static/images/icon_func_2.png'
					}]
				},{
					id: 2,
					date: '2月9日',
					list: [{
						url: '../../static/images/icon_func_3.png'
					}, {
						url: '../../static/images/icon_func_4.png'
					}, {
						url: '../../static/images/icon_func_5.png'
					}, {
						url: '../../static/images/icon_func_6.png'
					}]
				}]
			}
		},
		methods: {
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			}
		}
	}
</script>

<style lang="less">
		
	
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.video_tabs {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 96upx;

		.item {
			color: #000;
			font-size: 31upx;
			padding-bottom: 30upx;
			border-bottom-color: #fff;
			border-bottom-width: 1px;
			border-bottom-style: solid;

			&.active {
				color: #4DC578;
				border-bottom-color: #4DC578;
			}
		}
	}
	.media_list{
		.date{
			margin-top: 38upx;margin-bottom: 17upx;color: #333;
			font-size: 31upx;padding-left: 24upx;
		}
		.container{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
			.item{
				display: flex;
				flex-direction: column;
				width: 25%;
				justify-content: center;
				align-items: center;	
			}
			image,video{
				width:160upx;height: 160upx;
			}
			
		}
	}
</style>
