<template>
	<view class="container">
<!-- 		<view class="wrapper">
			<text class="inner_title">家族名字：</text>
			<input class="input" type="text" placeholder-style="color:#999" v-model="family.name" placeholder="家族名字" />
		</view> -->
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="family.instruction" placeholder="家训内容" />
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param:{
					familyId:null,
					language:null
				},
				family:{
					// name: '',
					instruction: ''
				}
			}
		},
		onLoad:function(options){
			util.loadObj(this.param,options)
			this.loadData()
		},
		onNavigationBarButtonTap(e) {
			this.save()
		},
		methods:{
			loadData:function(){
				this.$http.get('family/detail',this.param).then((res)=>{
					if(res.data.code===200){
						let _data =res.data.data.family
						util.loadObj(this.family,_data)
					}else{
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			save:function(){
				this.family['familyId']=this.param.familyId
				this.family['language']=this.param.language
				this.$http.post('family/edit',this.family).then((res)=>{
					if(res.data.code===200){
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({
							title:'保存失败',icon:'none'
						})
					}
				})
			}
		}
	}
</script>

<style>
	page{
		background: #fafafa;
		border-top: 1px solid #e5e5e5;
	}
	.container{
		padding-left:30upx;
		padding-right:30upx;
		padding-bottom: 120upx;
	}
	.wrapper{
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #E5E5E5;
	}
	.mul_wrapper{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-top: 20upx;
		background-color: #fff;
		box-shadow: 2upx 0 18upx #E5E5E5;border-radius: 15upx;
		
	}
	.mul_input{
		font-size: 34upx;
		color: #303641;
		flex: 1;
		padding: 12upx;
	}
</style>
