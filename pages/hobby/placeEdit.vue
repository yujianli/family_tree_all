<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">购买年月</text>
			<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindSDateChange" :fields="'day'" :value="placeInfo.begintime">
				<view>{{placeInfo.begintime}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出售年月</text>
			<picker class="input" mode="date" :start="startDate" :end="endDate" @change="bindEDateChange" :fields="'day'" :value="placeInfo.endtime">
				<view>{{placeInfo.endtime}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">居室地址</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="居室地址" v-model="placeInfo.address" />
		</view>
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" v-model="placeInfo.description" placeholder="内容" />
			</view>
	</view>

</template>

<script>
	import util from '@/common/util.js'
	import module from '@/common/moduleLink.js'
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
					begintime:currentDate,
					endtime:'',
					description:'',
					address:'',
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
			if(options.id){
				this.loadData(options.id)
			}
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
						this.placeInfo.endtime=util.dateFormat(this.placeInfo.endtime)
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
				let postParam= {name:null,description:null,begintime:null,endtime:null}
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
