<template>
	<view class="container">
		<view v-if="param.moduleId==='32'">
			<view class="wrapper">
				<text class="inner_title">婚礼时间</text>
				<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindSDateChange" :fields="'day'"
				 :value="startTime">
					<view>{{startTime}}</view>
				</picker>
			</view>
			<view class="wrapper">
				<text class="inner_title">新郎名字</text>
				<input class="input" type="text" placeholder-style="color:#999" placeholder="新郎名字" v-model="newName" />
			</view>
			<view class="wrapper">
				<text class="inner_title">新娘名字</text>
				<input class="input" type="text" placeholder-style="color:#999" placeholder="新娘名字" v-model="brideName" />
			</view>
		</view>
		<view v-else>
			<view class="wrapper" v-if="param.moduleId!=='27'">
				<text class="inner_title" v-if="param.moduleId==='31'">购买年月</text>
				<text class="inner_title" v-else>起始年月</text>
				<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindSDateChange" :fields="'day'"
				 :value="startTime">
					<view>{{startTime}}</view>
				</picker>
			</view>
			<view class="wrapper" v-if="param.moduleId!=='27'">
				<text class="inner_title" v-if="param.moduleId==='31'">出售年月</text>
				<text class="inner_title" v-else>结束年月</text>
				<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindEDateChange" :fields="'day'"
				 :value="endTime">
					<view>{{endTime}}</view>
				</picker>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{typeCtrlName}}</text>
				<input class="input" type="text" placeholder-style="color:#999" placeholder="名称" v-model="stageInfo.name" />
			</view>
			<view class="wrapper" v-if="param.moduleId==='27'">
				<text class="inner_title">联系电话</text>
				<input class="input" type="text" placeholder-style="color:#999" placeholder="联系电话" v-model="stageInfo.mobile" />
			</view>
			<view class="wrapper" v-if="param.moduleId==='27'">
				<text class="inner_title">类型</text>
				<picker @change="typeBindPickerChange" :value="idx" :range="typeList" range-key="name">
					<view class="input">{{ typeList[idx].name }}</view>
				</picker>
			</view>
		</view>
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="stageInfo.description" placeholder="内容" />
			</view>
		<robby-image-upload v-model="uploadConfig.imageData"
		@delete="deleteImage" @add="addImage" 
		:server-url-delete-image="uploadConfig.serverUrlDeleteImage" 
		:server-url="uploadConfig.serverUrl" 
		:header="uploadConfig.header">
		</robby-image-upload>
	</view>

</template>

<script>
	import util from '@/common/util.js'
	import module from '@/common/moduleLink.js'
	import config from '@/common/componetConfig.js'
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
				id:null,
				stageInfo:{
					begintime:null,
					endtime:null,
					description:'',
					name:'',
					id:null,
					imageUrl:null,
					mobile:'',
					type:''
				},
				brideName:'',
				newName:'',
				typeList:[{id:-1,name:'请选择'}],
				idx:0,
				uploadConfig:{
					serverUrl: this.$common.uploadUrl(),
					serverUrlDeleteImage: null,
					hearder: null,
					formData: null,
					imageData : [],
					fileKeyName: 'file',
					showUploadProgerss:false,
					limitNumber: 1,
				},
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
				if(!this.stageInfo.begintime) return '请选择';
				return this.stageInfo.begintime
			},
			endTime(){
				if(!this.stageInfo.endtime) return '请选择';
				return this.stageInfo.endtime
			},
			typeCtrlName:function(){
				let _name = module.viewCtrlName[this.param.moduleId]
				if(_name){
					return _name;
				}else{
					return '类型';
				}
			}
		},
		filters:{
			formatDate: function(value) {
				if (!value) return '';
				return util.dateFormat(value, 'yyyy年MM月dd日');
			}
		},
		components:{robbyImageUpload},
		onLoad: function (options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
			this.id=options.id
			util.loadObj(this.param,options)
			if(this.param.moduleId==='27'){
				//同事朋友模块初始化类型
				this.loadTypeData()
			}else{
				if(options.id) this.loadData(options.id)
			}
			
			let token=uni.getStorageSync('USER').token;
			this.uploadConfig.header={'token':token};
		},
		onNavigationBarButtonTap(e) {
			this.saveSchedule()
		},
		methods: {
			loadData:function(id){
				this.$http.get('contentPeriod/detailPeriod',{
					contentPeriodId:id,
					language:this.param.language
				}).then((res)=>{
					if(res.data.code===200){
						let _data=res.data.data.contentPeriodInfo
						util.loadObj(this.stageInfo,_data)
						this.stageInfo.begintime=util.dateFormat(_data.startTime)
						this.stageInfo.endtime=util.dateFormat(_data.endTime)
						let names=this.stageInfo.name.split(',');
						this.newName=names[0];
						this.brideName=names[1];
						if(this.stageInfo.type){
							this.idx=this.typeList.findIndex((item)=>item.id==this.stageInfo.type)
						}
						if(this.stageInfo.imageUrl){
							let imgs=this.stageInfo.imageUrl.split(',')
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
			loadTypeData:function(){
				this.$http.get('category/query',{
					moduleId:this.param.moduleId,
					language:this.param.language
				}).then(res=>{
					if(res.data.code===200){
						this.typeList=this.typeList.concat(res.data.data.contentCategory);
						if(this.id) this.loadData(this.id)
					}else{
						uni.showToast({
							title: '加载失败',icon:'none'
						});
					}
				})
			},
			typeBindPickerChange:function(e){
				let id = this.typeList[e.target.value].id
				this.stageInfo.type=id;
				this.idx=e.target.value
			},
			bindSDateChange: function(e) {
				this.stageInfo.begintime = e.target.value
			},
			bindEDateChange: function(e) {
				this.stageInfo.endtime = e.target.value
			},
			saveSchedule:function(){
				let postParam= {name:null,description:null,begintime:null,endtime:null,mobile:null,type:null}
				util.loadObj(postParam,this.stageInfo);
				if(this.param.moduleId==='32'){
					postParam['name']=this.newName+','+this.brideName
				}
				postParam.language=this.param.language
				let url = null;
				//接口bug，不加时间提交失败
				if(this.param.moduleId==='27'){
					postParam.begintime=util.getDate()
				}
				if(this.stageInfo.id){
					url='contentPeriod/editPeriod';
					postParam.contentPeriodId=this.stageInfo.id
				}else{
					url='contentPeriod/createPeriod';
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
	.inner_title{
		font-size: 34upx;
		color: #333;
		margin-right: 40upx;
	}
</style>
