<template>
	<view>
		<view class="container">
			<view class="wrapper" v-for="(basicFunc, i) in basicFuncList">
				<image class="pic_menu" :src="basicFunc.icon"></image>
				<text class="text">{{basicFunc.name}}</text>
				<image src="../../static/images/icon_menu_delete.png" class="pic_opt" @tap="removeFunc(basicFunc.id)"></image>
			</view>
		</view>
		<view class="explain" style="">
			<text>以下功能最多展示在首页（9个）</text>
		</view>
		<view class="container">
			<view class="wrapper" v-for="(otherFunc, i) in otherFuncList">
				<image class="pic_menu" :src="otherFunc.icon"></image>
				<text class="text">{{otherFunc.name}}</text>
				<image src="../../static/images/icon_menu_add.png" class="pic_opt" @tap="addFunc(otherFunc.id)"></image>
			</view>
		</view>
		<!-- <navigator url="/pages/login/login" hover-class="navigator-hover">aaa</navigator> -->
		<button type="primary"  @tap="save">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: null,
				basicFuncList: [],
				otherFuncList: []
			}
		},
		onLoad: function(option) {
			this.userId = option.userId;
			this.loadUserModule(option.userId);
		},
		methods: {
			loadUserModule: function(userId) {
				this.$api.getByToken('module/user/all', {
					'isFamily': 1,
					'language': this.$common.language,
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
				this.$api.getByToken('module/all', {
					'isFamily': 1,
					'language': this.$common.language
				}).then((res) => {
					if (res.data.code === 200) {
						let _list = res.data.data.module;
						for(var i=_list.length-1;i>=0;i--){
							var idx = this.basicFuncList.findIndex((item)=>{
									if(item.id===_list[i].id){
										return true;
									}
								});
							if(idx>=0){
								_list.splice(i,1);
							}
						}
						this.otherFuncList=_list;
					} else {
						uni.showToast({
							title: '模块信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			removeFunc:function(moduleId){
				var idx = this.basicFuncList.findIndex((item)=>item.id===moduleId);
				var mod = this.basicFuncList[idx];
				this.basicFuncList.splice(idx, 1);
				this.otherFuncList.push(mod);
			},
			addFunc:function(moduleId){
				if(this.basicFuncList.length==9){
					uni.showToast({
						title: '首页模块最多只能显示9个',icon:'none'
					});
					return false;
				}
				var idx = this.otherFuncList.findIndex((item)=>item.id===moduleId);
				var mod = this.otherFuncList[idx];
				this.otherFuncList.splice(idx, 1);
				this.basicFuncList.push(mod);
			},
			save:function(){
				var moduleIds = this.basicFuncList.map((item)=>item.id+'@'+item.sort)
				this.$api.postByToken('module/edit',{
					moduleIds:moduleIds.join(','),
					language: this.$common.language,
					userId: this.userId,
					isFamily: 1
				}).then((res)=>{
					if(res.data.code===200){
						uni.showToast({
							title: '保存成功',icon:'none'
						});
					}else{
						uni.showToast({
							title: '保存失败', icon:'none'
						});
					}
				})
			}
		}
	}
</script>

<style>
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
</style>
