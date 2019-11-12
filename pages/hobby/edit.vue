<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">时间：</text>
			<picker class="input" mode="date" :value="contentInfo.createDate" :start="startDate" :end="endDate" @change="bindDateChange"
			 :fields="'day'">
				<view>{{contentInfo.createDate | formatDate2}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">地点：</text>
			<input class="input" type="text" placeholder-style="color:#999" v-model="contentInfo.position" placeholder="地点" />
		</view>
		<view class="wrapper" v-if="ctrlEnable.typeCtrl">
			<text class="inner_title">类型：</text>
			<picker @change="typeBindPickerChange" :value="idx" :range="typeList" range-key="name">
				<view class="input">{{ typeList[idx].name }}</view>
			</picker>
		</view>
		<view class="wrapper" v-if="ctrlEnable.stageCtrl">
			<text class="inner_title">{{stageCtrlName}}：</text>
			<picker @change="stageBindPickerChange" :value="stageIdx" :range="stages" range-key="name">
				<view class="input" v-if="['31','32'].indexOf(param.moduleId)>=0">{{ stageList[stageIdx].name }}</view>
				<view class="input" v-else>{{stages[stageIdx].startTime| formatDate}}-{{stages[stageIdx].endTime| formatDate}} {{ stageList[stageIdx].name }}</view>
			</picker>
		</view>
		<view class="wrapper" v-if="ctrlEnable.placeCtrl">
			<text class="inner_title">居室：</text>
			<picker @change="placeBindPickerChange" :value="placeIdx" :range="placeList" range-key="address">
				<view class="input">{{ placeList[placeIdx].address }}</view>
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
<!-- 		<hUpload :uploadUrl="uploadConfig.serverUrl" :header="uploadConfig.header"
		@schange="schange" @upload="setAttachData"></hUpload> -->
		<view>
			<view class="tags_wrapper">
				<image src="../../static/images/icon_tag.png" class="icon_tags"></image>
				<view class="mul_tags" :style="{display: tagList.length > 0 ? 'inline-block': 'none'}">{{tagList | formatWords}}</view>
				<input type="text" v-model="tag" placeholder-style="color:#EE9C36" class="input smallipt" @blur="setTags" placeholder="添加标签" />
			</view>
		</view>
		<view v-if="ctrlEnable.relationCtrl">
			<view class="tags_wrapper">
				<image src="../../static/images/icon_relation.png" class="icon_tags"></image>
				<view class="mul_tags" :style="{display: relationList.length > 0 ? 'inline-block': 'none'}">{{relationList | formatWords}}</view>
				<input type="text" v-model="relation" placeholder-style="color:#EE9C36" class="input smallipt" @blur="setRelation" placeholder="添加关联" />
			</view>
		</view>	
		<view class="opt_container" v-if="removeEnable">
			<button class="btn_delete" @tap="remove">删除记录</button>
		</view>
		
	</view>
</template>

<script>
	//组件文档参考地址 https://github.com/smalltee/robby-image-upload
	import robbyImageUpload  from '@/components/robby-image-upload';
	import hUpload from '@/components/h-upload.vue'
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	import util from '@/common/util.js'
	import config from '@/common/componetConfig.js'
	import module from '@/common/moduleLink.js'
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
					weatherCtrl: false,
					stageCtrl: false,
					placeCtrl: false,
					relationCtrl: true,
				},
				idx:0,
				typeList:[{id:-1,name:'请选择'}],
				stageIdx:0,
				stageList:[{id:-1,name:'请选择'}],
				placeIdx:0,
				placeList:[{id:-1,address:'请选择'}],
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
					periodStartTime: null,
					periodEndTime:null,
					createDate: util.getDate()
				},
				startDate:util.getDate('start'),
				endDate:util.getDate('end'),
				removeEnable: false,
				uploadConfig:{
					serverUrl: this.$common.uploadUrl(),
					serverUrlDeleteImage: null,
					hearder: null,
					formData: null,
					imageData : [],
					fileKeyName: 'file',
					showUploadProgerss:false,
					limitNumber: 8,
				},
				tagList:[],
				relationList:[],
				imageList:[],
				
				relation:'',
				tag:'',
				
			}
		},
		computed:{
			createDate:function(){
				let dt= util.dateFormat(this.contentInfo.createDate)
				console.log(dt)
				return dt;
			},
			stageCtrlName:function(){
				let _name = module.viewCtrlName[this.param.moduleId]
				if(_name){
					return _name;
				}else{
					return '类型';
				}
			},
			stageCtrlValue:function(){
				return util.dateFormat(this.contentInfo.periodStartTime)+'-'
				+util.dateFormat(this.contentInfo.periodEndTime)+ ' '
			},
			stages:function(){
				let _list = this.stageList;
				if(this.param.moduleId==='32'){
					for(let i=1;i<_list.length;i++){
						_list[i].name=_list[i].name.replace(',','与').concat('的婚礼')
					}
				}
				return _list
			}
		},
		filters:{
			formatDate:function(value){
				if(!value) return ''
				return util.dateFormat(value, 'yyyy.MM.dd')
			},
			formatDate2:function(value){
				if(!value) return ''
				return util.dateFormat(value)
			},
			formatWords:function(value){
				if(!value) return []
				return value.join('  ');
			}
		},
		components:{robbyImageUpload,uniPopup,wPicker,hUpload},
		onLoad:function(options){
			uni.setNavigationBarTitle({
				title:options.name
			})
			util.loadObj(this.param,options)
			this.initControl(this.param.moduleId)
			if(this.param.contentId) {
				this.removeEnable=true
			}
			if(options.flag=='category'){
				this.loadCategory()
			}else if(options.flag=='period'){
				this.loadPeriod()
			}else if(options.flag=='place'){
				this.loadPlace()
			}else {
				if(this.param.contentId){
					this.loadContent()
				}
			}
			
			let token=uni.getStorageSync('USER').token;
			this.uploadConfig.header={'token':token};
		},
		onNavigationBarButtonTap(e) {
			this.save()
		},
		methods: {
			initControl:function(moduleId){
				let id=parseInt(moduleId)
				let editConfig=config.edit;
				this.ctrlEnable.typeCtrl=editConfig.typeCtrl.indexOf(id)>=0;
				this.ctrlEnable.stageCtrl=editConfig.stageCtrl.indexOf(id)>=0;
				this.ctrlEnable.placeCtrl=editConfig.placeCtrl.indexOf(id)>=0;
				this.ctrlEnable.weatherCtrl=editConfig.weatherCtrl.indexOf(id)>=0;
				this.ctrlEnable.relationCtrl=editConfig.relationCtrl.indexOf(id)>=0;
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
								this.idx = this.typeList.findIndex((item)=>item.id==id);
								break;
							case 'period':
								id=this.contentInfo.periodId;
								this.stageIdx = this.stageList.findIndex((item)=>item.id==id);
								break;
							case 'place':
								id=this.contentInfo.placeId;
								this.placeIdx = this.placeList.findIndex((item)=>item.id==id);
								break;
						}
						if(this.contentInfo.imageUrls){
							let imgs=this.contentInfo.imageUrls.split(',')
							for(let i=0;i<imgs.length;i++){
								this.uploadConfig.imageData.push(imgs[i])
							}
						}
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			loadCategory: function() {
				this.$http.get('category/query', {
						moduleId: this.param.moduleId,
						language: this.param.language
					}).then((res) => {
						if (res.data.code === 200) {
							this.typeList = this.typeList.concat(res.data.data.contentCategory);
							if(this.param.contentId){
								this.loadContent()
							}
						} else {
							uni.showToast({
								title: '类型信息加载失败',
								icon: 'none'
							});
						}
					})
			},
			loadPeriod: function() {
				this.$http.get('contentPeriod/query', {
						userId:this.param.userId,
						moduleId: this.param.moduleId,
						language: this.param.language
					}).then((res) => {
						if (res.data.code === 200) {
							this.stageList = this.stageList.concat(res.data.data.contentPeriodList);
							if(this.param.contentId){
								this.loadContent()
							}
						} else {
							uni.showToast({
								title: '阶段信息加载失败',
								icon: 'none'
							});
						}
					})
			},
			loadPlace: function() {
				this.$http.get('contentPlace/query', {
						userId:this.param.userId,
						moduleId: this.param.moduleId,
						language: this.param.language
					}).then((res) => {
						if (res.data.code === 200) {
							this.placeList = this.placeList.concat(res.data.data.contentPlaceList);
							if(this.param.contentId){
								this.loadContent()
							}
						} else {
							uni.showToast({
								title: '地点信息加载失败',
								icon: 'none'
							});
						}
					})
			},
			bindDateChange:function(e){
				this.contentInfo.createDate=e.target.value
			},
			typeBindPickerChange:function(e){
				let id = this.typeList[e.target.value].id
				this.contentInfo.categoryId=id;
				this.idx=e.target.value
			},
			stageBindPickerChange:function(e){
				let id = this.stageList[e.target.value].id
				this.contentInfo.periodId=id;
				this.stageIdx=e.target.value
			},
			placeBindPickerChange:function(e){
				let id = this.placeList[e.target.value].id
				this.contentInfo.placeId=id;
				this.placeIdx=e.target.value
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
				if(this.uploadConfig.imageData.length){
					postParam['imageUrls']=this.uploadConfig.imageData.join(',')
				}
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
			deleteImage: function(e){
				console.log(e)
			},
			addImage: function(e){
				console.log(e)
			},
			schange:function(e){
				console.log(e)
			},
			upload:function(e){
				console.log(e)
			},
			setTags:function(e){
				let tagList = this.tagList;
				if(e.detail.value){
					tagList.push(e.detail.value);
					this.tag = '';
				}
			},
			setRelation:function(e){
				let relationList = this.relationList;
				if(e.detail.value){
					relationList.push(e.detail.value);
					this.relation = '';
				}
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
		&.smallipt{
			padding:6upx 10upx;font-size: 12upx;flex:none;width:100upx;color: #EE9C36;
		}
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
	.mul_tags{
		margin-right: 29upx;
		color: #56D282;
	}
	.edit_other_opts{
		font-size: 25upx;color: #EE9C36;
	}
	.tags_wrapper{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 24upx;
		font-size: 25upx;
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
