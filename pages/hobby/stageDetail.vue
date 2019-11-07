<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">起始年月</text>
			<view>{{stageInfo.begintime}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">结束年月</text>
			<view>{{stageInfo.endtime}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{typeCtrlName}}</text>
			<view>{{stageInfo.name}}</view>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">内容</text>
			<view>{{stageInfo.description}}</view>
		</view>
		<button type="danger" @tap="remove">删除</button>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import module from '@/common/moduleLink.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					language: null,
					name: null,
					id:null
				},
				stageInfo: {
					begintime: currentDate,
					endtime: currentDate,
					description: '',
					name: '',
					id: null
				}
			}
		},
		computed:{
			typeCtrlName:function(){
				let _name = module.viewCtrlName[this.param.moduleId]
				if(_name){
					return _name;
				}else{
					return '类型';
				}
			}
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
			util.loadObj(this.param, options)
			
		},
		onShow:function(){
			this.loadData(this.param.id)
		},
		onNavigationBarButtonTap(e) {
			let url = 'stageEdit' + util.jsonToQuery(this.param)
			uni.navigateTo({
				url: url
			})
		},
		methods: {
			loadData: function(id) {
				this.$http.get('contentPeriod/detailPeriod', {
					contentPeriodId: id,
					language: this.param.language
				}).then((res) => {
					if (res.data.code === 200) {
						let _data = res.data.data.contentPeriodInfo
						util.loadObj(this.stageInfo, _data)
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					}
				})
			},
			remove:function(){
				this.$http.post('contentPeriod/deletePeriod',{
					contentPeriodId:this.param.id,
					language:this.param.language
				}).then((res)=>{
					if(res.data.code===200){
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({
							title: '删除失败',icon:'none'
						});
					}
				})
			}
		}
	}
</script>

<style>
</style>
