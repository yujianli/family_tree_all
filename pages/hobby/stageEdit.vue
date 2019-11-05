<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">起始年月</text>
			<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindSDateChange" :fields="'day'" :value="stageInfo.begintime">
				<view>{{stageInfo.begintime}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">结束年月</text>
			<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindEDateChange" :fields="'day'" :value="stageInfo.endtime">
				<view>{{stageInfo.endtime}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">计划名称</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="计划名称" v-model="stageInfo.name" />
		</view>
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="stageInfo.description" placeholder="内容" />
			</view>
	</view>

</template>

<script>
	import util from '@/common/util.js'
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
				stageInfo:{
					begintime:currentDate,
					endtime:currentDate,
					description:'',
					name:'',
					id:null
				}				
			}
		},
		computed: {
			startDate() {
				return util.getDate('start');
			},
			endDate() {
				return util.getDate('end');
			}
		},
		onLoad: function (options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
			util.loadObj(this.param,options)
			this.loadData(options.id)
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
					}else{
						uni.showToast({
							title:'加载失败',icon:'none'
						})
					}
				})
			},
			bindSDateChange: function(e) {
				this.stageInfo.begintime = e.target.value
			},
			bindEDateChange: function(e) {
				this.stageInfo.endtime = e.target.value
			},
			saveSchedule:function(){
				let postParam= {name:null,description:null,begintime:null,endtime:null}
				util.loadObj(postParam,this.stageInfo);
				postParam.language=this.param.language
				let url = null;
				if(this.stageInfo.id){
					url='contentPeriod/editPeriod';
					postParam.contentPeriodId=this.stageInfo.id
				}else{
					url='contentPeriod/createPeriod';
					postParam.userId=this.param.userId
					postParam.moduleId=this.param.moduleId
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
