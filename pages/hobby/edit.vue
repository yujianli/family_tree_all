<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">时间：</text>
			<picker class="input" mode="date" :value="createDate" :start="startDate" :end="endDate" @change="bindDateChange"
			 :fields="'day'">
				<view>{{createDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">地点：</text>
			<input class="input" type="text" placeholder-style="color:#999" v-model="contentInfo.position" placeholder="地点" />
		</view>
		<view class="wrapper" v-if="ctrlEnable.typeCtrl">
			<text class="inner_title">类型：</text>
			<picker @change="typeBindPickerChange" :value="idx" :range="typeList" range-key="name">
				<view class="uni-input">{{ typeList[idx].name }}</view>
			</picker>
		</view>
		<view class="wrapper" v-if="ctrlEnable.weatherCtrl">
			<text class="inner_title">天气：</text>
			<input class="input" type="text" placeholder-style="color:#999" v-model="contentInfo.weather" placeholder="天气" />
		</view>
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="contentInfo.content" placeholder="内容" />
			</view>
		<!-- 绑定图片数据，监听添加、删除事件，设置是否拖拉，是否可删除，是否可选择添加，图片数量限制-->		
		<robby-image-upload v-model="uploadConfig.imageData" 
		@delete="deleteImage" @add="addImage" 
		:server-url-delete-image="uploadConfig.serverUrlDeleteImage" 
		:server-url="uploadConfig.serverUrl" 
		:header="uploadConfig.header">
		</robby-image-upload>
		<view>
			<view class="tags_wrapper">
				<image src="../../../static/images/icon_tag.png" class="icon_tags"></image>
				<text class="edit_other_opts">添加标签</text>
			</view>
			
			<robby-tags class="edit_other_opts"
				v-model="tagList" 
				:enable-del="tagEnableDel" 
				:enable-add="tagEnableAdd">
			</robby-tags>
		</view>
		<view>
			<view class="tags_wrapper">
				<image src="../../../static/images/icon_tag.png" class="icon_tags"></image>
				<text class="edit_other_opts">添加关联</text>
			</view>
			
			<robby-tags class="edit_other_opts"
				v-model="relationList" 
				:enable-del="relationEnableDel" 
				:enable-add="relationEnableAdd">
			</robby-tags>
		</view>	

		<view class="opt_container" v-if="removeEnable">
			<button class="btn_delete" @tap="remove">删除记录</button>
		</view>
		
	</view>
</template>

<script>
	//组件文档参考地址 https://github.com/smalltee/robby-image-upload
	import robbyImageUpload  from '@/components/robby-image-upload';
	import robbyTags from '@/components/robby-tags';
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	import util from '@/common/util.js'
	import config from '@/common/componetConfig.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					contentId: null,
					flag: null,
					name: null,
					language: null
				},
				ctrlEnable:{
					typeCtrl: true,
					weatherCtrl: false
				},
				idx:0,
				typeList:[{id:-1,name:'请选择'}],
				typeEnable: false,
				contentInfo:{
					periodId: null,
					year: null,
					festival: null,
					placeId: null,
					videoUrls: null,
					userId: null,
					categoryName: null,
					content: '',
					tags: '',
					associatedPerson: null,
					imageUrls: null,
					weather: '',
					id: null,
					position: '',
					moduleId: null,
					is_my_motto: null,
					categoryId: null,
					createDate: util.getDate()
				},
				startDate:util.getDate('start'),
				endDate:util.getDate('end'),
				removeEnable: false,
				uploadConfig:{
					serverUrl: 'http://47.99.133.113:8989/api/upload',
					serverUrlDeleteImage: null,
					hearder: null,
					formData: null,
					imageData : [],
					showUploadProgerss:false,
					limitNumber: 8,
				},
				tagList:[],
				tagEnableDel: true,
				tagEnableAdd: true,
				relationEnableDel: true,
				relationEnableAdd: true,
				relationList:[],
				typeVal:''
				
			}
		},
		computed:{
			createDate:function(){
				return util.dateFormat(this.contentInfo.createDate)
			}
		},
		components:{robbyImageUpload,robbyTags,uniPopup,wPicker},
		onLoad:function(options){
			uni.setNavigationBarTitle({
				title:options.name
			})
			util.loadObj(this.param,options)
			this.initControl(this.param.moduleId)
			if(this.param.contentId) {
				this.removeEnable=true
			}
			this.loadModule(options.moduleId)
			let token=uni.getStorageSync('USER').token;
			//let token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2MSJ9.l9gwfxqVh8dYqiMODN8-M4iq8RpscvYm9l-oqy0zjxQ'
			this.uploadConfig.header={'token':token,'Content-Type':'multipart/form-data'}
		},
		onNavigationBarButtonTap(e) {
			this.save()
		},
		methods: {
			initControl:function(moduleId){
				let id=parseInt(moduleId)
				let editConfig=config.edit;
				this.ctrlEnable.typeCtrl=editConfig.typeCtrl.indexOf(id)>=0;
				this.ctrlEnable.weatherCtrl=editConfig.weatherCtrl.indexOf(id)>=0;
			},
			loadContent:function(){
				this.$http.get('content/detail', this.param).then((res)=>{
					if (res.data.code === 200) {
						this.contentInfo = res.data.data.contentInfo
						if(this.contentInfo.tags){
							this.tagList=this.contentInfo.tags.split(',')
						}
						if(this.contentInfo.associatedPerson){
							this.relationList=this.contentInfo.associatedPerson.split(',')
						}
						let id=null;
						switch(this.param.flag){
							case 'category':
								id=this.contentInfo.categoryId
								break;
							case 'period':
								id=this.contentInfo.periodId;
								break;
							case 'place':
								id=this.contentInfo.placeId;
								break;
						}
						this.idx = this.typeList.findIndex((item)=>item.id==id);
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			loadModule: function(moduleId) {
				this.$http.get('category/query', {
						moduleId: moduleId,
						language: this.$common.language
					}).then((res) => {
						if (res.data.code === 200) {
							this.typeList = this.typeList.concat(res.data.data.contentCategory);
							if(this.param.contentId){
								this.loadContent()
							}
						} else {
							uni.showToast({
								title: '模块信息加载失败',
								icon: 'none'
							});
						}
					})
			},
			bindDateChange:function(e){
				this.contentInfo.createDate=e.target.value
			},
			typeBindPickerChange:function(e){
				console.log(e.target.value)
				let id = this.typeList[e.target.value].id
				switch(this.param.flag){
					case 'category':
						this.contentInfo.categoryId=id;
						break;
					case 'period':
						this.contentInfo.periodId=id;
						break;
					case 'place':
						this.contentInfo.placeId=id;
						break;
				}
				this.idx=e.target.value
			},
			save:function(){
				let postParam={
					content:null,categoryId:null,periodId:null,placeId:null,
					tags:null,position:null,language:null,imageUrls:null,
					videoUrls:null,duration:null,associatedPerson:null,weather:null
				}
				util.loadObj(postParam,this.contentInfo)
				postParam.tags=this.tagList.join(',')
				postParam.associatedPerson=this.relationList.join(',')
				postParam.language=this.param.language
				let url = null;
				if(this.contentInfo.id){
					url='content/edit';
					postParam.contentId=this.contentInfo.id
				}else{
					url='content/create';
					postParam.userId=this.param.userId
					postParam.moduleId=this.param.moduleId
					postParam.flag=this.param.flag
					postParam.time=this.contentInfo.createDate
				}
				util.nullFilter(postParam)
				this.$http.post(url,postParam).then((res)=>{
					if(res.data.code===200){
						// this.backToList()
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({
							title: '保存失败',icon:'none'
						});
					}
				})
			},
			remove:function(){
				uni.showModal({
					title: '删除',
					content: '确认删除该记录？',
					confirmText: '确认',
					success: res => {
						this.$http.post('content/delete', {
							contentId:this.param.contentId,
							language: this.param.language,
						}).then((res)=>{
							if(res.data.code===200){
								// this.backToList()
								uni.navigateBack({
									delta:2
								})
							}else{
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
							}
						})
					},
				})
			},
			backToList:function(){
				let url = 'list' + util.jsonToQuery({
					userId:this.param.userId,
					moduleId:this.param.moduleId,
					name:this.param.name,
					flag:this.param.flag
				})
				uni.navigateTo({url:url})
			},
			deleteImage: function(e){
				console.log(e)
			},
			addImage: function(e){
				console.log(e)
			},
			onConfirm(val){
				console.log(val);
				this.typeVal=val.result;
			}
		}
	}
</script>

<style lang="less" scoped>
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
		font-size: 34upx;
		color: #333;
		margin-right: 40upx;
	}
	.input{
		font-size: 34upx;
		color: #303641;
		flex:1;
		text-align:left;
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
	.opt_container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: -8upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 114upx;
	
	}
	
	.btn_delete {
		flex: 1;
		font-size: 38upx;
		color: #ffffff;
		background-color: #FB4F4F;
		border-radius: 0;
	}
	
	.btn_delete:after {
		border: 0px;
	}
	
	.edit_other_opts{
		font-size: 32upx;color: #EE9C36;
	}
	.tags_wrapper{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 24upx;
	}
	.icon_tags{
		width: 38upx;height: 38upx;margin-right: 21upx;
	}
	.select_tag{
		font-size: 30upx;color: #999;margin-right: 29upx;
	}
	.relation_wrapper {
		padding: 34upx;
		background-color: #fff;
		padding-bottom: 40upx;
		.relation_hd {
			color: #333;
			padding-bottom: 30upx;
			border-bottom-width: 1px;
			border-bottom-color: #E5E5E5;
			border-bottom-style: solid;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		
			.f18 {
				font-size: 36upx;
			}
			.f15 {
				font-size: 30upx;
			}
			.ok{
				color: #56D282;
			}
		}
		.relation_item {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 80upx;
			line-height: 1.5;
				
			.name{
				margin-left: 21upx;
				font-size: 33upx;
				color: #333;
			}
		}
	}
</style>
