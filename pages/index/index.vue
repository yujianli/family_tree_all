<template>
	<view>
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<view class="person_tabs">
			<view class="person_name">
				<text :class="{person_name_active:isActive}" @tap="selPerson(true, personInfo.userId)">{{personInfo.name}}</text>
				<!-- <view class="tab_line"></view> -->
			</view>
			<view v-if="spouseUserId" class="person_name" style="margin-left: 53upx;">
				<text :class="{person_name_active:!isActive}" @tap="selPerson(false,spouseUserId)">{{spouseName}}</text>
				<!-- <view class="tab_line tab_line_active"></view> -->
			</view>
		</view>
		<funchead :basicFuncList="basicFuncList" :language="param.language" @gotoList="jumpToList"></funchead>
		<view style="margin-top: 480upx;">
			<uni-swiper-dot :info="userCardList" :current="current" field="content" :mode="mode" :dotsStyles="dotsStyles">
				<swiper style="height: 360upx;">
					<swiper-item v-for="(item, index) in userCardList" :key="index" @tap="viewDetail(item)">
						<view style="border-radius: 15upx;padding: 30upx;padding-bottom: 10upx;background: url(../../static/images/bg_card.png) no-repeat center center;background-size: contain;">
							<view class="person_intro">
								<image :src="item.headUrl" style="width: 88upx;height: 88upx;border-radius: 50%;"></image>
								<text class="name">{{ item.name }}</text>
							</view>
							<view style="margin-bottom: 30upx;">
								<view class="other_info_container">
									<view style="flex: 1.2;" class="other_info">
										<text>{{i18n.birth2}}：</text>
										<text>{{ item.birth | formatDate}}{{item.isPassedAway| isPassaway}}</text>
									</view>
									<view style="flex: 0.8;margin-left: 45upx;" class="other_info">
										<text>{{i18n.birthPlace}}：</text>
										<text>{{item.birthPlace | nullFilter}}</text>
									</view>
								</view>
								<view class="other_info_container">
									<view style="flex: 1.2;margin-top: 4upx;" class="other_info">
										<text>{{i18n.nationality}}：</text>
										<text>{{item.nationality | nullFilter}}</text>
									</view>
									<view style="flex: 0.8;margin-left: 45upx;margin-top: 4upx;" class="other_info">
										<text>{{i18n.career}}：</text>
										<text>{{item.career | nullFilter}}</text>
									</view>
								</view>
							</view>
						</view>


					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			<indexContentList ref="indexContent" :userId="param.userId" :isFamily="param.isFamily" :language="param.language"></indexContentList>
		</view>

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
				basicFuncList: [{
					id: -1,
					name: this.$t('btnText').more,
					icon: '../../static/images/icon_func_0.png'
				}],
				personInfo: {
					id: -1,
					headUrl: '../../static/images/test.png',
					name: '',
					birth: '',
					birthPlace: '',
					nationality: '',
					career: '',
					userId: null
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
					text: this.$t('btnText').remove,
					style: {
						backgroundColor: '#ED4848',
						width: '105px'
					}
				}],
				defaultUrl: '../../static/images/avatar.png',
				suffixUrl: '&style=image/resize,m_fill,w_44,h_44',
				spouseName: null,
				spouseUserId: null,
				isActive: true,
				mainUserId:null
			};
		},
		components: {
			uniSwiperDot,
			indexContentList,
			funchead
		},
		computed: {
			i18n() {
				return this.$t('common')
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value)
			},
			isPassaway: function(value) {
				if (value === 1) {
					return '(陨)'
				} else {
					return '(存)'
				}
			},
			nullFilter: function(value) {
				if (!value) return ''
				return value
			}
		},
		onLoad: function() {
			let user = uni.getStorageSync("USER");
			this.param.userId = user.id;
			this.mainUserId = user.id;
			this.spouseName = user.spouseName
			this.spouseUserId = parseInt(user.spouseUserId)
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
			console.log(this.param.userId)
			this.loadModule();
			if (this.isActive) {
				this.loadUserInfo();
				this.loadWhetherRemind();
			}
			this.loadUserCardList()
			// this.loadIndexContent();
			// this.$refs.funchead.loadIndexContent()
			this.$nextTick(() => this.$refs['indexContent'].loadIndexContent())
		},
		methods: {
			loadModule: function() {
				let postParam={
					isFamily: this.param.isFamily,
					language: this.param.language,
					userId: this.mainUserId
				}
				if(!this.isActive){
					postParam.spouseUserId=this.param.userId
				}
				this.$http.get('module/user/all', postParam).then(res => {
					if (res.data.code === 200) {
						this.basicFuncList = res.data.data.module;
						if(this.isActive){
							this.basicFuncList.push({
								id: 0,
								name: this.$t('btnText').more,
								icon: '../../static/images/icon_func_0.png'
							});
						}
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
							userId: this.param.userId,
							language: this.param.language
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
			loadUserCardList: function() {
				this.$http.get('content/userBaseCards', {
					userId: this.param.userId,
					language: this.param.language
				}).then(res => {
					if (res.data.code === 200) {
						this.userCardList = res.data.data.userCardList
						for (let i = 0; i < this.userCardList.length; i++) {
							this.userCardList[i].sex = this.userCardList[i].sex === 1 ? '男' : '女'
							if (this.userCardList[i].headUrl) {
								this.userCardList[i].headUrl = this.$common.picPrefix() + this.userCardList[i].headUrl + this.suffixUrl
							} else {
								this.userCardList[i].headUrl = this.defaultUrl
							}
							if (this.userCardList[i].zodiac) {
								let item = this.$t('selData').zodiac.find(item => item.key === this.userCardList[i].zodiac)
								if (item) {
									this.userCardList[i].zodiac = item.value
								}
							} else {
								this.userCardList[i].zodiac = ''
							}
							if (this.userCardList[i].nationality) {
								let item = this.$t('selData').nationality.find(item => item.key === this.userCardList[i].nationality)
								if (item) {
									this.userCardList[i].nationality = item.value
								}
							} else {
								this.userCardList[i].nationality = ''
							}
						}
					} else {
						uni.showToast({
							title: '首页卡片内容加载失败',
							icon: 'none'
						});
					}
				})
			},
			// 获取用户试用期状态
			loadWhetherRemind: function() {
				this.$http
					.post('content/whetherRemind', {
						language: this.param.language,
						userId: this.param.userId
					})
					.then(res => {
						if (res.data.code == 200) {
							let whetherRemind = res.data.data.whetherRemind;
							/*whetherRemind
							值为0时代表未到预警时间，
							值为1时代表软件试用期快结束了，
							值为2时代表软件试用时间已到期*/
							// 提醒试用到期
							if (whetherRemind == 1) {
								uni.showModal({
									title: this.$t('common').reminder,
									content: this.$t('msg').msg8,
									cancelText: this.$t('btnText').notNow,
									confirmColor: '#4DC578',
									success: function(res) {
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
			viewDetail: function(item) {
				uni.navigateTo({
					url: '../family/person/info' + util.jsonToQuery({
						familyUserId: item.familyUserId,
						userId: this.param.userId,
						language: this.param.language
					})
				})
			},
			selPerson: function(active, _userId) {
				this.isActive = active
				this.param.userId = _userId
				this.loadModule();
				this.loadUserCardList()
				this.$nextTick(() => this.$refs['indexContent'].loadIndexContent())
			}
		}
	};
</script>


<style lang="less" scoped>
	@import '../../common/card.css';

	page {
		border-top: 1px solid #e5e5e5;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.person_tabs {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 100upx;
		position: fixed;

		/* #ifdef H5 */
		top: 0;
		/* #endif */

		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */

		left: 0;
		right: 0;
		z-index: 999;
		background-color: #4DC578;
	}

	.person_name {
		font-size: 32upx;
		color: #E0FFEB;
	}

	.person_name_active {
		//color: #fff;
		// font-weight: 700;
		// padding-bottom: 28upx;
		font-size: 40upx;
		color: #fff;
		// border-bottom: 1px solid #4DC578;
	}

	.tab_line {
		width: 92%;
		height: 1px;
		background-color: #E6E6E6;
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

	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #4DC578;
		top: 0;
		z-index: 999;
	}
</style>
