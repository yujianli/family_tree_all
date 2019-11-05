<template>
	<view class="container">
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="selfDesc" placeholder="内容" />
			</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param:{
					userId:null,
					moduleId:null,
					language:null
				},
				descId:null,
				selfDesc: ''
			}
		},
		onLoad:function(options){
			uni.setNavigationBarTitle({
				title: options.name
			})
			util.loadObj(this.param,options)
			this.loadData()
		},
		onNavigationBarButtonTap(e) {
			this.save()
		},
		methods:{
			loadData:function(){
				this.$http.get('selfDesc/detailSelfDesc',this.param).then((res)=>{
					if(res.data.code===200){
						let _data=res.data.data.selfDescriptionInfo;
						if(_data){
							this.selfDesc=_data.selfDesc
							this.descId=_data.id
						}
					}else{
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			save:function(){
				let postParam =null;
				let url = null;
				if(this.descId){
					url='selfDesc/editSelfDesc'
					postParam={selfDescriptionId:this.descId,selfDesc:this.selfDesc}
				}else{
					url='selfDesc/createSelfDesc'
					postParam={userId:this.param.userId,moduleType:this.param.moduleId,selfDesc:this.selfDesc}
				}
				postParam['language']=this.param.language
				this.$http.post(url,postParam).then((res)=>{
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
	.container{
		padding-left:30upx;
		padding-right:30upx;
		padding-bottom: 120upx;
	}
	.mul_wrapper{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-top: 20upx;
	}
</style>
