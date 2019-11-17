<template>
	<view class="">
		<view class="status_bar"></view>
		<view style="position:relative">
			<myTab :tabList="moduleList" @tabSelect="tabSelect" :tabActiveIdx="tabActiveIdx" />
		</view>
		<view class="media_list" v-for="(media,index1) in mediaList">
			<view class="date" style="">{{media.date}}</view>
			<view class="container">
				<view v-for="(item,index2) in media.list" class="item">
					<!-- <video
					id='myvideo'
					@fullscreenchange="screenchange"
					src="https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4"
					                   @tap="setFullScreen"
										></video> -->
					<image :src="item.resourceUrl" @tap="previewImage(index1,index2)"></image>
					<image class="del" src="../../static/images/icon_delete.png" :style="{display:edit?'block':'none'}" @tap="delItem(item,index1,index2)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import myTab from '@/components/xyz-tab';
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					language: null,
					isFamily: null
				},
				moduleList: [],
				tabActiveIdx: 0,
				modId: 0,
				mediaList: [],
				edit: false
			}
		},
		components: {
			myTab
		},
		computed: {

		},
		onLoad: function(options) {
			util.loadObj(this.param, options)
			this.loadModule()
			this.loadContent()
		},
		onNavigationBarButtonTap(e) {
			const buttonIndex = e.index;
			if (buttonIndex === 0) {
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
		methods: {
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			previewImage: function(index1, index2) {
				let _mediaList = this.mediaList[index1];
				// console.log(_mediaList[index1].list[index2]);
				let imgs = _mediaList.list.map((item) => item.resourceUrl);
				uni.previewImage({
					urls: imgs,
					current: imgs[index2]
				});
			},
			setFullScreen(e) {
				this.videoContext = uni.createVideoContext('myvideo');
				console.log(this.videoContext);
				this.videoContext.requestFullScreen();
			},
			screenchange(e) {
				// 监听视频的全屏和退出全屏
				this.$emit('schange', e.detail.fullScreen)
			},
			delItem: function(item, index1, index2) {
				let self = this
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					success: function(res) {
						if (res.confirm) {
							self.$http.post('resource/delete',{
								resourceId: item.id,
								language: self.param.language
							}).then(res=>{
								if(res.data.code===200){
									self.mediaList[index1].list.splice(index2,1)
								}else{
									uni.showToast({
										title: '删除失败',icon:'none'
									});
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			loadModule: function() {
				this.$http.get('module/all', {
						isFamily: this.param.isFamily,
						language: this.param.language
					})
					.then(res => {
						if (res.data.code === 200) {
							let _list = res.data.data.module;
							//删除个人照片模块
							let idx = _list.findIndex((item, i) => {
								return item.id === 5
							})
							_list.splice(idx, 1)
							//删除族谱照片模块
							idx = _list.findIndex((item, i) => {
								return item.id === 34
							})
							_list.splice(idx, 1)
							this.moduleList = util.objectTransfer(_list, ['id', 'name'], ['id', 'label']);
							this.moduleList.unshift({
								id: 0,
								label: '全部'
							})
						} else {
							uni.showToast({
								title: '模块信息加载失败',
								icon: 'none'
							});
						}
					});
			},
			tabSelect(idx) {
				this.tabActiveIdx = idx;
				this.modId = this.moduleList[idx].id;
				this.loadContent();
			},
			loadContent: function() {
				let postParam = {
					userId: this.param.userId,
					page: 1,
					rows: 10,
					language: this.param.language,
					isFamily: this.param.isFamily
				}
				if (this.modId) {
					postParam['moduleId'] = this.modId
				}
				this.$http.get('resource/query', postParam).then((res) => {
					if (res.data.code === 200) {
						let _list = res.data.data.resourceList;
						let picObj = {};
						for (let i = 0; i < _list.length; i++) {
							let dt = util.dateFormat(_list[i].createDate, 'MM月dd日')
							_list[i].resourceUrl = this.$common.picPrefix() + _list[i].resourceUrl
							if (!picObj[dt]) picObj[dt] = [];
							picObj[dt].push(_list[i]);
						}
						this.mediaList = [];
						for (let j in picObj) {
							this.mediaList.push({
								date: j,
								list: picObj[j]
							})
						}
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../common/card.less';

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.video_tabs {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 96upx;

		.item {
			color: #000;
			font-size: 31upx;
			padding-bottom: 30upx;
			border-bottom-color: #fff;
			border-bottom-width: 1px;
			border-bottom-style: solid;


			&.active {
				color: #4DC578;
				border-bottom-color: #4DC578;
			}

		}
	}

	.media_list {
		.date {
			margin-top: 38upx;
			margin-bottom: 17upx;
			color: #333;
			font-size: 31upx;
			padding-left: 24upx;
		}

		.container {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;

			.item {
				display: flex;
				flex-direction: column;
				width: 25%;
				justify-content: center;
				align-items: center;
				position: relative;
			}

			.del {
				width: 40upx;
				height: 40upx;
				position: absolute;
				top: 0;
				right: 16upx;
			}

			image,
			video {
				width: 160upx;
				height: 160upx;
			}

		}
	}
</style>
