<template>
	<view>
		<view class="container">
			<view class="wrapper" v-for="(basicFunc, i) in basicFuncList" v-bind:key="basicFunc.id" @tap="jumpToList(basicFunc)">
				<image class="pic_menu" :src="basicFunc.icon"></image>
				<text class="text">{{basicFunc.name}}</text>
				<image v-if="isEdit" src="../../static/images/icon_menu_delete.png" class="pic_opt" @tap="removeFunc(basicFunc.id)"></image>
			</view>
		</view>
		<view class="explain" style="">
			<text>以下功能最多展示在首页（9个）</text>
		</view>
		<view class="container">
			<view class="wrapper" v-for="(otherFunc, i) in otherFuncList" v-bind:key="otherFunc.id" @tap="jumpToList(otherFunc)">
				<image class="pic_menu" :src="otherFunc.icon"></image>
				<text class="text">{{otherFunc.name}}</text>
				<image v-if="isEdit" src="../../static/images/icon_menu_add.png" class="pic_opt" @tap="addFunc(otherFunc.id)"></image>
			</view>
		</view>
		<!-- <navigator url="/pages/login/login" hover-class="navigator-hover">aaa</navigator> -->
		<!-- <button type="primary"  @tap="save">保存</button> -->
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import moduleLink from '@/common/moduleLink.js';
	export default {
		data() {
			return {
				param: {
					userId: null,
					isFamily: 1,
					language: null,
					familyId:null,
				},
				personId: null,
				basicFuncList: [],
				otherFuncList: [],
				isEdit: false
			}
		},
		onLoad: function(options) {
			this.personId=options.personId;
			util.loadObj(this.param, options);
			this.loadUserModule(options.userId);
		},
		methods: {
			loadUserModule: function(userId) {
				this.$http.get('module/user/all', {
					'isFamily': this.param.isFamily,
					'language': this.param.language,
					'userId': userId
				}).then((res) => {
					if (res.data.code === 200) {
						this.basicFuncList = res.data.data.module;
						this.loadAllModule();
					} else {
						uni.showToast({
							title: '用户模块信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			loadAllModule: function() {
				this.$http.get('module/all', {
					'isFamily': this.param.isFamily,
					'language': this.param.language
				}).then((res) => {
					if (res.data.code === 200) {
						let _list = res.data.data.module;
						for (var i = _list.length - 1; i >= 0; i--) {
							var idx = this.basicFuncList.findIndex((item) => {
								if (item.id === _list[i].id) {
									return true;
								}
							});
							if (idx >= 0) {
								_list.splice(i, 1);
							}
						}
						this.otherFuncList = _list;
					} else {
						uni.showToast({
							title: '模块信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			removeFunc: function(moduleId) {
				var idx = this.basicFuncList.findIndex((item) => item.id === moduleId);
				var mod = this.basicFuncList[idx];
				this.basicFuncList.splice(idx, 1);
				this.otherFuncList.push(mod);
			},
			addFunc: function(moduleId) {
				if (this.basicFuncList.length == 9) {
					uni.showToast({
						title: '首页模块最多只能显示9个',
						icon: 'none'
					});
					return false;
				}
				var idx = this.otherFuncList.findIndex((item) => item.id === moduleId);
				var mod = this.otherFuncList[idx];
				this.otherFuncList.splice(idx, 1);
				this.basicFuncList.push(mod);
			},
			save: function() {
				var moduleIds = this.basicFuncList.map((item) => item.id + '@' + item.sort)
				this.$http.post('module/edit', {
					moduleIds: moduleIds.join(','),
					language: this.param.language,
					userId: this.param.userId,
					isFamily: this.param.isFamily
				}).then((res) => {
					if (res.data.code === 200) {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				})
			},
			jumpToList: function(module) {
				if(this.isEdit) return
				let linkUrl = moduleLink.linkUrl[module.id];
				if (!linkUrl) {
					uni.showToast({
						title: '正在开发中...',
						icon: 'none'
					});
					return false
				}
				switch (module.id) {
					case 1:
						linkUrl = linkUrl + util.jsonToQuery({
							userId:this.param.userId,
							language:this.param.language
						});
						break;
					case 21:
						linkUrl = linkUrl + util.jsonToQuery({
							familyId:this.param.familyId,
							language: this.param.language
						});
						break;
					case 33:
						linkUrl = linkUrl + util.jsonToQuery({
							userId:this.param.userId,
							language: this.param.language
						});
						break;
					default:
						linkUrl = linkUrl + util.jsonToQuery({
							userId: this.param.userId,
							moduleId: module.id,
							flag: moduleLink.linkFlag(module.id),
							name: module.name,
							language: this.param.language,
							isFamily: this.param.isFamily
						});
				}
				uni.navigateTo({
					url: linkUrl
				});
			}
		},
		onNavigationBarButtonTap(event) {
			const buttonIndex = event.index;
			if (buttonIndex === 0) {
				if(this.isEdit){
					this.save();
				}
				this.isEdit = !this.isEdit;
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				let titleObj = currentWebview.getStyle().titleNView;
				if (!titleObj.buttons) {
					return;
				}
				if (titleObj.buttons[0].text == '编辑') {
					titleObj.buttons[0].text = "完成";
				} else {
					titleObj.buttons[0].text = "编辑";
					// 这里保存编辑的内容
					
				}
				currentWebview.setStyle({
					titleNView: titleObj
				});
				// #endif
			}
		},
	}
</script>

<style lang="less" scoped>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		width: 19.5%;
		height: 180upx;
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
		top: 7upx;
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
</style>
