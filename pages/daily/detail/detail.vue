<template>
	<view>
		<view class="detail_container">
			<view class="detail_hd">
				<view>2018/10/12</view>
				<view>浙江杭州</view>
				<view>足球</view>
			</view>
			<view class="detail_content">
				<view>
					祖国颂，祖国母亲，沁园春.盛国疆泰（一）——献给祖国70华诞，亲爱的祖国
					，向您致敬，我的国，中国美，祖国，爱国，不是作秀
					热爱，就要爱祖国的一切，中国—风雨艰辛70年
					伟大的祖国，平凡的我
					国庆抒怀（组诗）
				</view>
				<image src="../../../static/images/test.png" class="detail_pic"></image>
				<image src="../../../static/images/test.png" class="detail_pic"></image>
				<image src="../../../static/images/test.png" class="detail_pic"></image>
			</view>
			<view class="detail_tag">同学</view>
			<view class="detail_tag">万绍波</view>
			<view class="detail_tag">添加类型</view>
		</view>
		<view class="detail_opt_container">
			<button class="detail_opt_btn active">上一页</button>
			<button class="detail_opt_btn">下一页</button>
		</view>
	</view>
	

</template>

<script>
	export default {
		data() {
			return {
			}
		},
		components: {
			
		},
		methods: {

		},
		onNavigationBarButtonTap(event) {
			const buttonIndex = event.index;
			if (buttonIndex === 0) {
				uni.navigateTo({
					url: '/pages/daily/edit/edit'
				});
			}
		},
	}
</script>

<style>
	.detail_container{
		padding-left: 22upx;
		padding-right: 22upx;
		padding-bottom: 120upx;
	}
	.detail_hd{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin-top: 26upx;
		font-size: 28upx;
		color: #999;
	}
	.detail_content{
		font-size: 32upx;
		color: #333;
		margin-top: 28upx;
	}
	.detail_pic{
		width:100%;
		margin-top: 20upx;
	}
	.detail_tag{
		font-size: 28upx;
		color: #56D282;
		margin-top: 40upx;
	}
	.detail_opt_container{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 98upx;
	}
	.detail_opt_btn{
		flex:1;
		font-size:34upx;
		color: #4DC578;
		background-color: #ffffff;
		border-radius: 0;
	}	
	.detail_opt_btn:after{
		border:0px;
	}
	.detail_opt_btn.active{
		background-color: #4DC578;
		color: #ffffff;
	}

</style>
