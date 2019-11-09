<template>
	<view>
		<view class="float_btn" @tap="add">+</view>
		<view class="card_list">
			<view class="card_item" v-for="(place, index) in placeList" :key="index" @tap="jumpToDetail(place.id)">
				<image :style="{ display: place.imageUrl == '' ? 'none' : 'block' }" :src="place.imageUrl" class="card_pic"></image>
				<view class="card_inner">
					<view class="card_title">{{ place.address }}</view>
					<view class="time mt20">{{place.begintime | buyDesc}}</view>
					<view class="card_others card_others_1">
						<view class="inner_flex">
							<text class="time">{{ place.endtime| saleDesc }}</text>
							<image src="../../static/images/icon_arrow_right.png" class="arrow" @tap.stop="jumpToList(place)"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					name: null,
					flag: null,
					language: null
				},
				placeList: [],
			}
		},
		filters: {
			buyDesc: function(value) {
				if (!value) return '';
				return '购买于' + util.dateFormat(value, 'yyyy年MM月dd日')
			},
			saleDesc: function(value) {
				if (!value) return '';
				let curDt = new Date().getDate();
				if (curDt >= value) return '已售出'
			}
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: options.name
			});
			util.loadObj(this.param, options);
		},
		onShow: function() {
			this.loadData()
		},
		methods: {
			jumpToDetail: function(id) {
				let _param = this.param;
				_param['id'] = id;
				uni.navigateTo({
					url: 'placeDetail' + util.jsonToQuery(_param)
				});
			},
			jumpToList: function(item) {
				let _param = this.param;
				_param['stageId'] = item.id;
				_param['stageName'] = item.address;
				uni.navigateTo({
					url: 'list' + util.jsonToQuery(_param)
				});
			},
			loadData: function() {
				this.$http.get('contentPlace/query', this.param).then(res => {
					if (res.data.code === 200) {
						this.placeList = res.data.data.contentPlaceList;
					} else {
						uni.showToast({
							title: '地点信息加载失败',
							icon: 'none'
						});
					}
				});
			},
			add: function() {
				uni.navigateTo({
					url: 'placeEdit' + util.jsonToQuery({
						userId: this.param.userId,
						moduleId: this.param.moduleId,
						name: this.param.name,
						language: this.param.language
					})
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../common/card.less';

	.search_info {
		margin-top: 40upx;
		margin-bottom: 40upx;
		height: 68upx;
	}

	.float_btn {
		width: 109upx;
		height: 109upx;
		background-color: #4dc578;
		border-radius: 50%;
		position: fixed;
		right: 41upx;
		bottom: 100upx;
		font-size: 70upx;
		line-height: 1.5;
		text-align: center;
		color: #fff;
	}
</style>
