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
			// userId: Number,
			// isFamily: {
			// 	type: Number,
			// 	default: 1
			// },
			// personId: Number,
			// language: String
			basicFuncList:{
				type: Array,
				default: []
			}
		},
		data() {
			return {
				
			}
		},
		// created(){
		// 	this.loadModule()
		// },
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
				this.$emit('gotoList', {
					url:linkUrl,
					moduleId:module.id,
					moduleName:module.name,
					flag:moduleLink.linkFlag(module.id)
				})
			}
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
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		background: #ffffff;
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
