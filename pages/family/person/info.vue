<template>
	<view>
		<view class="avatar_wrapper">
			<image :src="imgObj"></image>
			<view>{{baseInfo.name}}</view>
		</view>
		<view class="container">
			<view class="tab_container">
				<view :class="{ 'active': index == 0 }" @tap="tabFunc(0)">基本信息</view>
				<view :class="{ 'active': index == 1 }" @tap="tabFunc(1)">个人信息</view>
			</view>
		</view>


		<view class="container" :style="{display: index == 0 ? 'block' : 'none'}">
			<view class="wrapper">
				<text class="inner_title">性别</text>
				<text class="inner_info">{{baseInfo.sex}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">民族</text>
				<text class="inner_info">{{baseInfo.nationality}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">生肖</text>
				<text class="inner_info">{{baseInfo.zodiac}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">出生年月</text>
				<text class="inner_info">{{baseInfo.birth|formatDate}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">出生地</text>
				<text class="inner_info">{{baseInfo.birthPlace}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">居住地</text>
				<text class="inner_info">{{baseInfo.updateBy}}</text>
			</view>
			<view class="wrapper">
				<text class="inner_title">职业</text>
				<text class="inner_info">{{baseInfo.createBy}}</text>
			</view>
		</view>

		<view class="container" :style="{display: index == 1 ? 'block' : 'none'}">
			<view class="inner_content">
				{{baseInfo.brief}}
			</view>
		</view>

		

		
		<view class="more_container" v-if="showMore">
			<view class="more_wrapper" v-for="(basicFunc, i) in basicFuncList" v-bind:key="basicFunc.id" @tap="jumpToList(basicFunc)">
				<image class="more_pic_menu" :src="basicFunc.icon"></image>
				<text class="more_text">{{basicFunc.name}}</text>
			</view>
			<button  class="more_cancel"  @tap="cancelShowFunc" >取消</button>
		</view>
		
		<view class="opt_container" v-else>
			<button class="more_more" @tap="showFunc">更多信息</button>
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
					familyUserId: null,
					userId: null,
					language: null
				},
				arr: {
					zodiac: dataJson['zodiac'],
					birthTime: dataJson['birthTime'],
					nationality: dataJson['nationality'],
					corporeity: dataJson['corporeity']
				},
				baseInfo: {
					userId:null,
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
				suffixUrl: '&style=image/resize,m_fill,w_100',
				basicFuncList: [{
						"name": "基本信息",
						"icon": "https://lgzs.oss-cn-hangzhou.aliyuncs.com/%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%20%403x.png",
						"id": 1,
						"sort": 1
					},
					{
						"name": "体貌特征",
						"icon": "https://lgzs.oss-cn-hangzhou.aliyuncs.com/icon2.png",
						"id": 2,
						"sort": 2
					},
					{
						"name": "主要大事",
						"icon": "https://lgzs.oss-cn-hangzhou.aliyuncs.com/%E4%B8%BB%E8%A6%81%E5%A4%A7%E4%BA%8B%20%403x.png",
						"id": 3,
						"sort": 3
					},
					{
						"name": "计划安排",
						"icon": "https://lgzs.oss-cn-hangzhou.aliyuncs.com/%E8%AE%A1%E5%88%92%E5%AE%89%E6%8E%92%20%403x.png",
						"id": 4,
						"sort": 4
					},
					{
						"name": "工资理财",
						"icon": "https://lgzs.oss-cn-hangzhou.aliyuncs.com/%E5%B7%A5%E8%B5%84%E7%90%86%E8%B4%A2%20%403x.png",
						"id": 6,
						"sort": 6
					},
					{
						"name": "爱好",
						"icon": "https://lgzs.oss-cn-hangzhou.aliyuncs.com/%E7%88%B1%E5%A5%BD%20%403x.png",
						"id": 7,
						"sort": 7
					},
					{
						"name": "健康状况",
						"icon": "https://lgzs.oss-cn-hangzhou.aliyuncs.com/%E5%81%A5%E5%BA%B7%E7%8A%B6%E5%86%B5%20%403x.png",
						"id": 8,
						"sort": 8
					},
					{
						"name": "生活习惯",
						"icon": "https://lgzs.oss-cn-hangzhou.aliyuncs.com/%E7%94%9F%E6%B4%BB%E4%B9%A0%E6%83%AF%20%403x.png",
						"id": 9,
						"sort": 9
					}
				],
				showMore:false
			}
		},
		computed: {
			imgObj: function() {
				return this.baseInfo.headUrl ? (this.prefixUrl + this.baseInfo.headUrl + this.suffixUrl) : this.defaultUrl
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value, 'yyyy年MM月dd日')
			}
		},
		onLoad: function(options) {
			util.loadObj(this.param, options)
			this.loadData()
		},
		methods: {
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
				for (var i = 0; i < dataJson[key].length; i++) {
					if (dataJson[key][i].key === val) {
						return dataJson[key][i].value;
					}
				}
			},
			showFunc: function() {
				this.showMore = true

			},
			cancelShowFunc:function() {
				this.showMore = false
			},
			tabFunc: function(idx) {
				this.index = idx;
			},
			jumpToList:function(func){
				let linkUrl = '../'+ moduleLink.linkUrl[func.id];
				switch (func.id) {
					case 1:
						linkUrl = linkUrl + util.jsonToQuery({
							userId:this.baseInfo.userId,
							language:this.param.language
						})
						break;
					case 2:
						linkUrl = linkUrl + util.jsonToQuery({
							userId:this.baseInfo.userId,
							moduleId:func.id,
							language:this.param.language
						});
						break;
					case 3:
						linkUrl = linkUrl + util.jsonToQuery({
							userId: this.baseInfo.userId,
							moduleId: func.id,
							flag: moduleLink.linkFlag(func.id),
							name: func.name,
							language: this.param.language,
							isFamily: 2
						});
						break
					default:
						linkUrl = linkUrl + util.jsonToQuery({
							userId: this.baseInfo.userId,
							moduleId: func.id,
							flag: moduleLink.linkFlag(func.id),
							name: func.name,
							language: this.param.language,
							isFamily: 1
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
		border-bottom: 1px solid #e5e5e5;

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
		background-color: green;
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
		border-bottom: 1px solid #e5e5e5;


		view {
			color: #303641;
			text-align: center;
			flex: 1;

			&.active {
				color: #333;
				font-weight: 600;
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

	.more_more:after,.more_cancel:after {
		border: 0px;
	}

	.more_container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		background: #F6F6F6;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: -8upx;
	
	}

	.more_wrapper {
		display: flex;
		flex-direction: column;
		width: 25%;
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
		margin-top: 40upx;
		margin-bottom: 20upx;
	}
</style>
