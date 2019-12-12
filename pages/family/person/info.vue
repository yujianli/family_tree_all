<template>
	<view>
		<view class="avatar_wrapper">
			<image :src="imgObj"></image>
			<view>{{baseInfo.name}}</view>
		</view>
		<view class="container">
			<view class="tab_container">
				<view :class="{ 'active': index == 0 }" @tap="tabFunc(0)">{{i18n.baseInfo}}</view>
				<view :class="{ 'active': index == 1 }" @tap="tabFunc(1)">{{i18n.personInfo}}</view>
			</view>
		</view>


		<view class="container" :style="{display: index == 0 ? 'block' : 'none'}">
			<view class="wrapper">
				<text class="inner_title">{{i18n.gender}}</text>
				<text class="inner_info">{{baseInfo.sex | nullFilter}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.nationality}}</text>
				<text class="inner_info">{{baseInfo.nationality | nullFilter}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.zodiac}}</text>
				<text class="inner_info">{{baseInfo.zodiac | nullFilter}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.birth}}</text>
				<text class="inner_info">{{baseInfo.birth|formatDate}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.birthPlace}}</text>
				<text class="inner_info">{{baseInfo.birthPlace | nullFilter}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.placeResidence}}</text>
				<text class="inner_info">{{baseInfo.updateBy | nullFilter}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.career}}</text>
				<text class="inner_info">{{baseInfo.createBy | nullFilter}}</text>
			</view>
		</view>

		<view class="container" :style="{display: index == 1 ? 'block' : 'none'}">
			<view class="inner_content">
				{{baseInfo.brief}}
			</view>
		</view>
		<view v-if="showMore" class="more_outter">
			<view class="more_container">
				<view class="more_wrapper" v-for="(basicFunc, i) in basicFuncList" v-bind:key="basicFunc.id" @tap="jumpToList(basicFunc)">
					<image class="more_pic_menu" :src="basicFunc.icon"></image>
					<view v-if="param.language=='zh_CN'">
						<text class="more_text">{{basicFunc.name}}</text>
					</view>
					<view v-else>
						<text class="more_text">{{basicFunc.englishName}}</text>
					</view>
				</view>
			</view>
			<button class="more_cancel" @tap="cancelShowFunc">{{btnText.cancel}}</button>
		</view>
		

		<view class="opt_container" v-else>
			<button class="more_more" @tap="showFunc">{{btnText.more2}}</button>
		</view>
	</view>
</template>

<script>
	import moduleLink from '@/common/moduleLink.js';
	import dataJson from '@/static/appData.json'
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				index: 0,
				param: {
					familyId: null,
					familyUserId: null,
					userId: null,
					language: null
				},
				arr: {
					zodiac: this.$t('selData').zodiac,
					birthTime: this.$t('selData').birthTime,
					nationality: this.$t('selData').nationality,
					corporeity: this.$t('selData').corporeity
				},
				baseInfo: {
					userId: null,
					name: '',
					sex: '',
					nationality: '',
					zodiac: '',
					birth: '',
					birthPlace: '',
					updateBy: '',
					createBy: '',
					brief: '',
					headUrl: ''
				},
				defaultUrl: '../../../static/images/avatar.png',
				prefixUrl: this.$common.picPrefix(),
				suffixUrl: '&style=image/resize,m_fill,w_100,h_100',
				basicFuncList: [],
				showMore: false
			}
		},
		computed: {
			i18n() {
				return this.$t('common')
			},
			btnText() {
				return this.$t('btnText')
			},
			imgObj: function() {
				return this.baseInfo.headUrl ? (this.prefixUrl + this.baseInfo.headUrl + this.suffixUrl) : this.defaultUrl
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value)
			},
			nullFilter: function(value) {
				if (!value) return ''
				return value
			}
		},
		onLoad: function(options) {
			util.loadObj(this.param, options)
			this.loadModule()
			this.loadData()
		},
		methods: {
			loadModule: function() {
				// this.$http.get('config/member-module').then(res=>{
				// 	if(res.data.code===200){
				// 		this.basicFuncList=res.data.data
				// 	}else{
				// 		uni.showToast({
				// 			title: '加载模块失败',
				// 			icon: 'none'
				// 		});
				// 	}
				// })
				uni.request({
					url: 'http://47.99.133.113:9693/api/config/member-module',
					dataType: 'json',
					method: 'GET',
					success: (res) => {
						// console.log(res.data);
						this.basicFuncList=res.data.data
					}
				})
			},
			loadData: function() {
				this.$http.post('familyUser/detilFamilyUser', {
					familyUserId: this.param.familyUserId,
					language: this.param.language,
				}).then((res) => {
					if (res.data.code === 200) {
						let _info = res.data.data.familyUserInfo;
						_info.birth = util.dateFormat(_info.birth)
						_info.sex = this.bindProp('sex', _info.sex);
						_info.zodiac = this.bindProp('zodiac', _info.zodiac);
						_info.nationality = this.bindProp('nationality', _info.nationality);
						util.loadObj(this.baseInfo, _info);
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			bindProp: function(key, val) {
				let data = this.$t('selData')
				for (var i = 0; i < data[key].length; i++) {
					if (data[key][i].key === val) {
						return data[key][i].value;
					}
				}
			},
			showFunc: function() {
				this.showMore = true

			},
			cancelShowFunc: function() {
				this.showMore = false
			},
			tabFunc: function(idx) {
				this.index = idx;
			},
			jumpToList: function(func) {
				let linkUrl = '../' + moduleLink.linkUrl[func.id];
				switch (func.id) {
					default:
						linkUrl = linkUrl + util.jsonToQuery({
							familyId: this.param.familyId,
							familyUserId: this.param.familyUserId,
							userId: this.baseInfo.userId,
							moduleId: func.id,
							flag: moduleLink.linkFlag(func.id),
							name: func.name,
							language: this.param.language,
							isFamily: func.isFamily
						});
				}
				uni.navigateTo({
					url: linkUrl
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		border-top: 1px solid #e5e5e5;
	}

	.container {
		padding-left: 30upx;
		padding-right: 30upx;
	}

	.wrapper {
		height: 96upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #F0F4F7;

	}

	.inner_title,
	.inner_content {
		font-size: 33upx;
		color: #333;
		margin-right: 40upx;

	}

	.inner_content {
		font-size: 33upx;
		color: #333;
	}

	.inner_info {
		font-size: 34upx;
		color: #303641;
		text-align: right;
	}

	.avatar_wrapper {
		background-color: #4DC578;
		height: 323upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		image {
			width: 154upx;
			height: 154upx;
			border-radius: 50%;
		}

		view {
			font-size: 42upx;
			color: #fff;
			margin-top: 41upx;
		}
	}

	.tab_container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 96upx;
		line-height: 96upx;
		font-size: 33upx;
		border-bottom: 1px solid #F0F4F7;


		view {
			color: #303641;
			text-align: center;
			flex: 1;

			&.active {
				color: #333;
				font-weight: 700;
				text-align: center;
				flex: 1;
			}
		}
	}

	.opt_container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: -8upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 114upx;

	}

	.more_more {
		flex: 1;
		font-size: 38upx;
		color: #ffffff;
		background-color: #4dc578;
		border-radius: 0;
	}

	.more_more:after,
	.more_cancel:after {
		border: 0px;
	}
	.more_outter{
		position: fixed;
		left: 0;
		right: 0;
		bottom: -8upx;
		background: #F6F6F6;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
	}
	.more_container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
	}

	.more_wrapper {
		display: flex;
		flex-direction: column;
		width: 20%;
		height: 180upx;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.more_pic_menu {
		width: 88upx;
		height: 88upx;
	}

	.more_text {
		margin-top: 16upx;
		font-size: 26upx;
		color: #333;
	}

	.more_cancel {
		height: 98upx;
		width: 308upx;
		line-height: 90upx;
		border-radius: 18upx;
		background-color: #4DC578;
		color: #fff;
		margin-bottom: 20upx;
		
	}
</style>
