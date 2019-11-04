<template>
	<view>
		<view class="detail_container">
			<view class="detail_hd">
				<view>{{cdate}}</view>
				<view>{{content.position}}</view>
				<view>{{content.categoryName}}</view>
			</view>
			<view class="detail_content">
				<view>
					{{content.content}}
				</view>
				<view v-for="(pic,i) in images" v-bind:key="pic">
					<image :src="pic" class="detail_pic"></image>
				</view>
<!-- 				
				<image src="../../../static/images/test.png" class="detail_pic"></image>
				<image src="../../../static/images/test.png" class="detail_pic"></image> -->
			</view>
			<view class="detail_tag">{{content.tags}}</view>
			<view class="detail_tag">{{content.associatedPerson}}</view>
		</view>
		<view class="detail_opt_container">
			<button class="detail_opt_btn active" @tap="previousClick">上一页</button>
			<button class="detail_opt_btn" @tap="nextClick">下一页</button>
		</view>
	</view>


</template>

<script>
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					contentId: null,
					flag: null,
					language: this.$common.language
				},
				content: {
					periodId: null,
					year: null,
					festival: null,
					placeId: null,
					videoUrls: null,
					userId: null,
					categoryName: null,
					content: null,
					tags: '',
					associatedPerson: '',
					imageUrls: null,
					weather: null,
					id: null,
					position: null,
					moduleId: null,
					is_my_motto: null,
					categoryId: null,
					createDate: null
				}
			}
		},
		components: {

		},
		computed: {
			cdate: function() {
				if(!this.content.createDate) return '';
				return util.dateFormat(this.content.createDate);
			},
			images: function(){
				if(!this.content.imageUrls) return [];
				return this.content.imageUrls.split(',');
			}
		},
		onLoad: function(options) {
			util.loadObj(this.param, options)
			this.loadDetail()
		},
		onNavigationBarButtonTap(e) {
			let url = 'edit' + util.jsonToQuery(this.param)
			uni.navigateTo({url: url})
		},
		methods: {
			loadDetail: function() {
				this.$http.get('content/detail', this.param).then((res) => {
					if (res.data.code === 200) {
						this.content = res.data.data.contentInfo
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			queryNext:function(condition){
				let reqParam = this.param;
				reqParam['condition']=condition;
				this.$http.get('content/nextDetail',reqParam).then((res)=>{
					if (res.data.code === 200) {
						if(!res.data.data){
							uni.showToast({
								title: '当前记录已经是第一条'
							});
							return;
						}
						this.content = res.data.data.contentInfo
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			nextClick:function(){
				this.queryNext('next');
			},
			previousClick:function(){
				this.queryNext('previous');
			}
		}
	}
</script>

<style lang="less" scoped>
	.detail_container{
		padding-left: 22upx;
		padding-right: 22upx;
		padding-bottom: 120upx;
	}
	.detail_hd{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 26upx;
		font-size: 28upx;
		color: #999;
	}
	.detail_content{
		font-size: 32upx;
		color: #333;
		margin-top: 28upx;
	}
	.detail_pic{
		width:100%;
		margin-top: 20upx;
	}
	.detail_opt_container{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 98upx;
	}
	.detail_opt_btn{
		flex:1;
		font-size:34upx;
		color: #4DC578;
		background-color: #ffffff;
		border-radius: 0;
	}	
	.detail_opt_btn:after{
		border:0px;
	}
	.detail_opt_btn.active{
		background-color: #4DC578;
		color: #ffffff;
	}
	.detail_tag{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 24upx;
		font-size: 28upx;
		color: #56D282;
		text{
			margin-right: 12upx;
		}
	}
	.icon_tags{
		width: 38upx;height: 38upx;margin-right: 21upx;
	}

</style>
