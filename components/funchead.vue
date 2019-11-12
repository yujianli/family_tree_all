<template>
	<view class="func_container">
		<view class="func_wrapper" v-for="(basicFunc, i) in basicFuncList" v-bind:key="basicFunc.id" @tap="jumpToList(basicFunc)">
			<image class="pic_menu" :src="basicFunc.icon"></image>
			<text class="text">{{ basicFunc.name }}</text>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import moduleLink from '@/common/moduleLink.js';
	export default {
		name: 'funchead',
		props: {
			userId: Number,
			isFamily: {
				type: Number,
				default: 1
			},
			personId: Number,
			language: String
		},
		data() {
			return {
				basicFuncList: [{
					id: -1,
					name: '更多',
					icon: '../../static/images/icon_func_0.png'
				}],
			}
		},
		created(){
			this.loadModule()
		},
		methods: {
			jumpToList: function(module) {
				let linkUrl = moduleLink.linkUrl[module.id];
				if (!linkUrl) {
					uni.showToast({
						title: '正在开发中...',
						icon: 'none'
					});
					return false
				}
				switch (module.id) {
					case 0:
						linkUrl = linkUrl + util.jsonToQuery({
							userId: this.userId,
							isFamily: this.isFamily,
							language: this.language
						});
						break;
					case 1:
						linkUrl = linkUrl + '?id=' + this.personId;
						break;
					default:
						linkUrl = linkUrl + util.jsonToQuery({
							userId: this.userId,
							moduleId: module.id,
							flag: moduleLink.linkFlag(module.id),
							name: module.name,
							language: this.language
						});
				}
				uni.navigateTo({
					url: linkUrl
				});
			},
			loadModule: function() {
				this.$http.get('module/user/all', {
					isFamily: this.isFamily,
					language: this.language,
					userId: this.userId
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
		}
	}
</script>

<style>
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
	.text {
		margin-top: 16upx;
		font-size: 26upx;
		color: #333;
	}
</style>
