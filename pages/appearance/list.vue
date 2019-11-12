<!-- 体貌特征 -->
<template>
	<view>
		<view class="float_btn" @tap="add">+</view>
		<view v-for="appearance in appearanceList" v-bind:key="appearance.id">
			<uni-swipe-action :options="options">
				<view class="container" @tap="jumpToDetail(appearance.id)">
					<view>{{appearance.age}}岁</view>
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
			</uni-swipe-action>
		</view>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	import dataJson from '@/static/appData.json';
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param:{
					userId: null,
					moduleId: null,
					language:null
				},
				appearanceList:[],
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
			uniSwipeAction
		},
		onLoad:function(options){
			util.loadObj(this.param,options)
			
		},
		onShow:function(){
			this.loadData();
		},
		methods: {
			jumpToDetail:function(id){
				uni.navigateTo({
				    url: '/pages/appearance/detail'+util.jsonToQuery({
						userId:this.param.userId,
						moduleId:this.param.moduleId,
						language:this.param.language,
						id:id
					})
				});
			},
			loadData:function(){
				this.$http.get('appearance/query',{
					userId:this.param.userId,
					moduleId:this.param.moduleId,
					language:this.param.language,
					page:1,
					rows:10
				}).then((res)=>{
					if(res.data.code===200){
						let _list =res.data.data.appearanceList;
						for(var i=0;i<_list.length;i++){
							_list[i].faceShape= this.bindProp('faceShape',_list[i].faceShape);
							_list[i].tshirtSize= this.bindProp('size',_list[i].tshirtSize);
							_list[i].shirtSize= this.bindProp('size',_list[i].shirtSize);
							_list[i].clothSize= this.bindProp('size',_list[i].clothSize);
							_list[i].trousersSize= this.bindProp('size',_list[i].trousersSize);
							_list[i].shoeSize= this.bindProp('size',_list[i].shoeSize);
						}
						this.appearanceList=_list
					}else{
						uni.showToast({
							title: '用户模块信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			bindProp: function(key, val) {
				for (var i = 0; i < dataJson[key].length; i++) {
					if (dataJson[key][i].key === val) {
						return dataJson[key][i].value;
					}
				}
			},
			add:function(){
				uni.navigateTo({
					url:'edit'+ util.jsonToQuery(this.param)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
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
	.float_btn {
		width: 109upx;
		height: 109upx;
		background-color: #4dc578;
		border-radius: 50%;
		position: fixed;
		right: 41upx;
		bottom: 100upx;
		font-size: 70upx;
		line-height: 1.5;
		text-align: center;
		color: #fff;
		z-index: 999999;
	}
</style>

