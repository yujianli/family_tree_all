<template>
	<view>
		<view class="detail_container">
			<view class="detail_hd">
				<view>{{content.time | formatDate}}</view>
				<view>{{content.position | nullFilter}}</view>
				<view v-if="param.moduleId==='30'">{{content.weather}}</view>
				<view v-if="ctrlEnable.typeCtrl">{{content.categoryName}}</view>
				<view v-if="ctrlEnable.stageCtrl">{{content.periodName}}</view>
				<view v-if="ctrlEnable.placeCtrl">{{content.address}}</view>
				<view v-if="ctrlEnable.weatherCtrl">{{content.weather}}</view>
			</view>
			<view class="detail_content">
				<view>
					{{content.content}}
				</view>
				<view v-for="(pic,i) in images" v-bind:key="pic">
					<image :src="pic" class="detail_pic"></image>
				</view>
			</view>
			<view class="detail_tag">
				<image v-if="tagList.length" src="../../static/images/icon_tag.png" class="icon_tags"></image>
				<view class="tags_text" v-for="(tag,index) in tagList">{{tag}}</view>
			</view>
			<view class="detail_tag">
				<image v-if="associateList.length" src="../../static/images/icon_relation.png" class="icon_tags"></image>
				<view class="tags_text" v-for="(associate,index) in associateList">{{associate}}</view>
			</view>
		</view>
		<view class="detail_opt_container">
			<button class="detail_opt_btn" @tap="previousClick">{{i18n.previous}}</button>
			<button class="detail_opt_btn" @tap="nextClick">{{i18n.next}}</button>
		</view>
	</view>


</template>

<script>
	import util from '@/common/util.js'
	import config from '@/common/componetConfig.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					contentId: null,
					flag: null,
					name: null,
					language: null,
					isFamily: null
				},
				ctrlEnable: {
					typeCtrl: true,
					stageCtrl: false,
					placeCtrl: false,
					weatherCtrl: false
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
					periodStartTime: '',
					periodEndTime: '',
					periodName: null,
					address:null,
					time: null
				},
				suffixUrl: '&style=image/resize,m_fill,w_355,h_240'
			}
		},
		computed: {
			i18n() {
				return this.$t('btnText')
			},
			tagList:function(){
				if(!this.content.tags)return []
				return this.content.tags.split(',')
			},
			associateList:function(){
				if(!this.content.associatedPerson)return []
				return this.content.associatedPerson.split(',')
			},
			images: function() {
				if (!this.content.imageUrls) return [];
				let imgs = this.content.imageUrls.split(',')
				for (let i = 0; i < imgs.length; i++) {
					imgs[i]=this.$common.picPrefix()+imgs[i]+this.suffixUrl
				}
				return imgs;
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return ''
				return util.dateFormat(value,'yyyy/MM/dd')
			},
			nullFilter:function(value){
				if(!value) return ''
				return value
			}
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
			util.loadObj(this.param, options)
			this.initControl(this.param.moduleId)
		},
		onShow: function() {
			this.loadDetail()
		},
		onNavigationBarButtonTap(e) {
			let url = 'edit' + util.jsonToQuery(this.param)
			uni.navigateTo({
				url: url
			})
		},
		methods: {
			initControl: function(moduleId) {
				let id = parseInt(moduleId)
				let detailConfig = config.detail;
				this.ctrlEnable.typeCtrl = detailConfig.typeCtrl.indexOf(id) >= 0;
				this.ctrlEnable.stageCtrl = detailConfig.stageCtrl.indexOf(id) >= 0;
				this.ctrlEnable.placeCtrl = detailConfig.placeCtrl.indexOf(id) >= 0;
				this.ctrlEnable.weatherCtrl = detailConfig.weatherCtrl.indexOf(id) >= 0;
			},
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
			queryNext: function(condition) {
				if (!this.content) {
					uni.showToast({title: condition==='previous'?'当前是第一条':'当前是最后一条'});
					return;
				}
				let reqParam = this.param;
				reqParam['condition'] = condition;
				console.log(this.content)
				reqParam['contentId']=this.content.id
				this.$http.get('content/nextDetail', reqParam).then((res) => {
					if (res.data.code === 200) {
						if(res.data.data.contentInfo){
							this.content = res.data.data.contentInfo
						}else{
							uni.showToast({title: condition==='previous'?'当前是第一条':'当前是最后一条'});
							return;
						}
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			nextClick: function() {
				this.queryNext('next');
			},
			previousClick: function() {
				this.queryNext('previous');
			}
		}
	}
</script>

<style lang="less" scoped>
	page{
		border-top: 1px solid #e5e5e5;
	}
	.detail_container {
		padding-left: 22upx;
		padding-right: 22upx;
		padding-bottom: 120upx;
	}

	.detail_hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 26upx;
		font-size: 28upx;
		color: #999;
	}

	.detail_content {
		font-size: 34upx;
		color: #333;
		margin-top: 28upx;
	}

	.detail_pic {
		width: 100%;
		margin-top: 20upx;
		border-radius: 8upx;
	}

	.detail_opt_container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: -8upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 98upx;
	}

	.detail_opt_btn {
		flex: 1;
		font-size: 34upx;
		color: #4DC578;
		background-color: #ffffff;
		border-radius: 0;
	}

	.detail_opt_btn:after {
		border: 0px;
	}

	.detail_opt_btn:active {
		background-color: #4DC578;
		color: #ffffff;
	}

	.detail_tag {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 24upx;
		font-size: 28upx;
		color: #56D282;

		text {
			margin-right: 12upx;
		}
	}

	.icon_tags {
		width: 38upx;
		height: 38upx;
		margin-right: 21upx;
	}
	.tags_text{
		font-size: 30upx;
		color: #56D282;
		background:#F8F8F8;
		border-radius: 20upx;
		padding:8upx 20upx;
		vertical-align: middle;
		margin-right: 14upx;
	}
</style>
