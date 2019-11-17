<template>
	<view>
		<view class="status_bar"></view>
		<view class="person_tabs">
			<view>
				<text class="person_name person_name_active">{{personInfo.name}}（本人）</text>
				<view class="tab_line"></view>
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
			<swiper style="height: 460upx;">
				<swiper-item v-for="(item, index) in userCardList" :key="index">
					<view class="person_intro">
						<image :src="item.headUrl" style="width: 88upx;height: 88upx;"></image>
						<text class="name">{{ item.name }}</text>
					</view>
					<view style="margin-bottom: 52upx;">
						<view class="other_info_container">
							<text class="other_info">出生：{{ item.birth }}</text>
							<text class="other_info">出生地：浙江杭州</text>
						</view>
						<view class="other_info_container">
							<text class="other_info">民族：汉族</text>
							<text class="other_info">职业：程序员</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<indexContentList :userId="param.userId" :isFamily="param.isFamily" :language="param.language"></indexContentList>
		<!-- <view class="card_list">
			<view class="more" @tap="toMore">更多</view>
			<view v-for="(contentInfo,i) in contentList" v-bind:key="contentInfo.id">
				<uni-swipe-action :options="options" @click="deleteContent(contentInfo.id)">
					<view class="card_item" @tap="jumpToDetail(contentInfo)">
						<image v-if="contentInfo.imageUrl!=null" :src="contentInfo.imageUrl" class="card_pic"></image>
						<view class="card_inner">
							<text class="card_title">{{contentInfo.content}}</text>
							<view class="card_others">
								<view class="tags">
									<text class="tags_text" v-for="(tag,i) in contentInfo.tags" v-bind:key="tag">
										{{tag}}
									</text>
								</view>
								<text class="time">{{contentInfo.createDate | formatDate}}</text>
							</view>
						</view>
					</view>
				</uni-swipe-action>
			</view>
		</view> -->
	</view>
</template>

<script>
	import MescrollUni from "mescroll-uni";
	import util from '@/common/util.js';
	import moduleLink from '@/common/moduleLink.js';
	import uniSwiperDot from '@/components/uni-ui/uni-swiper-dot/uni-swiper-dot.vue';
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
	import indexContentList from '@/components/index-content-list.vue'
	import funchead from '@/components/funchead.vue'
	export default {
		data() {
			return {
				param: {
					userId: null,
					isFamily: 1,
					language: this.$common.language
				},
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
				userCardList: [{
						zodiac: 3,
						sex: 1,
						name: '张三',
						headUrl: '../../static/images/icon_func_0.png',
						birth: '1993-10-11',
						familyUserId: '1'
					},
					{
						zodiac: '',
						sex: 1,
						name: '李四',
						headUrl: '../../static/images/icon_func_1.png',
						birth: '',
						familyUserId: '2'
					},
					{
						zodiac: '',
						sex: 2,
						name: '王五',
						headUrl: '../../static/images/icon_func_2.png',
						birth: '',
						familyUserId: '3'
					}
				],
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
				}]
			};
		},
		components: {
			uniSwiperDot,
			uniSwipeAction,
			indexContentList,
			funchead
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value)
			}
		},
		onLoad: function() {
			console.log(JSON.stringify(this.personInfo))
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
			console.log(JSON.stringify(this.personInfo))
			let user = uni.getStorageSync("USER");
			this.param.userId = user.id;
			this.loadModule();
			this.loadUserInfo();
			// this.loadIndexContent();
			// this.$refs.funchead.loadIndexContent()
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
						linkUrl = linkUrl + '?id=' + this.personInfo.id;
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
			loadModule: function() {
				this.$http.get('module/user/all', this.param).then(res => {
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
</style>
