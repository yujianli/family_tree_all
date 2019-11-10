<template>
	<view class="container">
		<uni-search-bar :radius="100" class="search_info" />
		<view class="clan_set_item" v-for="(admin,index) in adminList" @tap="selectItem(index)">
			<view class="inner_set">
				<image :src="admin.avatar" class="avatar"></image>
				<text>{{admin.name}}</text>
			</view>
			<image src="../../../static/images/clear.png" class="clear" :style="{'display': admin.isChecked ? 'block': 'none'}"  ></image>
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar';
	export default {
		components: {
			uniSearchBar
		},
		data() {
			return {
				isEdit:false,
				adminList:[{
					id:1,
					avatar:'../../../static/images/avatar.png',
					name:'admin one',
					isChecked:false
					
				},{
					id:2,
					avatar:'../../../static/images/avatar.png',
					name:'admin two',
					isChecked:true
				},{
					id:3,
					avatar:'../../../static/images/avatar.png',
					name:'admin three',
					isChecked:false
				}]
			}
		},
		methods: {
			selectItem:function(idx){
				let adminList = this.adminList;
				let curAdmin = adminList[idx];
				curAdmin.isChecked = !curAdmin.isChecked;
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
				if(titleObj.buttons[0].text == '编辑'){
					titleObj.buttons[0].text = "完成";
					this.isEdit = true;
				}else{
					titleObj.buttons[0].text = "编辑";
					// 这里保存编辑的内容
					this.isEdit = false;
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
	.container{
		background-color: #fcfcfc;
	}
	.clan_set_item{
		padding-left: 30upx;padding-right: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 106upx;
		line-height: 106upx;
		background-color: #fff;
		&.spec{
			justify-content: flex-start;
		}
		.input{
			font-size: 34upx;
			color: #303641;
			flex:1;
			text-align:left;
		}
		text{
			font-size: 31upx;
			color: #333;
			&.label{
				margin-right: 52upx;
			}
		}
		image.avatar{
			width: 65upx;
			height: 65upx;
			margin-right: 52upx;
			vertical-align: middle;
		}
		image.clear{
			width: 30upx;
			height: 30upx;
		}
		.inner_set{
			align-self: center;
		}
	}
	.search_info {
		margin-top: 40upx;
		margin-bottom: 40upx;
		height: 68upx;
	}
</style>
