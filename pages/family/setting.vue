<template>
	<view class="container">
		<view class="clan_set_title">家族树名字</view>
		<view class="clan_set_item">
			<text class="label">名称</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="姓名" v-model="familyCreator.familyName" disabled="!isEdit" />
		</view>
		<view class="clan_set_title">发起人</view>
		<view class="clan_set_item spec">
			<image :src="familyCreator.headUrl?(prefixUrl+familyCreator.headUrl):defaultHeadUrl" class="avatar"></image>
			<text>{{familyCreator.familyCreatorName}}</text>
		</view>
		<view class="clan_set_title">家族树管理员</view>
		<view class="clan_set_item" v-for="(admin,index) in adminList" v-bind:key="index">
			<view class="inner_set">
				<image :src="admin.headUrl?(prefixUrl+admin.headUrl):defaultHeadUrl" class="avatar"></image>
				<text>{{admin.name}}</text>
			</view>
			<image src="../../../static/images/clear.png" class="clear" :style="{'display': isEdit ? 'block': 'none'}"  @tap="clearAdmin(index)"></image>
		</view>
		<view class="add_admin_container" v-if="isEdit" @tap="addAdmin()"><image src="../../../static/images/add.png" ></image>添加管理员</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param:{
					familyId:null,
					language:null
				},
				familyCreator:{
					familyName:'',
					familyCreatorName:'',
					headUrl:''
				},
				prefixUrl:this.$common.picPrefix(),
				defaultHeadUrl:'../../../static/images/avatar.png',
				isEdit:false,
				adminList:[{
					id:1,
					avatar:'../../../static/images/avatar.png',
					name:'admin one'
				},{
					id:2,
					avatar:'../../../static/images/avatar.png',
					name:'admin two'
				},{
					id:3,
					avatar:'../../../static/images/avatar.png',
					name:'admin three'
				}]
			}
		},
		computed:{
			
		},
		onLoad:function(options){
			util.loadObj(this.param,options)
		},
		onShow:function(){
			this.loadFamilyTree()
		},
		methods: {
			loadFamilyTree:function(){
				this.$http.get('familyAdmin/familyAdminIndex',{
					familyId:this.param.familyId,
					language:this.param.language
				}).then(res=>{
					if(res.data.code===200){
						this.familyCreator=res.data.data.familyCreator
						this.adminList=res.data.data.familyAdmin
					}else{
						uni.showToast({
							title: '加载失败',icon:'none'
						});
					}
				})
			},
			clearAdmin:function(idx){
				let adminList = this.adminList;
				uni.showModal({
				    content: '确定要删除吗？',
					confirmColor:'#4DC578',
				    success: function (res) {
				        if (res.confirm) { 
							adminList.splice(idx,1);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			addAdmin:function(){
				uni.navigateTo({
					url:'selectAdmin'+util.jsonToQuery(this.param)
				})
			}
		},
		onNavigationBarButtonTap(event) {
			const buttonIndex = event.index;
			if (buttonIndex === 0) {
				this.isEdit = !this.isEdit;
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				let titleObj = currentWebview.getStyle().titleNView;
				if (!titleObj.buttons) {
					return;
				}
				if(titleObj.buttons[0].text == '编辑'){
					titleObj.buttons[0].text = "完成";
				}else{
					titleObj.buttons[0].text = "编辑";
				}
				console.log(this.isEdit)
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
	.container{
		background-color: #fcfcfc;
	}
	.clan_set_title{
		font-size: 30upx;
		color: #9999;
		height: 77upx;
		line-height: 77upx;
		padding-left: 30upx;padding-right: 30upx;
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
	.add_admin_container{
		color: #4DC578;font-size: 31upx;text-align: center;margin-top: 58upx;
		image{
			width: 23upx;height: 23upx;margin-right: 15upx;
		}
	}
</style>
