<template>
	<view>
		<view class="status_bar"></view>
		<view class="person_tabs">
			<view>
				<text class="person_name person_name_active">{{personInfo.name}}（本人）</text>
				<!-- <view class="tab_line"></view> -->
			</view>
			<!-- 			<view>
				<text class="person_name">杨林艳（配偶）</text>
				<view class="tab_line tab_line_active"></view>
			</view> -->
		</view>
		<funchead :basicFuncList="basicFuncList" @gotoList="jumpToList"></funchead>
		<!-- 		<view class="func_container">
			<view class="func_wrapper" v-for="(basicFunc, i) in basicFuncList" v-bind:key="basicFunc.id" @tap="jumpToList(basicFunc)">
				<image class="pic_menu" :src="basicFunc.icon"></image>
				<text class="text">{{ basicFunc.name }}</text>
			</view>
		</view> -->
		<!-- 		<view class="person_intro">
			<image src="personInfo.headUrl" style="width: 44px;height: 44px;"></image>
			<text class="name">{{personInfo.name}}</text>
		</view>
		<view style="margin-bottom: 26px;">
			<view class="other_info_container">
				<text class="other_info">出生：{{personInfo.birth}}</text>
				<text class="other_info">出生地：{{personInfo.birthPlace}}</text>
			</view>
			<view class="other_info_container">
				<text class="other_info">民族：{{personInfo.nationality}}</text>
				<text class="other_info">职业：{{personInfo.career}}</text>
			</view>

		</view> -->

		<uni-swiper-dot :info="userCardList" :current="current" field="content" :mode="mode" :dotsStyles="dotsStyles">
			<swiper style="height: 490upx;">
				<swiper-item v-for="(item, index) in userCardList" :key="index"  @tap="viewDetail(item)">
					<view style="padding: 34upx">
						<view style="box-shadow: 2upx 0 18upx #E5E5E5;border-radius: 15upx;padding: 30upx;">
							<view class="person_intro">
								<image :src="item.headUrl + suffixUrl" style="width: 88upx;height: 88upx;border-radius: 50%;"></image>
								<text class="name">{{ item.name }}</text>
							</view>
							<view style="margin-bottom: 30upx;">
								<view class="other_info_container">
									<view  style="flex: 1;"  class="other_info">
										<text>{{langData.common.birth2}}：</text>
										<text>{{ item.birth | formatDate}}</text>
									</view>
									<view  style="flex: 1;margin-left: 65upx;" class="other_info">
										<text>{{langData.common.birthPlace}}：</text>
										<text>{{item.birthPlace | nullFilter}}</text>
									</view>
								</view>
								<view class="other_info_container">
									<view  style="flex: 1;"  class="other_info">
										<text>{{langData.common.nationality}}：</text>
										<text>{{item.nationality | nullFilter}}</text>
									</view>
									<view  style="flex: 1;margin-left: 65upx;" class="other_info">
										<text>{{langData.common.career}}：</text>
										<text>{{item.career | nullFilter}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<indexContentList ref="indexContent" :userId="param.userId" :isFamily="param.isFamily" :language="param.language"></indexContentList>
	</view>
</template>

<script>
	import MescrollUni from "mescroll-uni";
	import util from '@/common/util.js';
	import moduleLink from '@/common/moduleLink.js';
	import uniSwiperDot from '@/components/uni-ui/uni-swiper-dot/uni-swiper-dot.vue';
	import indexContentList from '@/components/index-content-list.vue'
	import funchead from '@/components/funchead.vue'
	import dataJson from '@/static/appData.json'
	export default {
		data() {
			return {
				param: {
					userId: null,
					isFamily: 1,
					language: this.$common.getLanguage()
				},
				// langData:this.$common.getLanguageData(this.param.language),
				basicFuncList: [{
					id: -1,
					name: '更多',
					icon: '../../static/images/icon_func_0.png'
				}],
				personInfo: {
					id: -1,
					headUrl: '../../static/images/test.png',
					name: '',
					birth: '',
					birthPlace: '',
					nationality: '',
					career: ''
				},
				userCardList: [],
				current: 0,
				mode: 'round',
				dotsStyles: {
					width: 0,
					bottom: 0,
					border: 0,
					height: 0,
					selectedBorder: 0
				},
				contentList: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ED4848',
						width: '105px'
					}
				}],
				defaultUrl:'../../static/images/avatar.png',
				suffixUrl: '&style=image/resize,m_fill,w_44,h_44'
			};
		},
		components: {
			uniSwiperDot,
			indexContentList,
			funchead
		},
		computed:{
			langData:function(){
				let lang=this.$common.getLanguage()
				return this.$common.getLanguageData(this.param.language)
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value)
			},
			nullFilter:function(value){
				if (!value) return ''
				return value
			}
		},
		onLoad: function() {
			//console.log(JSON.stringify(this.personInfo))
			// 提醒试用到期
			// uni.showModal({
			// 	title: '温馨提示',
			// 	content: '试用期已到期，请支付年费后继续使用？',
			// 	cancelText:'以后再说',
			// 	confirmColor:'#4DC578',
			// 	success: function (res) {
			// 		if (res.confirm) { 
			// 		  uni.navigateTo({
			// 			url: '/pages/fee/fee'
			// 		  });
			// 		} else if (res.cancel) {
			// 			console.log('用户点击取消');
			// 		}
			// 	}
			// });
		},
		onShow: function() {
			//console.log(JSON.stringify(this.personInfo))
			let user = uni.getStorageSync("USER");
			this.param.userId = user.id;
			this.loadModule();
			this.loadUserInfo();
			this.loadWhetherRemind();
			this.loadUserCardList()
			// this.loadIndexContent();
			// this.$refs.funchead.loadIndexContent()
			this.$refs['indexContent'].loadIndexContent()
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
				let linkUrl = json.url
				switch (json.moduleId) {
					case 0:
						let _param = this.param
						_param['personId'] = this.personInfo.id
						linkUrl = linkUrl + util.jsonToQuery(_param);
						break;
					case 1:
						linkUrl = linkUrl + util.jsonToQuery({
							userId:this.param.userId,
							language:this.param.language
						})
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
			// jumpToDetail:function(content){
			// 	let p = {
			// 		userId: this.param.userId,
			// 		moduleId: content.moduleId,
			// 		flag: content.flag,
			// 		contentId: content.id,
			// 		name: content.moduleName
			// 	}
			// 	let url = '/pages/hobby/detail' + util.jsonToQuery(p);
			// 	uni.navigateTo({
			// 		url: url
			// 	});
			// },
			// loadModule: function() {
			// 	this.$http.get('module/user/all', this.param).then(res => {
			// 		if (res.data.code === 200) {
			// 			this.basicFuncList = res.data.data.module;
			// 			this.basicFuncList.push({
			// 				id: 0,
			// 				name: '更多',
			// 				icon: '../../static/images/icon_func_0.png'
			// 			});
			// 		} else {
			// 			uni.showToast({
			// 				title: '模块信息加载失败',
			// 				icon: 'none'
			// 			});
			// 		}
			// 	});
			// },
			loadUserInfo: function() {
				this.$http
					.get('base/selectBase', {
						language: this.param.language,
						userId: this.param.userId
					})
					.then(res => {
						if (res.data.code === 200) {
							util.loadObj(this.personInfo, res.data.data.baseInfo);
						} else {
							uni.showToast({
								title: '人物信息加载失败',
								icon: 'none'
							});
						}
					});
			},
			loadUserCardList:function(){
				this.$http.get('content/userBaseCards',{
					userId:this.param.userId,
					language:this.param.language
				}).then(res=>{
					if(res.data.code===200){
						this.userCardList=res.data.data.userCardList
						for(let i=0;i<this.userCardList.length;i++){
							this.userCardList[i].sex=this.userCardList[i].sex===1?'男':'女'
							if(this.userCardList[i].headUrl){
								this.userCardList[i].headUrl=this.$common.picPrefix()+this.userCardList[i].headUrl
							}else{
								this.userCardList[i].headUrl=this.defaultUrl
							}
							if(this.userCardList[i].zodiac){
								let item = dataJson['zodiac'].find(item=>item.key===this.userCardList[i].zodiac)
								if(item){
									this.userCardList[i].zodiac=item.value
								}
							}else{
								this.userCardList[i].zodiac=''
							}
							if(this.userCardList[i].nationality){
								let item = dataJson['nationality'].find(item=>item.key===this.userCardList[i].nationality)
								if(item){
									this.userCardList[i].nationality=item.value
								}
							}else{
								this.userCardList[i].nationality=''
							}
						}
					}else{
						uni.showToast({
							title: '首页卡片内容加载失败',icon:'none'
						});
					}
				})
			},
			// 获取用户试用期状态
			loadWhetherRemind:function(){
				this.$http
				.post('content/whetherRemind',{
					language: this.param.language,
					userId: this.param.userId
				})
				.then(res => {
					if(res.data.code == 200){
						let whetherRemind = res.data.data.whetherRemind;
						/*whetherRemind
						值为0时代表未到预警时间，
						值为1时代表软件试用期快结束了，
						值为2时代表软件试用时间已到期*/
						// 提醒试用到期
						if(whetherRemind == 1){
							uni.showModal({
								title: '温馨提示',
								content: '试用期快到期了，请支付年费后继续使用？',
								cancelText:'以后再说',
								confirmColor:'#4DC578',
								success: function (res) {
									if (res.confirm) { 
									  uni.navigateTo({
										url: '/pages/fee/fee'
									  });
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
					} else {
						uni.showToast({
							title: '用户试用期状态加载失败',
							icon: 'none'
						});
					}
				})
			},
			viewDetail:function(item){
				uni.navigateTo({
					url:'../family/person/info'+util.jsonToQuery({
						familyUserId:item.familyUserId,
						userId:this.param.userId,
						language:this.param.language
					})
				})
			}
			// loadIndexContent:function(){
			// 	this.$http.get('content/userCards',{
			// 		userId:this.param.userId,
			// 		page:1,
			// 		rows:10,
			// 		language:this.param.language,
			// 		isFamily:this.param.isFamily
			// 	}).then((res)=>{
			// 		if(res.data.code===200){
			// 			this.contentList = res.data.data.contentList;
			// 			for(let i=0;i<this.contentList.length;i++){
			// 				if(this.contentList[i].tags){
			// 					this.contentList[i].tags=this.contentList[i].tags.split(',')
			// 				}
			// 				if(this.contentList[i].imageUrl){
			// 					this.contentList[i].imageUrl=this.$common.picPrefix()+this.contentList[i].imageUrl
			// 				}
			// 			}
			// 		}else{
			// 			uni.showToast({
			// 				title: '首页内容加载失败',icon:'none'
			// 			});
			// 		}
			// 	})
			// },
			// toMore:function(){
			// 	uni.navigateTo({
			// 		url:'/pages/all/all'+ util.jsonToQuery({
			// 			userId: this.param.userId,
			// 			language: this.param.language,
			// 			isFamily: this.isFamily
			// 		})
			// 	})
			// },
			// deleteContent(contentId) {
			// 	var self = this
			// 	uni.showModal({
			// 		title: '删除',
			// 		content: '确认删除该记录？',
			// 		confirmText: '确认',
			// 		success: function (res) {
			// 			if (res.confirm) {
			// 			  self.$http
			// 			  	.post('content/delete', {
			// 			  		language: self.$common.language,
			// 			  		contentId: contentId
			// 			  	})
			// 			  	.then(res => {
			// 			  		if (res.data.code === 200) {
			// 			  			self.loadIndexContent();
			// 			  		} else {
			// 			  			uni.showToast({
			// 			  				title: '内容删除失败',
			// 			  				icon: 'none'
			// 			  			});
			// 			  		}
			// 			  	});
			// 			} else if (res.cancel) {
			// 				console.log('用户点击取消');
			// 			}
			// 		}
			// 	});
			// }
		}
	};
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
		padding-bottom: 28upx;
		border-bottom: 1px solid #4DC578;
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
		margin-top: 10upx;
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
</style>
