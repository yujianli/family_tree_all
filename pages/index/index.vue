<template>
	<view>
		<view class="status_bar"></view>
		<view class="person_tabs">
			<view>
				<text class="person_name person_name_active">万少波（本人）</text>
				<view class="tab_line"></view>
			</view>
			<view>
				<text class="person_name">杨林艳（配偶）</text>
				<view class="tab_line tab_line_active"></view>
			</view>
		</view>
		<view class="func_container">
			<!-- <navigator url="/pages/hobby/list/list" hover-class="navigator-hover"> -->
			<view class="func_wrapper" v-for="(basicFunc, i) in basicFuncList" @tap="jumpToList(basicFunc.id)">
				<image class="pic_menu" :src="basicFunc.icon"></image>
				<text class="text">{{basicFunc.name}}</text>
			</view>

		</view>
		<view class="person_intro">
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

		</view>

		<view class="card_list">
			<view class="more">更多</view>
			<view class="card_item">
				<image src="../../static/images/test.png" class="card_pic"></image>
				<view class="card_inner">
					<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
					<view class="card_others">
						<view class="tags">
							<text class="tags_text">旅行</text>
							<text class="tags_text">游记</text>
						</view>
						<text class="time">2018/10/12</text>
					</view>
				</view>
			</view>
			<view class="card_item">
				<image src="../../static/images/test.png" class="card_pic"></image>
				<view class="card_inner">
					<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
					<view class="card_others">
						<view class="tags">
							<text class="tags_text">旅行</text>
						</view>
						<text class="time">2018/10/12</text>
					</view>
				</view>
			</view>
			<view class="card_item">
				<view class="card_inner">
					<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
					<view class="card_others">
						<view class="tags">
							<text class="tags_text">旅行</text>
							<text class="tags_text">旅行</text>
							<text class="tags_text">旅行</text>
							<text class="tags_text">旅行</text>
							<text class="tags_text">旅行</text>
						</view>
						<text class="time">2018/10/12</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import moduleLink from '@/common/moduleLink.js'
	export default {
		data() {
			return {
				basicFuncList: [{
					id: -1,
					name: '更多',
					icon: '../../static/images/icon_func_0.png'
				}],
				userId: -1,
				personInfo: {
					id: -1,
					headUrl: '../../static/images/test.png',
					name: '',
					birth: '',
					birthPlace: '',
					nationality: '',
					career: ''
				}
			}
		},
		onLoad: function(option) {
			this.userId = option.userId;
			this.loadModule(option.userId);
			this.loadUserInfo(option.userId);
		},
		methods: {
			jumpToList: function(moduleId) {
				let linkUrl = moduleLink[moduleId];
				switch (moduleId) {
					case 1:
						linkUrl = linkUrl + '?id=' + this.personInfo.id;
						break;
					default:
						linkUrl = linkUrl + '?userId=' + this.userId + '&moduleId=' + moduleId;
				}
				uni.navigateTo({
					url: linkUrl
				});
			},
			loadModule: function(userId) {
				this.$http.get('module/user/all', {
					'isFamily': 1,
					'language': this.$common.language,
					'userId': userId
				}).then((res) => {
					if (res.data.code === 200) {
						this.basicFuncList = res.data.data.module;
						this.basicFuncList.push({
							id: 0,
							name: '更多',
							icon: '../../static/images/icon_func_0.png'
						})
					} else {
						uni.showToast({
							title: '模块信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			loadUserInfo: function(userId) {
				this.$http.get('base/selectBase', {
					'language': this.$common.language,
					'userId': userId
				}).then((res) => {
					if (res.data.code === 200) {
						util.loadObj(this.personInfo, res.data.data.baseInfo);
					} else {
						uni.showToast({
							title: '人物信息加载失败',
							icon: 'none'
						});
					}
				})
			}
		}
	}
</script>

<style>
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
		height: 50px;
	}

	.person_name {
		font-size: 18px;
		color: #999;
	}

	.person_name_active {
		color: #333;
		font-weight: 600;
	}

	.tab_line {
		width: 70px;
		height: 1px;
		background-color: #4DC578;
		margin: 0 auto;
		margin-top: 14px;
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
		margin-top: 20px;
	}

	.func_wrapper {
		display: flex;
		flex-direction: column;
		width: 20%;
		height: 94px;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.pic_menu {
		width: 44px;
		height: 44px;
	}

	.pic_opt {
		width: 20px;
		height: 20px;
		position: absolute;
		top: 4px;
		right: 3%;
	}

	.explain {
		margin-top: 30px;
		margin-bottom: 34px;
		font-size: 13px;
		color: #999;
		text-align: center;
	}

	.text {
		margin-top: 8px;
		font-size: 13px;
		color: #333;
	}

	.person_intro {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin-top: 26px;
	}

	.name {
		font-size: 21px;
		color: #333;
		font-weight: 600;
		margin-top: 5px;
	}

	.other_info_container {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		margin-left: 15px;
		margin-right: 15px;
	}

	.other_info {
		margin-top: 18px;
		font-size: 14px;
		color: #333;
	}
</style>
