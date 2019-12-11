<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">{{i18n.date}}：</text>
			<picker class="input" mode="date" :value="contentInfo.time" :start="startDate" :end="endDate" @change="bindDateChange"
			 :fields="'day'" style="flex:1;">
				<view class="picker_inner">
					<view>{{contentInfo.time}}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.address}}：</text>
			<input class="input" type="text" placeholder-style="color:#999" v-model="contentInfo.position" placeholder="地点" />
		</view>
		<!-- 是否设为我的格言 -->
		<view class="wrapper" v-if="param.moduleId==='19'">
			<text class="inner_title">是否设为我的格言：</text>
			<view class="my_motto_wrap">
				<view :class="{'active':contentInfo.isMyMotto==1}" @tap="selSetting(1)">是</view>
				<view :class="{'active':contentInfo.isMyMotto==0}" @tap="selSetting(0)">否</view>
			</view>
		</view>
		<!-- 节日纪事 -->
		<view class="wrapper" v-if="param.moduleId==='30'">
			<text class="inner_title">{{i18n.festival}}：</text>
			<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="fesIdx" :range="festivalList" style="flex:1;">
				<view class="picker_inner">
					<view class="uni-input">{{festivalList[0][fesIdx[0]]}}，{{festivalList[1][fesIdx[1]]}}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<!-- 爱好二级分类 -->
		<view class="wrapper" v-if="param.moduleId==='7'">
			<text class="inner_title">{{i18n.type}}：</text>
			<view class="picker_inner" @tap="open" style="flex: 1;">
				<view class="input">{{categoryName}}</view>
				<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
			</view>
			<w-picker mode="linkage" @confirm="selVal" ref="linkage" themeColor="#f00" :linkList="linkList"></w-picker>
		</view>
		<view class="wrapper" v-if="ctrlEnable.typeCtrl">
			<text class="inner_title">{{i18n.type}}：</text>
			<picker @change="typeBindPickerChange" :value="idx" :range="typeList" range-key="name" style="flex:1;">
				<view class="picker_inner">
					<view class="input">{{ typeList[idx].name }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper" v-if="ctrlEnable.stageCtrl">
			<text class="inner_title">{{stageCtrlName}}：</text>
			<picker @change="stageBindPickerChange" :value="stageIdx" :range="stages" range-key="name" style="flex:1;">
				<view class="picker_inner">
					<view class="input" v-if="['27','31','32'].indexOf(param.moduleId)>=0">{{ stageList[stageIdx].name }}</view>
					<view class="input" v-else>{{stages[stageIdx].startTime| formatDate}}-{{stages[stageIdx].endTime| formatDate}} {{ stageList[stageIdx].name }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper" v-if="ctrlEnable.placeCtrl">
			<text class="inner_title">{{i18n.room}}：</text>
			<picker @change="placeBindPickerChange" :value="placeIdx" :range="placeList" range-key="address" style="flex:1;">
				<view class="picker_inner">
					<view class="input">{{ placeList[placeIdx].address }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper" v-if="ctrlEnable.weatherCtrl">
			<text class="inner_title">{{i18n.weather}}：</text>
			<picker @change="weatherBindPickerChange" :value="weatherIdx" :range="weatherList" style="flex:1;">
				<view class="picker_inner">
					<view class="input">{{ weatherList[weatherIdx] }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="contentInfo.content" placeholder="内容" />
			</view>
		<!-- 绑定图片数据，监听添加、删除事件，设置是否拖拉，是否可删除，是否可选择添加，图片数量限制-->		
		<robby-image-upload v-model="uploadConfig.imageData" 
		@delete="deleteImage" @add="addImage" 
		:server-url-delete-image="uploadConfig.serverUrlDeleteImage" 
		:server-url="uploadConfig.serverUrl" 
		:header="uploadConfig.header"
		:is-edit="uploadConfig.isEdit">
		</robby-image-upload>
<!-- 		<hUpload :uploadUrl="uploadConfig.serverUrl" :header="uploadConfig.header"
		@schange="schange" @upload="setAttachData"></hUpload> -->
		<view>
			<view class="tags_wrapper">
				<image src="../../static/images/icon_tag.png" class="icon_tags"></image>
				<!-- #ifdef H5 -->
				<view class="tags_text" :style="{display: tagList.length > 0 ? 'inline-block': 'none'}" v-for="(tag,index) in tagList">{{tag}}</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="tags_text" v-for="(tag,index) in tagList">{{tag}}</view>
				<!-- #endif -->
				<input type="text" v-model="tag" placeholder-style="color:#EE9C36" style="width: 120upx;" class="input smallipt" @blur="setTags" :placeholder="btnText.editTag" />
			</view>
		</view>
		<view v-if="ctrlEnable.relationCtrl">
			<view class="tags_wrapper">
				<image src="../../static/images/icon_relation.png" class="icon_tags"></image>
				<!-- #ifdef H5 -->
				<view class="tags_text" :style="{display: relationList.length > 0 ? 'inline-block': 'none'}" v-for="(relation,index) in relationList">{{relation}}</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="tags_text" v-for="(relation,index) in relationList">{{relation}}</view>
				<!-- #endif -->
				<input type="text" v-model="relation" placeholder-style="color:#EE9C36" class="input smallipt" @blur="setRelation" :placeholder="associateTag" />
			</view>
		</view>	
		<view class="opt_container" v-if="removeEnable">
			<button class="btn_delete" @tap="remove">{{btnText.remove}}</button>
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
	import dataJson from '@/static/appData.json';
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					contentId: null,
					flag: null,
					name: null,
					language: null,
					isFamily: null
				},
				ctrlEnable:{
					typeCtrl: true,
					weatherCtrl: false,
					stageCtrl: false,
					placeCtrl: false,
					relationCtrl: true,
				},
				idx:0,
				typeList:[{id:-1,name:this.$t('defaultText').ctrl}],
				stageIdx:0,
				stageList:[{id:-1,name:this.$t('defaultText').ctrl}],
				placeIdx:0,
				placeList:[{id:-1,address:this.$t('defaultText').ctrl}],
				fesIdx:[0,0],
				weatherList:this.$t('selData').weather,
				weatherIdx:0,
				festivalStr:'',
				typeEnable: false,
				contentInfo:{
					periodId: null,
					year: null,
					festival: null,
					placeId: null,
					videoUrls: null,
					userId: null,
					categoryName: '',
					content: '',
					tags: '',
					associatedPerson: null,
					imageUrls: null,
					weather: '',
					id: null,
					position: '',
					moduleId: null,
					isMyMotto: 1,
					categoryId: null,
					periodStartTime: null,
					periodEndTime:null,
					time: util.getDate()
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
					isEdit: false
				},
				linkList:[],
				defaultText:this.$t('defaultText').ctrl,
				defaultVal:[this.$t('defaultText').ctrl,''],
				val:['0','0'],
				selectedType:null,
				tagList:[],
				relationList:[],
				imageList:[],
				relation:'',
				tag:'',
				suffixUrl:'&style=image/resize,m_fill,w_100'
			}
		},
		computed:{
			i18n() {
				return this.$t('common')
			},
			btnText() {
				return this.$t('btnText')
			},
			festivalList:function(){
				let arr=[this.$t('defaultText').ctrl];
				let dt=new Date();
				let curYear=dt.getFullYear();
				for(let i=curYear-10,j=curYear+10;i<=j;i++){
					arr.push(i.toString())
				}
				let fesArr=this.$t('selData').festival
				let arrs=[]
				arrs[0]=arr
				arrs[1]=fesArr
				return arrs;
			},
			createDate:function(){
				return util.dateFormat(this.contentInfo.createDate)
			},
			stageCtrlName:function(){
				let _name = module.viewCtrlName[this.param.moduleId]
				if(_name){
					return _name;
				}else{
					return this.i18n.type;
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
			},
			categoryName:function(){
				if(!this.contentInfo.categoryName) return this.$t('defaultText').ctrl
				return this.contentInfo.categoryName
			},
			associateTag:function(){
				return '+'+this.btnText.associateTag
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
				if(!value || value.length<=0) return []
				let str= value.join('  ');
				console.log(str)
				return str
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
			if(this.param.contentId){
				this.uploadConfig.isEdit=true
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
						let _data = res.data.data.contentInfo
						util.loadObj(this.contentInfo,_data)
						this.contentInfo.time=util.dateFormat(this.contentInfo.time)
						if(this.contentInfo.tags){
							this.tagList=this.contentInfo.tags.split(',')
						}
						if(this.contentInfo.associatedPerson){
							this.relationList=this.contentInfo.associatedPerson.split(',')
						}
						if(this.param.moduleId==='30' && this.contentInfo.weather){
							let arrs=this.contentInfo.weather.split('-');
							let idx1 = this.festivalList[0].findIndex(item=>item===arrs[0])
							let idx2 = this.festivalList[1].findIndex(item=>item===arrs[1])
							this.fesIdx[0]=idx1
							this.fesIdx[1]=idx2
						}
						if(_data.weather){
							let idx=this.weatherList.findIndex(item=>item===_data.weather)
							this.weatherIdx=idx
						}
						this.selSetting(_data.isMyMotto)
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
				if(this.param.moduleId==='7'){
					this.loadFirstType()
				}else{
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
					}
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
			loadFirstType:function(){
				this.$http.get('category/query', {
						moduleId: this.param.moduleId,
						language: this.param.language
					}).then((res) => {
						if (res.data.code === 200) {
							let _list = res.data.data.contentCategory
							for(let i=0;i<_list.length;i++){
								_list[i].label=_list[i].name
								_list[i].value=_list[i].id
							}
							this.loadSecondType(_list[0].id, _list, 0)
							
						} else {
							uni.showToast({
								title: '类型信息加载失败',
								icon: 'none'
							});
						}
					})
			},
			loadSecondType: function(parentId, list, idx){
				let array=[]
				if(idx>=list.length) {
					this.linkList=this.linkList.concat(list)
					if(this.param.contentId){
						this.loadContent()
					}
				}else{
				this.$http.get('category/query', {
						parentId: parentId,
						language: this.param.language
					}).then((res) => {
						if (res.data.code === 200) {
							let data= res.data.data.contentCategory
							for(let i=0;i<data.length;i++){
								array.push({label:data[i].name,value:data[i].id})
							}
							list[idx].children=array
							idx++
							let _id=null
							if(idx<list.length){
								_id=list[idx].id
							}
							this.loadSecondType(_id, list, idx)
						}
					})
				}
			},
			selSetting:function(active){
				this.contentInfo.isMyMotto=active
			},
			open:function(){
				this.$refs.linkage.show()
			},
			bindMultiPickerColumnChange:function(e){
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.fesIdx[e.detail.column]=e.detail.value
				this.$forceUpdate()
			},
			selVal:function(e){
				console.log(e)
				this.contentInfo.categoryName=e.checkArr[1];
				this.contentInfo.categoryId=e.checkValue[1]
			},
			bindDateChange:function(e){
				this.contentInfo.time=e.target.value
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
			weatherBindPickerChange:function(e){
				let id = this.weatherList[e.target.value]
				this.contentInfo.weather=id;
				this.weatherIdx=e.target.value
			},
			save:function(){
				let postParam={
					content:null,categoryId:null,periodId:null,placeId:null,
					tags:null,position:null,language:null,imageUrls:null,
					videoUrls:null,duration:null,associatedPerson:null,weather:null,
					isFamily:null
				}
				util.loadObj(postParam,this.contentInfo)
				postParam.tags=this.tagList.join(',')
				postParam.associatedPerson=this.relationList.join(',')
				postParam.isFamily=this.param.isFamily
				postParam.language=this.param.language
				//节日纪事 节日存储字段到天气字段里
				if(this.param.moduleId==='30'){
					if(this.fesIdx[0]!==0 && this.fesIdx[1]!==0){
						let year=this.festivalList[0][this.fesIdx[0]];
						let name=this.festivalList[1][this.fesIdx[1]];
						postParam.weather=year+'-'+name
					}
				}
				if(this.param.moduleId==='19'){
					postParam.isMyMotto=this.contentInfo.isMyMotto
				}
				if(this.uploadConfig.imageData.length){
					postParam['imageUrls']=this.uploadConfig.imageData.join(',')
				}
				postParam.time=this.contentInfo.time
				let url = null;
				if(this.contentInfo.id){
					url='content/edit';
					postParam.contentId=this.contentInfo.id
				}else{
					url='content/create';
					postParam.userId=this.param.userId
					postParam.moduleId=this.param.moduleId
					postParam.flag=this.param.flag
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
						if (res.confirm) {
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
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
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
				if(e.detail.value){
					this.tagList.push(e.detail.value);
					this.tag = '';
				}
			},
			setRelation:function(e){
				if(e.detail.value){
					this.relationList.push(e.detail.value);
					this.relation = '';
				}
			}
		}
	}
</script>

<style lang="less" scoped>
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
		border-bottom-color: #F0F4F7;
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
			text-align: left;
			padding:6upx 30upx;font-size: 30upx;flex:none;width:150upx;color: #EE9C36;
			border-radius: 20upx;
			background: #F8F8F8;
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
		z-index: 999;
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
		font-size: 30upx;
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
	.tags_text{
		font-size: 30upx;
		color: #56D282;
		background:#F8F8F8;
		border-radius: 20upx;
		padding:8upx 20upx;
		vertical-align: middle;
		margin-right: 14upx;
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
	
	.picker_inner{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
		
	.picker_arrow{
		height: 20upx;
		width: 24upx;
	}
	
		
	.my_motto_wrap{
		display: flex;flex-direction: row;
		view{
			width: 98upx;
			height: 40upx;
			line-height: 40upx;
			text-align: center;
			font-size: 30upx;
			background: #fff;
			color: #4DC578;
			border:1px solid #4DC578;
			&.active{
				background: #4DC578;
				color: #fff;
				border:1px solid #4DC578;
				border-right-width: 0;
			}
		}
	}
</style>
