<template>
	<view>
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<view class="family_select_container" >
<!-- 			<view @tap="tabSelect">
				<text>{{familyTitle}}</text>
			</view> -->
			<view @tap="open"><text>{{familyTitle}}</text></view>
		</view>
		<w-picker mode="selector" @confirm="selVal" ref="selector" themeColor="#f00" :selectList="familyList"></w-picker>
		<funchead :basicFuncList="basicFuncList" :language="param.language" @gotoList="jumpToList"></funchead>
		<view style="padding: 34upx;margin-top:480upx">
			<view class="family_training_container">
				<view class="title">{{i18n.training}}</view>
				<view class="content">
					<!-- <textarea class="mul_input" disabled placeholder-style="color:#999" v-model="instruction"></textarea> -->
					<view class="mul_input"><text>{{instruction}}</text></view>
				</view>
			</view>
		</view>
		
 		<indexContentList ref="indexContent" :userId="param.userId" :isFamily="param.isFamily" :language="param.language" ></indexContentList>
<!-- 		<uni-popup ref="popup" type="center" class="my_popup">
			<view class="inner_select">
				<view v-for="(item, i) in familyList" v-bind:key="item.id"  @tap="selFamily(item)">{{item.name}}</view>
				<view style="border: 14upx solid transparent;border-bottom-color:#fff; position: absolute;left: 142upx;top: -94upx;"></view>
			</view>
		</uni-popup> -->
	</view>

</template>

<script>
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue'
	import funchead from '@/components/funchead.vue'
	import indexContentList from '@/components/index-content-list.vue'
	import wPicker from "@/components/w-picker/w-picker.vue";
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
				//showSelect: false,
				familyUserId:null,
				familyTitle: '',
				familyList:[],
				instruction: '',
				basicFuncList: [],
				testInfoList: [],
			}
		},
		computed:{
			i18n() {
				return this.$t('common')
			}
		},
		components: {funchead,indexContentList,uniPopup,wPicker},
		onLoad: function() {
			let user = uni.getStorageSync("USER");
			this.param.language = this.$common.language
			this.param.userId = user.id;
			this.loadModule();
			this.loadFamilyList()
		},
		onShow:function(){
			if(this.param.familyId){
				this.loadFamilyInfo()
			}
			// this.$refs.indexcontentlist.loadIndexContent()
			this.$nextTick(()=>this.$refs['indexContent'].loadIndexContent())
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
						// this.basicFuncList.push({
						// 	id: 0,
						// 	name: this.$t('btnText').more,
						// 	icon: '../../static/images/icon_func_0.png'
						// });
					} else {
						uni.showToast({
							title: '模块信息加载失败',
							icon: 'none'
						});
					}
				});
			},
			jumpToList: function(json) {
				// console.log(JSON.stringify(json))
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
				//this.showSelect = !this.showSelect;
				this.$refs.popup.open()
			},
			open:function(){
				this.$refs.selector.show()
			},
			selVal:function(e){
				console.log(e)
				this.selFamily(e.checkArr)
			},
			selFamily:function(item){
				this.familyTitle=item.name
				this.param.familyId=item.id
				// this.showSelect=false
				this.loadFamilyInfo()
			},
			loadFamilyList:function(){
				this.$http.get('family/familyList',{
					userId: this.param.userId,
					language: this.param.language
				}).then((res)=>{
					if(res.data.code===200){
						this.familyList=res.data.data.familyList
						for(let i=0;i<this.familyList.length;i++){
							this.familyList[i].label=this.familyList[i].name
						}
						this.selFamily(this.familyList[0])
					}else{
						uni.showToast({
							title: '家族信息加载失败',icon:'none'
						});
					}
				})
			},
			loadFamilyInfo:function(){
				this.$http.get('family/detail',{
					familyId:this.param.familyId,
					language:this.param.language
				}).then(res=>{
					if(res.data.code===200){
						this.familyUserId=res.data.data.family.familyUserId
						if(res.data.data.family.instruction){
							this.instruction=res.data.data.family.instruction
						}else{
							this.instruction=''
						}
						
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
	page{
		border-top: 1px solid #e5e5e5;
	}
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
		font-weight: 700;
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
		font-weight: 700;
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
		// margin-top: 43upx;
		position: relative;
		position: fixed;
		left: 0;
		right: 0;
		height: 100upx;
		/* #ifdef H5 */
		top: 0;
		/* #endif */
		
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		z-index: 99;
		background-color: #4DC578;
		

		text {
			font-size: 33upx;
			color: #fff;
		}

		image {
			margin-left: 14upx;
			width: 23upx;
			height: 19upx;
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
			font-weight: 700;
		}

		.content {
			font-size: 33upx;
			color: #333;
			margin-top: 32upx;
		}
		
		.mul_input{
			flex: 1;
			width: 600upx;
			// padding: 12upx;
		}
	}
	
	.inner_select {
		background-color: #fff;
		//width: 335upx;
		height: 328upx;
		text-align: center;
		// box-shadow: 2upx 0 18upx #E5E5E5;
		
		// border: 1px #fff solid;
	 //    border-radius: 10upx;
	
		view {
			height: 65upx;
			line-height: 65upx;
			font-size: 32upx;
			color: #303641;
	
			&.active {
				background-color: #ccc;
			}
		}
	}
	.top_view {
	    height: var(--status-bar-height);  
	    width: 100%;  
	    position: fixed;  
	    background-color: #4DC578; 
	    top: 0;  
	    z-index: 999;  
	}
</style>
