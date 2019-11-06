<template>
	<view>
		<view class="status_bar"></view>

		<view class="family_select_container">
			<view @tap="tabSelect">
				<text>家族</text>
				<image src="../../../static/images/arrow.png"></image>
			</view>

			<view class="inner_select" :style="{'display': showSelect ? 'block' : 'none'}">
				<view class="active">万少波的家族树</view>
				<view>万氏家族</view>
			</view>
		</view>

		<view class="func_container" style="margin-top: 38upx;">
			<view class="func_wrapper" v-for="(familyFunc,index) in familyFuncList" @tap="jumpToList(familyFunc.url)">
				<image class="pic_menu" :src="familyFunc.pic"></image>
				<text class="text">{{familyFunc.name}}</text>
			</view>
		</view>

		<view class="family_training_container">
			<view class="title">家训</view>
			<view class="content">
				夫君子之行，静以修身，俭以养德。非淡泊无以明志，非宁静无以致远。夫学须静也，才须学也，非学无以广才，非志无以成学。淫慢则不能励
			</view>
		</view>

		<view class="card_list">
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
		</view>

	</view>

</template>

<script>
	export default {
		onLoad: function() {},
		data() {
			return {
				showSelect: false,
				familyFuncList: [{
						id: 1,
						name: '族谱图',
						pic: '../../../static/images/icon_func_1.png'
					}, {
						id: 2,
						name: '成员列表',
						pic: '../../../static/images/icon_func_2.png'
					},
					{
						id: 3,
						name: '大事记',
						pic: '../../../static/images/icon_func_3.png'
					},
					{
						id: 4,
						name: '族群协商',
						pic: '../../../static/images/icon_func_4.png'
					},
					{
						id: 5,
						name: '照片视频',
						pic: '../../../static/images/icon_func_5.png'
					},
					{
						id: 6,
						name: '撰写家训',
						pic: '../../../static/images/icon_func_6.png'
					},
					{
						id: 7,
						name: '家族设置',
						pic: '../../../static/images/icon_func_7.png'
					},
					{
						id: 8,
						name: '传承',
						pic: '../../../static/images/icon_func_8.png'
					},
					{
						id: 9,
						name: '亡故',
						pic: '../../../static/images/icon_func_9.png'
					},
					{
						id: 10,
						name: '更多',
						pic: '../../../static/images/icon_func_0.png'
					}
				],
				testInfoList: [{
					id: 1,
					content: '这是一则很重要的新闻，欢迎大家',
					pic: '../../../static/images/icon_func_1.png',
				}, {
					id: 2,
					content: '这是一则很重要的新闻，欢迎大家',
					pic: '../../../static/images/icon_func_2.png',
				}, {
					id: 3,
					content: '超级长的故，这是一则很重要的新闻，欢迎大家,超级长的故事',
					pic: '',
				}]
			}
		},
		components: {},
		methods: {
			jumpToList: function(url) {
				uni.navigateTo({
					url: url
				});
			},
			jumpToAll: function() {
				// uni.navigateTo({
				// 	url: '/pages/all/all'
				// });
			},
			tabSelect: function() {
				this.showSelect = !this.showSelect;
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../../common/card.less';

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
