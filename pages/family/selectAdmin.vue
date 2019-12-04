<template>
	<view class="container">
		<uni-search-bar :radius="100" class="search_info" @confirm="search" />
		<view class="clan_set_item" v-for="(admin,index) in adminList" v-bind:key="admin.id">
			<view class="inner_set"   @tap="selectItem(index)">
				<image :src="admin.headUrl?(prefixUrl+admin.headUrl):defaultUrl" class="avatar"></image>
				<text>{{admin.familyCreator}}</text>
			</view>
			<image src="../../static/images/arrow.png" class="clear" :style="{'display': admin.isChecked ? 'block': 'none'}"></image>
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar';
	import util from '@/common/util.js'
	export default {
		components: {
			uniSearchBar
		},
		data() {
			return {
				param: {
					familyId: null,
					language: null
				},
				isEdit: false,
				prefixUrl: this.$common.picPrefix(),
				defaultUrl: '../../../static/images/avatar.png',
				adminList: [{
					id: 1,
					avatar: '../../../static/images/avatar.png',
					name: 'admin one',
					isChecked: false
				}, {
					id: 2,
					avatar: '../../../static/images/avatar.png',
					name: 'admin two',
					isChecked: true
				}, {
					id: 3,
					avatar: '../../../static/images/avatar.png',
					name: 'admin three',
					isChecked: false
				}]
			}
		},
		onLoad: function(options) {
			util.loadObj(this.param, options)
			this.loadData(null)
		},
		methods: {
			selectItem: function(idx) {
				this.$forceUpdate();
				this.$set(this.adminList[idx], 'isChecked', !this.adminList[idx].isChecked);
			},
			loadData: function(name) {
				let postParam = {
					familyId: this.param.familyId,
					flag: 'admin',
					language: this.param.language
				}
				if (name) {
					postParam['name'] = name
				}
				this.$http.get('familyAdmin/familyUserLikeList', postParam).then(res => {
					if (res.data.code === 200) {
						this.adminList = res.data.data.familyUserList
						for (let i = 0; i < this.adminList.length; i++) {
							this.adminList[i].isChecked = false
						}
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			search: function(e) {
				this.loadData(e.value)
			},
			saveSelect:function(){
				let idx = []
				for(let i=0;i<this.adminList.length;i++){
					if(this.adminList[i].isChecked){
						idx.push(this.adminList[i].familyUserId)
					}
				}
				if(!idx.length) return
				this.$http.post('familyAdmin/updateFamilyAdmin',{
					familyUserIds:idx.join(','),
					flag:'add',
					language:this.param.language,
					familyId:this.param.familyId
				}).then(res=>{
					if(res.data.code===200){
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({
							title: '保存失败',icon:'none'
						});
					}
				})
			}
		},
		onNavigationBarButtonTap(event) {
			console.log(event);
			const buttonIndex = event.index;

			if (buttonIndex === 0) {
				console.log(event.text);
				this.edit = !this.edit;

				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				let titleObj = currentWebview.getStyle().titleNView;
				console.log(1);
				console.log(JSON.stringify(titleObj.buttons[0]));
				if (!titleObj.buttons) {
					return;
				}
				if (titleObj.buttons[0].text == '编辑') {
					titleObj.buttons[0].text = "完成";
				} else {
					titleObj.buttons[0].text = "编辑";
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
	page{
		border-top: 1px solid #e5e5e5;
	}
	.container {
		background-color: #fcfcfc;
	}

	.clan_set_item {
		padding-left: 30upx;
		padding-right: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 106upx;
		line-height: 106upx;
		background-color: #fff;

		&.spec {
			justify-content: flex-start;
		}

		.input {
			font-size: 34upx;
			color: #303641;
			flex: 1;
			text-align: left;
		}

		text {
			font-size: 31upx;
			color: #333;

			&.label {
				margin-right: 52upx;
			}
		}

		image.avatar {
			width: 65upx;
			height: 65upx;
			margin-right: 52upx;
			vertical-align: middle;
		}

		image.clear {
			width: 30upx;
			height: 30upx;
		}

		.inner_set {
			align-self: center;
			flex:1;
		}
	}

	.search_info {
		margin-top: 40upx;
		margin-bottom: 40upx;
		height: 68upx;
	}
</style>
