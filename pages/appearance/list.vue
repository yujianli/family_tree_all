<!-- 体貌特征 -->
<template>
	<view>
		<view v-for="appearance in appearanceList" v-bind:key="appearance.id">
<!-- 			<uni-swipe-action :options="options">
 -->				<view class="container" @tap="jumpToDetail(appearance.appearanceId)">
					<view class="title">{{appearance.title}}</view>
					<view class="row">
						<view>身高：{{appearance.height}}cm</view>
						<view>T恤尺寸：{{appearance.tshirtSize}}</view>
					</view>
					<view class="row">
						<view>体重：{{appearance.weight}}kg</view>
						<view>衬衫尺寸：{{appearance.shirtSize}}M</view>
					</view>
					<view class="row">
						<view>脸型：{{appearance.faceShape}}</view>
						<view>衣服尺寸：{{appearance.clothSize}}</view>
					</view>
					<view class="row">
						<view>个性特点：{{appearance.characteristics}}</view>
						<view>裤子尺寸：{{appearance.trousersSize}}</view>
					</view>
					<view class="row">
						<view>鞋尺寸：{{appearance.shoeSize}}码</view>
						<view></view>
					</view>
				</view>
			<!-- </uni-swipe-action> -->
		</view>
	</view>
</template>

<script>
	// import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	
	export default {
		data() {
			return {
				userId: null,
				moduleId: null,
				appearanceList:[
					{
						id:1,
						title:'20岁',
						height:'170',
						shirtSize:'1M',
						weight:'175',
						tshirtSize:'1L',
						faceShape:'1圆脸',
						clothSize:'1S',
						characteristics:'1随和',
						trousersSize:'1XL',
						time:'12018/10/12',
						shoeSize:40
					}
				],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width:'105px'
					}
				}]
			}
			
		},
		components:{
			// uniSwipeAction
		},
		onLoad:function(options){
			this.userId=options.userId;
			this.moduleId=options.moduleId;
			this.loadData(options.userId,options.moduleId);
		},
		onNavigationBarButtonTap(e) {
			// console.log(e);
			uni.navigateTo({
				url:'edit?userId=' + this.userId + '&moduleId='+this.moduleId
			})
		},
		methods: {
			jumpToDetail:function(){
				uni.navigateTo({
				    url: '/pages/appearance/detail'
				});
			},
			loadData:function(userId,moduleId){
				this.$http.get('appearance/query',{
					userId:userId,
					moduleId:moduleId,
					language:this.$common.language,
					page:1,
					rows:10
				}).then((res)=>{
					if(res.data.code===200){
						this.appearanceList=res.data.appearanceList;
					}else{
						uni.showToast({
							title: '用户模块信息加载失败',
							icon: 'none'
						});
					}
				})
			}
		}
	}
</script>

<style>
	.container{
		padding: 48upx;
	}
	.row{
		margin-top: 40upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		color: #333;
	}
	.title{
		font-size: 36upx;color: #333;font-weight: 600;
	}
</style>
