<template>
	<view class="tree-container">
		<view class="user-super-container">
			<!-- 画当前节点 -->
			<view class="user-wife-container">
				<!-- 有妻子 有儿子的情况下 给当前节点添加22.5upx的右侧内边距-->
				<view class="user-container" :style="{'padding-right':dataSource.spouseTreeDto && dataSource.childTreeDto.length ? '22.5upx' : '0'}">
					<!-- 每个子节点头部画一个垂直的线  根节点除外 -->
					<view v-if="!isRoot" class="vertical-line" />
					<!-- 用户信息 -->
					<view class="user-info" :class="{'user-selected':dataSource.isself}" @tap="itemClick(dataSource)">
						<image class="user-avatar" :src="dataSource.headUrl ? (prefixUrl+dataSource.headUrl) : (dataSource.sex == 1 ? manUrl : womanUrl)" />
						<view class='user-name'>
							<view class="user-name-text">{{dataSource.name}}</view>
						</view>
					</view>
					<!-- 如果当前节点有儿子 有妻子 在节点下方画一条垂直的线 -->
					<view v-if="dataSource.childTreeDto.length && dataSource.spouseTreeDto" class="vertical-line" />
				</view>

				<!-- 处理配偶 -->
				<!-- 如果有配偶 没儿子  则画一根水平线关联夫妻关系 -->
				<view v-if="!dataSource.childTreeDto.length && dataSource.spouseTreeDto" class="horizontal-line" style="width:35upx;margin-left:5upx;margin-right:5upx;" />

				<!-- 有妻子 没有儿子的情况下 给当前配偶节点添加22.5upx的左侧内边距-->
				<view v-if="dataSource.spouseTreeDto" class="user-container" :style="{'padding-left':dataSource.spouseTreeDto && dataSource.childTreeDto.length?'22.5upx':'0'}">
					<!-- 每个子节点头部画一个垂直的线 由于是配偶  要透明处理 -->
					<view v-if="!isRoot" class="vertical-line" style="background-color:rgba(0,0,0,0)" />
					<!-- 用户信息 -->
					<view class="user-info" :class="{'user-selected':dataSource.isself}" @tap="itemClick(dataSource.spouseTreeDto)">
						<image class="user-avatar" :src="dataSource.headUrl ? (prefixUrl+dataSource.headUrl) : (dataSource.spouseTreeDto.sex == 1 ? manUrl : womanUrl)" />

						<view class="user-name">
							<view class="user-name-text">{{dataSource.spouseTreeDto.name}}</view>
						</view>
					</view>

					<!-- 如果当前节点有儿子 在配偶下方画一条垂直的线 -->
					<view v-if="dataSource.childTreeDto.length" class="vertical-line" />
				</view>
			</view>
			<!-- 如果当前节点有儿子并且有配偶 在夫妻下方画一条水平的线 并设置左下 右下圆角 -->
			<view v-if="dataSource.childTreeDto.length && dataSource.spouseTreeDto" class="horizontal-line left-bottom-radius right-bottom-radius" />
		</view>

		<!-- 有多个儿子 先要画一条垂直的线 再画一条水平的线 -->
		<view v-if=" dataSource.childTreeDto && dataSource.childTreeDto.length > 1" class="vertical-line" />

		<!-- 渲染子节点 如果他的下级最后一个子节点有配偶 则下级的整个布局向右移动144upx -->
		<view v-if="dataSource.childTreeDto.length" class="children-container" :style="{'margin-left':dataSource.childTreeDto[dataSource.childTreeDto.length-1].spouseTreeDto?'144upx':'0'}">
			<view v-for="(item,index) in dataSource.childTreeDto" :key="index">
				<view class="children-super">
					<view v-if="dataSource.childTreeDto.length > 1" style="width:100%;">
						<!-- 第一个的情况 -->
						<view v-if="index==0" :class="['horizontal-line','left-top-radius',{'first-wife-line':item.spouseTreeDto,'first-line':!item.spouseTreeDto }]" />
						<!-- 最后一个 -->
						<view v-else-if="index==dataSource.childTreeDto.length-1" :class="['horizontal-line','right-top-radius',{'last-wife-line':item.spouseTreeDto,'last-line':!item.spouseTreeDto }]" />
						<!-- 中间的 -->
						<view v-else class="horizontal-line" style="width:100%" />
					</view>
					<tree-chart :dataSource="item" @openBtn="openBtn" />
				</view>
			</view>
		</view>

	</view>

</template>

<script>
	export default {
		name: 'tree-chart',
		props: {
			dataSource: Object,
			isRoot: Boolean
		},
		data() {
			return {
				prefixUrl: this.$common.picPrefix(),
				womanUrl: '../../static/images/icon_default_woman.png',
				manUrl: '../../static/images/icon_default_man.png',
				targetData: null
			}
		},
		methods: {
			itemClick: function(target) {
				// #ifdef APP-PLUS
				if(target.id){
					uni.setStorageSync('selNode',target)
				}
				// #endif
				this.$emit('openBtn', target)
			},
			openBtn: function(e) {
				// console.log(data)
				this.itemClick(e)
			}
		}
	}
</script>

<style>
	.tree-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-super-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-wife-container {
		display: flex;
		align-items: center;
		padding-left: 22.5upx;
		padding-right: 22.5upx;
	}

	.user-container {
		width: 96upx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-info {
		overflow: hidden;
	}

	.user-avatar {
		margin-top: 5upx;
		height: 96upx;
		width: 96upx;
		display: block;
		border-radius: 50%;
		background-color: white;
	}

	.user-name {
		width: 96upx;
		height: 32upx;
		border-radius: 4upx;
		background-color: #bbb;
		display: flex;
		margin-top: 12upx;
		margin-bottom: 5upx;
	}

	.user-name-text {
		font-size: 20upx;
		width: 80upx;
		margin-left: 2upx;
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		align-content: center;
	}

	.user-sex {
		height: 12upx;
		width: 14upx;
	}

	.user-self {
		color: white;
		background-color: #c69b2f;
	}

	.user-selected {
		border: 2px solid #FF0000;
	}

	.vertical-line {
		height: 25upx;
		width: 4upx;
		background-color: #999;
	}

	.horizontal-line {
		width: calc(50% + 4upx);
		height: 4upx;
		background-color: #999;
	}

	.left-bottom-radius {
		border-bottom-left-radius: 2upx;
	}

	.right-bottom-radius {
		border-bottom-right-radius: 2upx;
	}

	.left-top-radius {
		border-top-left-radius: 2upx;
	}

	.right-top-radius {
		border-top-right-radius: 2upx;
	}

	.children-container {
		display: flex;
		flex-direction: row;
	}

	.children-super {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.first-wife-line {
		width: calc(50% + 22.5upx + 50upx);
		margin-left: calc(50% - 22.5upx - 50upx);
	}

	.first-line {
		width: calc(50% + 2upx);
		margin-left: calc(50% - 2upx);
	}

	.last-wife-line {
		width: calc(50% - 22.5upx - 46upx);
		margin-right: calc(50% + 22.5upx + 46upx);
	}

	.last-line {
		width: calc(50% + 2upx);
		margin-right: calc(50% - 2upx);
	}

	.placeholder-view {
		width: 125upx;
		background-color: white;
	}
</style>
