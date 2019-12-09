<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">{{i18n.inheritMan}}：</text>
			<input class="input" type="text" placeholder-style="color:#999" v-model="inheritInfo.inheritUserIds" :placeholder="i18n.inheritMan" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.inheritPhone}}：</text>
			<input class="input" type="text" placeholder-style="color:#999" v-model="inheritInfo.mobile" :placeholder="i18n.inheritPhone" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.inheritEmail}}：</text>
			<input class="input" type="text" placeholder-style="color:#999" v-model="inheritInfo.email" :placeholder="i18n.inheritEmail" />
		</view>
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="inheritInfo.content" :placeholder="i18n.inheritContent" />
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
					language:null
				},
				id:null,
				inheritInfo:{
					inheritUserIds: '',
					mobile:'',
					email:'',
					content: ''
				}
			}
		},
		computed:{
			i18n() {
				return this.$t('common')
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
				this.$http.post('inherit/detilInherit',this.param).then((res)=>{
					if(res.data.code===200){
						let _data =res.data.data.inheritInfo
						if(_data){
							util.loadObj(this.inheritInfo,_data)
							this.id=_data.id
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
				let postParam = {content:null,email:null,mobile:null, inheritUserIds:null,language:null}
				util.loadObj(postParam,this.inheritInfo)
				postParam['language']=this.param.language
				let url=null;
				if(this.id){
					url='inherit/editInherit'
					postParam['inheritId']=this.id
				}else{
					url='inherit/createInherit'
					postParam['userId']=this.param.userId
				}
				this.$http.post(url,postParam).then((res)=>{
					if(res.data.code===200){
						this.loadData()
						uni.showToast({
							title:'保存成功',icon:'none'
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
	}
	.inner_title{
		font-size: 33upx;
		color: #333;
		margin-right: 40upx;
	}
	.input {
		font-size: 34upx;
		color: #303641;
		flex: 1;
		text-align: left;
	}
	.mul_input{
		height: 492upx;
		font-size: 34upx;
		color: #303641;
		flex: 1;
		border:1px solid #E5E5E5;
		border-radius: 8upx;
		padding: 18upx;
	}
</style>
