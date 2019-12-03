<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">购买年月</text>
			<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindSDateChange" :fields="'day'" :value="startTime">
				<view>{{startTime}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出售年月</text>
			<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindEDateChange" :fields="'day'" :value="endTime">
				<view>{{endTime}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">居室地址</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="居室地址" v-model="placeInfo.address" />
		</view>
		
		<robby-image-upload v-model="uploadConfig.imageData"
		@delete="deleteImage" @add="addImage" 
		:server-url-delete-image="uploadConfig.serverUrlDeleteImage" 
		:server-url="uploadConfig.serverUrl" 
		:header="uploadConfig.header">
		</robby-image-upload>
		<view  style="margin-top: 40upx;">
			<text class="inner_title">描述</text>
		</view>
		
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="placeInfo.description" placeholder="内容" />
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
			startDate() {
				return util.getDate('start');
			},
			endDate() {
				return util.getDate('end');
			},
			startTime(){
				if(!this.placeInfo.begintime) return '请选择';
				return this.placeInfo.begintime
			},
			endTime(){
				if(!this.placeInfo.endtime) return '请选择';
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
	.login {
		margin-top: 100upx;
		font-size: 32upx;
		color: #e5e5e5;
		background-color: #4dc578;
		height: 92upx;
		line-height: 92upx;
	}
</style>
