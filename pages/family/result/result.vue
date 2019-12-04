<template>
	<view class="container_pd">
		<!-- <uni-search-bar :radius="100" class="search_info" @confirm="search" /> -->
		<view class="clan_result_container" v-for="(clan,index) in dataList" @tap="viewDetail(clan)">
			<view class="clan_hd">
				<image :src="clan.headUrl"></image>
				<text>{{clan.name}}</text>
			</view>
			<view class="clan_item">
				<view>出生年月： {{clan.birth | formatDate}}</view>
				<view>职业： {{clan.createBy | nullFilter}}</view>
			</view>
			<view class="clan_item">
				<view>出生地：{{clan.birthPlace | nullFilter}}</view>
				<view>居住省市： {{clan.updateBy | nullFilter}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar';
	import util from '@/common/util.js';
	export default {
		data() {
			return {
				param:{
					familyId:null,
					language:null,
					userId:null
				},
				clanList:[],
				suffixUrl: '&style=image/resize,m_fill,w_48,h_48'

			}
		},
		computed:{
			dataList:function(){
				if(!this.clanList.length)return [];
				for(let i=0;i<this.clanList.length;i++){
					if(this.clanList[i].headUrl){
						this.clanList[i].headUrl=this.$common.picPrefix()+this.clanList[i].headUrl+this.suffixUrl;
					}else{
						this.clanList[i].headUrl='../../../static/images/avatar.png'
					}
				}
				return this.clanList
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return '请选择'
				return util.dateFormat(value,'yyyy年MM月dd日')
			},
			nullFilter:function(value){
				if(!value) return ''
				return value
			}
		},
		components:{uniSearchBar},
		onLoad:function(options){
			util.loadObj(this.param,options)
			this.loadData()
		},
		methods: {
			loadData:function(){
				this.$http.post('familyUser/familyUserList',{
					familyId:this.param.familyId,
					language:this.param.language,
					page:1,
					rows:10
				}).then(res=>{
					if(res.data.code===200){
						this.clanList=res.data.data.familyUserList
					}else{
						uni.showToast({
							title:'加载失败',icon:'none'
						})
					}
				})
			},
			search:function(e){
				
				this.$http.get('familyAdmin/familyUserLikeList',{
					familyId:this.param.familyId,
					flag:'clan',
					language:this.param.language,
					name:e.value
				}).then(res=>{
					if(res.data.code===200){
						this.clanList=res.data.data.familyUserList
					}else{
						uni.showToast({
							title:'查询失败',icon:'none'
						})
					}
				})
			},
			viewDetail:function(item){
				uni.navigateTo({
					url:'../person/info'+util.jsonToQuery({
						familyId:this.param.familyId,
						familyUserId:item.id,
						userId:this.param.userId,
						language:this.param.language
					})
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		border-top: 1px solid #e5e5e5;
	}
	.container_pd {
		padding: 34upx;
		padding-top: 0;
	}

	.clan_result_container {
		border-radius: 15upx;
		padding: 30upx;
		box-shadow: 2upx 0 18upx #E5E5E5;
		margin-top: 40upx;

		.clan_hd {
			display: flex;
			flex-direction: row;
			align-items: center;

			image {
				width: 92upx;
				height: 92upx;
				border-radius: 50%;
			}

			text {
				font-size: 35upx;
				color: #333;
				font-weight: 700;
				margin-left: 24upx;
			}
		}

		.clan_item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			font-size: 27upx;
			color: #333;
			margin-top: 30upx;
			margin-bottom: 15upx;
		}
	}
</style>
