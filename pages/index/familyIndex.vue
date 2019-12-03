<template>
	<view>
		<view class="status_bar"></view>

		<view class="family_select_container">
			<view @tap="tabSelect">
				<text>{{familyTitle}}</text>
				<image src="../../static/images/arrow.png"></image>
			</view>

			<view class="inner_select" :style="{'display': showSelect ? 'block' : 'none'}">
				<!-- <view class="active">万少波的家族树</view> -->
				<view v-for="(item, i) in familyList" v-bind:key="item.id"  @tap="selFamily(item)">{{item.name}}</view>
			</view>
		</view>

<!-- 		<view class="func_container" style="margin-top: 38upx;">
			<view class="func_wrapper" v-for="(basicFunc, i) in basicFuncList" v-bind:key="basicFunc.id" @tap="jumpToList(basicFunc)">
				<image class="pic_menu" :src="basicFunc.icon"></image>
				<text class="text">{{ basicFunc.name }}</text>
			</view>
		</view> -->
		<funchead :basicFuncList="basicFuncList" @gotoList="jumpToList"></funchead>
		<view style="padding: 34upx;">
			<view class="family_training_container">
				<view class="title">家训</view>
				<view class="content">
					{{instruction}}
				</view>
			</view>
		</view>
		
 		<indexContentList :userId="param.userId" :isFamily="param.isFamily" :language="param.language" ></indexContentList>
			<!-- <view class="card_list">
			<view class="more" @tap="jumpToAll">更多</view>
			<view class="card_item" v-for="(item ,index) in testInfoList" :key="index">
				<image :style="{display: item.pic == '' ? 'none' : 'block'}" :src="item.pic" class="card_pic"></image>
				<view class="card_inner">
					<view class="card_title">{{item.content}}</view>
					<view class="card_others">
						<view class="tags">
							<text class="tags_text">旅行</text>
							<text class="tags_text">游记</text>
						</view>
						<text class="time">2018/10/12</text>
					</view>
				</view>
			</view>
		</view> -->
		
	</view>

</template>

<script>
	import funchead from '@/components/funchead.vue'
	import indexContentList from '@/components/index-content-list.vue'
	import moduleLink from '@/common/moduleLink.js';
	import util from '@/common/util.js';
	export default {
		data() {
			return {
				param:{
					userId:null,
					familyId:null,
					language: this.$common.language,
					isFamily: 2
				},
				showSelect: false,
				familyUserId:null,
				familyTitle: '家族',
				familyList:[],
				instruction: '',
				basicFuncList: [],
				testInfoList: [{
					id: 1,
					content: '这是一则很重要的新闻，欢迎大家',
					pic: '../../static/images/icon_func_1.png',
				}, {
					id: 2,
					content: '这是一则很重要的新闻，欢迎大家',
					pic: '../../static/images/icon_func_2.png',
				}, {
					id: 3,
					content: '超级长的故，这是一则很重要的新闻，欢迎大家,超级长的故事',
					pic: '',
				}]
			}
		},
		components: {funchead,indexContentList},
		onLoad: function() {
			
			// this.loadFamilyInfo()
		},
		onShow:function(){
			let user = uni.getStorageSync("USER");
			this.param.language = this.$common.language
			this.param.userId = user.id;
			this.loadModule();
			this.loadFamilyList()
			// this.$refs.indexcontentlist.loadIndexContent()
		},
		methods: {
			loadModule: function() {
				this.$http.get('module/user/all', {
					isFamily: this.param.isFamily,
					language: this.param.language,
					userId: this.param.userId
				}).then(res => {
					if (res.data.code === 200) {
						this.basicFuncList = res.data.data.module;
						this.basicFuncList.push({
							id: 0,
							name: '更多',
							icon: '../../static/images/icon_func_0.png'
						});
					} else {
						uni.showToast({
							title: '模块信息加载失败',
							icon: 'none'
						});
					}
				});
			},
			jumpToList: function(json) {
				console.log(JSON.stringify(json))
				let linkUrl= json.url
				switch (json.moduleId) {
					case 0:
						linkUrl = linkUrl + util.jsonToQuery({
							userId: this.param.userId,
							isFamily: this.param.isFamily,
							language: this.param.language,
							familyId: this.param.familyId
						});
						break;
					case 20:
						linkUrl=linkUrl+util.jsonToQuery({
							familyUserId: this.familyUserId,
							familyId: this.param.familyId,
							userId: this.param.userId,
							language: this.param.language
						});
						break;
					case 21:
						linkUrl = linkUrl + util.jsonToQuery({
							familyId:this.param.familyId,
							language: this.param.language
						});
						break;
					case 23:
						linkUrl = linkUrl + util.jsonToQuery({
							familyId:this.param.familyId,
							language: this.param.language,
							userId:this.param.userId
						});
						break;
					case 33:
						linkUrl = linkUrl + util.jsonToQuery({
							userId:this.param.userId,
							language: this.param.language
						});
						break;
					default:
						linkUrl = linkUrl + util.jsonToQuery({
							userId: this.param.userId,
							moduleId: json.moduleId,
							flag: moduleLink.linkFlag(json.moduleId),
							name: json.moduleName,
							language: this.param.language,
							isFamily: this.param.isFamily
						});
				}
				uni.navigateTo({
					url: linkUrl
				});
			},
			// jumpToAll: function() {
			// 	uni.navigateTo({
			// 		url: '/pages/all/all'
			// 	});
			// },
			tabSelect: function() {
				this.showSelect = !this.showSelect;
			},
			selFamily:function(item){
				this.familyTitle=item.name
				this.param.familyId=item.id
				this.showSelect=false
				this.loadFamilyInfo()
			},
			loadFamilyList:function(){
				this.$http.get('family/familyList',{
					userId: this.param.userId,
					language: this.param.language
				}).then((res)=>{
					if(res.data.code===200){
						this.familyList=res.data.data.familyList
						this.selFamily(this.familyList[0])
					}else{
						uni.showToast({
							title: '家族信息加载失败',icon:'none'
						});
					}
				})
			},
			loadModule: function(userId) {
				this.$http.get('module/user/all', {
						isFamily: this.param.isFamily,
						language: this.param.language,
						userId: this.param.userId
					}).then(res => {
						if (res.data.code === 200) {
							this.basicFuncList = res.data.data.module;
							this.basicFuncList.push({
								id: 0,
								name: '更多',
								icon: '../../static/images/icon_func_0.png'
							});
						} else {
							uni.showToast({
								title: '模块信息加载失败',
								icon: 'none'
							});
						}
					});
			},
			loadFamilyInfo:function(){
				this.$http.get('family/detail',{
					familyId:this.param.familyId,
					language:this.param.language
				}).then(res=>{
					if(res.data.code===200){
						this.familyUserId=res.data.data.family.familyUserId
						this.instruction=res.data.data.family.instruction
					}else{
						uni.showToast({
							title: '家族信息加载失败',icon:'none'
						});
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../common/card.css';

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.person_tabs {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 100upx;
	}

	.person_name {
		font-size: 36upx;
		color: #999;
	}

	.person_name_active {
		color: #333;
		font-weight: 600;
	}

	.tab_line {
		width: 140upx;
		height: 1px;
		background-color: #4DC578;
		margin: 0 auto;
		margin-top: 28upx;
	}

	.tab_line_active {
		background-color: #ffffff;
	}

	.func_container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		margin-top: 40upx;
	}

	.func_wrapper {
		display: flex;
		flex-direction: column;
		width: 20%;
		height: 188upx;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.pic_menu {
		width: 88upx;
		height: 88upx;
	}

	.pic_opt {
		width: 40upx;
		height: 40upx;
		position: absolute;
		top: 8upx;
		right: 3%;
	}

	.explain {
		margin-top: 60upx;
		margin-bottom: 68upx;
		font-size: 26upx;
		color: #999;
		text-align: center;
	}

	.text {
		margin-top: 16upx;
		font-size: 26upx;
		color: #333;
	}

	.person_intro {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin-top: 52upx;
	}

	.name {
		font-size: 42upx;
		color: #333;
		font-weight: 600;
		margin-top: 10upx;
	}

	.other_info_container {
		display: flex;
		justify-content: space-between;
		margin-top: 16upx;
		margin-left: 30upx;
		margin-right: 30upx;

	}

	.other_info {
		margin-top: 36upx;
		font-size: 28upx;
		color: #333;
	}

	uni-button:after {
		border: 0px;
	}

	uni-button.button-hover {
		background-color: #fff;
	}

	.family_select_container {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 43upx;
		position: relative;

		text {
			font-size: 33upx;
			color: #333;
		}

		image {
			margin-left: 14upx;
			width: 23upx;
			height: 19upx;
		}

		.inner_select {
			position: absolute;
			background-color: #fff;
			width: 295upx;
			height: 328upx;
			top: 80upx;
			z-index: 9999;
			text-align: center;

			view {
				height: 65upx;
				line-height: 65upx;
				font-size: 29upx;
				color: #303641;

				&.active {
					background-color: #ccc;
				}
			}
		}
	}

	.family_training_container {
		padding: 56upx 49upx;
		box-shadow: 2upx 0 18upx #E5E5E5;
		border-radius: 15upx;

		.title {
			font-size: 42upx;
			color: #333;
			text-align: center;
			font-weight: 600;
		}

		.content {
			font-size: 33upx;
			color: #333;
			margin-top: 32upx;
		}
	}
</style>
