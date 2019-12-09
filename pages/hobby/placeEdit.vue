<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">{{i18n.buyDate}}</text>
			<picker mode="date" :start="startDate" :end="endDate" @change="bindSDateChange" :fields="'day'" :value="startTime">
				<view class="picker_inner">
					<view class="input">{{startTime}}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.sellDate}}</text>
			<picker mode="date" :start="startDate" :end="endDate" @change="bindEDateChange" :fields="'day'" :value="endTime">
				<view class="picker_inner">
					<view class="input">{{endTime}}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.address}}</text>
			<input class="input" type="text" placeholder-style="color:#999" :placeholder="i18n.address" v-model="placeInfo.address" />
		</view>
		
		<robby-image-upload v-model="uploadConfig.imageData"
		@delete="deleteImage" @add="addImage" 
		:server-url-delete-image="uploadConfig.serverUrlDeleteImage" 
		:server-url="uploadConfig.serverUrl" 
		:header="uploadConfig.header">
		</robby-image-upload>
		<view  style="margin-top: 40upx;">
			<text class="inner_title">{{i18n.desc}}</text>
		</view>
		
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="placeInfo.description" :placeholder="i18n.content" />
		</view>
		<view class="opt_container" v-if="removeEnable">
			<button class="btn_delete" @tap="remove">{{btnText.remove}}</button>
		</view>
	</view>

</template>

<script>
	import util from '@/common/util.js'
	import module from '@/common/moduleLink.js'
	import robbyImageUpload  from '@/components/robby-image-upload';
	export default {
		data() {
			 const currentDate = util.getDate({
				format: true
			})
			return {
				param: {
					userId: null,
					moduleId: null,
					language: null
				},
				placeInfo:{
					begintime:null,
					endtime:null,
					description:'',
					address:'',
					id:null,
					imageUrl:null
				},
				uploadConfig:{
					serverUrl: this.$common.uploadUrl(),
					serverUrlDeleteImage: null,
					hearder: null,
					formData: null,
					imageData : [],
					fileKeyName: 'file',
					showUploadProgerss:false,
					limitNumber: 1,
				}
			}
		},
		computed: {
			i18n() {
				return this.$t('common')
			},
			startDate() {
				return util.getDate('start');
			},
			endDate() {
				return util.getDate('end');
			},
			startTime(){
				if(!this.placeInfo.begintime) return this.$t('defaultText').ctrl;
				return this.placeInfo.begintime
			},
			endTime(){
				if(!this.placeInfo.endtime) return this.$t('defaultText').ctrl;
				return this.placeInfo.endtime
			},
		},
		components:{robbyImageUpload},
		onLoad: function (options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
			util.loadObj(this.param,options)
			if(options.id){
				this.loadData(options.id)
			}
			let token=uni.getStorageSync('USER').token;
			this.uploadConfig.header={'token':token};
		},
		onNavigationBarButtonTap(e) {
			this.save()
		},
		methods: {
			loadData:function(id){
				this.$http.get('contentPlace/detailPlace',{
					contentPlaceId:id,
					language:this.param.language
				}).then((res)=>{
					if(res.data.code===200){
						let _data=res.data.data.contentPlaceInfo
						util.loadObj(this.placeInfo,_data)
						this.placeInfo.begintime=util.dateFormat(this.placeInfo.begintime)
						if(this.placeInfo.endtime){
							this.placeInfo.endtime=util.dateFormat(this.placeInfo.endtime)
						}
						if(this.placeInfo.imageUrl){
							let imgs=this.placeInfo.imageUrl.split(',')
							for(let i=0;i<imgs.length;i++){
								this.uploadConfig.imageData.push(imgs[i])
							}
						}
					}else{
						uni.showToast({
							title:'加载失败',icon:'none'
						})
					}
				})
			},
			bindSDateChange: function(e) {
				this.placeInfo.begintime = e.target.value
			},
			bindEDateChange: function(e) {
				this.placeInfo.endtime = e.target.value
			},
			save:function(){
				let postParam= {address: null,name:null,description:null,begintime:null,endtime:null}
				util.loadObj(postParam,this.placeInfo);
				postParam.language=this.param.language
				let url = null;
				if(this.placeInfo.id){
					url='contentPlace/editPlace';
					postParam.contentPlaceId=this.placeInfo.id
				}else{
					url='contentPlace/createPlace';
					postParam.userId=this.param.userId
					postParam.moduleId=this.param.moduleId
				}
				if(this.uploadConfig.imageData.length){
					postParam['imageUrl']=this.uploadConfig.imageData.join(',')
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
			deleteImage: function(e){
				console.log(e)
			},
			addImage: function(e){
				console.log(e)
			}
		}
	}
</script>

<style scoped>
	page{
		border-top: 1px solid #e5e5e5;
	}
	.container{
		padding-left:30upx;
		padding-right:30upx;
	}
	.wrapper{
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #e5e5e5;
	}
	.mul_wrapper{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-top: 20upx;
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
	.input{
		font-size: 34upx;
		color: #303641;
		flex:1;
		text-align:right;
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
	.login {
		margin-top: 100upx;
		font-size: 32upx;
		color: #e5e5e5;
		background-color: #4dc578;
		height: 92upx;
		line-height: 92upx;
	}
			
	.picker_inner{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
		
	.picker_arrow{
		height: 20upx;
		width: 24upx;
		margin-left: 10upx;
	}
</style>
