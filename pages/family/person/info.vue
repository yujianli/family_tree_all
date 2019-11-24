<template>
	<view>
		<view class="avatar_wrapper">
			<image src="../../../static/images/avatar.png"></image>
			<view>{{baseInfo.name}}</view>
		</view>
		<view class="tab_container">
			<view :class="{ 'active': index == 0 }" @tap="tabFunc(0)">基本信息</view>
			<view :class="{ 'active': index == 1 }" @tap="tabFunc(1)">个人信息</view>
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
	</view>
</template>

<script>
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
				arr:{
					zodiac: dataJson['zodiac'],
					birthTime: dataJson['birthTime'],
					nationality: dataJson['nationality'],
					corporeity: dataJson['corporeity']
				},
				baseInfo: {
					name:null,
					sex: null,
					nationality: null,
					zodiac: null,
					birth: null,
					birthPlace: null,
					updateBy: null,
					createBy: null,
					brief: null
				}
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
					userId: this.param.userId,
					language: this.param.language,
				}).then((res) => {
					if (res.data.code === 200) {
						let _info = res.data.data.familyUserInfo;
						_info.birth = util.dateFormat(_info.birth)
						_info.sex=this.bindProp('sex', _info.sex);
						_info.zodiac=this.bindProp('zodiac', _info.zodiac);
						_info.nationality=this.bindProp('nationality', _info.nationality);
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
			tabFunc: function(idx) {
				this.index = idx;
			},
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
</style>
