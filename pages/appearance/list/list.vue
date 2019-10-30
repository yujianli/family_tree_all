<!-- 体貌特征 -->
<template>
	<view>
		<view v-for="appearance in appearanceData" v-bind:key="appearance.id">
<!-- 			<uni-swipe-action :options="options">
 -->				<view class="container" @tap="jumpToDetail">
					<view class="title">{{appearance.title}}</view>
					<view class="row">
						<view>身高：{{appearance.height}}cm</view>
						<view>T恤尺寸：{{appearance.size1}}</view>
					</view>
					<view class="row">
						<view>体重：{{appearance.weight}}kg</view>
						<view>衬衫尺寸：{{appearance.size2}}M</view>
					</view>
					<view class="row">
						<view>脸型：{{appearance.face}}</view>
						<view>衣服尺寸：{{appearance.size3}}</view>
					</view>
					<view class="row">
						<view>个性特点：{{appearance.feature}}</view>
						<view>裤子尺寸：{{appearance.size4}}</view>
					</view>
					<view class="row">
						<view>鞋尺寸：{{appearance.shoe}}码</view>
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
				appearanceData:[
					{
						id:1,
						title:'20岁',
						height:'170',
						size1:'1M',
						weight:'175',
						size2:'1L',
						face:'1圆脸',
						size3:'1S',
						feature:'1随和',
						size4:'1XL',
						time:'12018/10/12',
						shoe:40
					},
					{
						id:2,
						title:'238岁',
						height:'2170',
						size1:'2M',
						weight:'275',
						size2:'2L',
						face:'2圆脸',
						size3:'2S',
						feature:'2随和',
						size4:'2XL',
						time:'22018/10/12',
						shoe:42
					},
					{	
						id:3,
						title:'318岁',
						height:'4170',
						size1:'4M',
						weight:'475',
						size2:'4L',
						face:'4圆脸',
						size3:'4S',
						feature:'4随和',
						size4:'4XL',
						time:'42018/10/12',
						shoe:36
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
			this.loadData(options.userId,options.moduleId);
		},
		methods: {
			jumpToDetail:function(){
				uni.navigateTo({
				    url: '/pages/appearance/detail/detail'
				});
			},
			loadData:function(userId,moduleId){
				this.$api.getByToken('appearance/query',{
					userId:userId,
					moduleId:moduleId,
					language:this.$common.language,
					page:1,
					rows:10
				}).then((res)=>{
					if(res.data.code===200){
						this.appearanceData=res.data.appearanceList;
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
