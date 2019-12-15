<template>
	<!--component/treechart.wxml-->
	<view>
		<!-- <view style="margin-left: 10px;font-size:28upx">当前选中人员：{{selectNode.name}}</view> -->
		<!-- <movable-area v-if="dataSource" style="height:calc(100vh - 66upx);width:100vh"> -->
		<movable-area v-if="dataSource" style="height:calc(100vh - 66upx);">
			<!-- <movable-view scale=1 direction="all" id="rootTree" style="width:100%;height:100%;justify-content: flex-start;"> -->
			<!-- :style="{'width':width == 0 ? 'auto' : width + 'px','height':height == 0 ? 'auto' : height + 'px','justify-content': 'flex-start'}" -->
			<movable-view scale=1 direction="all" id="rootTree" :x="width/3" :y="height/2">
				<tree-chart :dataSource="dataSource" :isRoot="isRoot" @openBtn="openBtnList"></tree-chart>
			</movable-view>
		</movable-area>
		<!-- 		<uni-fab :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
		 @trigger="trigger"></uni-fab> -->
		<uni-popup ref="popup" type="center" class="my_popup">
			<view class="inner_select">
				<!-- <view @tap="operate('view')">查看人员</view> -->
				<view style="color: #09BB07;" @tap="operate('add')">添加人员</view>
				<view style="color: #09BB07;" @tap="operate('edit')">修改人员</view>
				<view style="border: 14upx solid transparent;border-bottom-color:#fff; position: absolute;left: 142upx;top: -94upx;"></view>
			</view>
		</uni-popup>
	</view>

</template>

<script>
	import treeChart from '@/components/tree-chart/tree-chart';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue'
	import util from '@/common/util.js'
	const {
		windowWidth,
		windowHeight
	} = uni.getSystemInfoSync();
	export default {
		data() {
			return {
				param: {
					familyUserId: null,
					familyId: null,
					userId: null,
					language: null
				},
				// isiPhoneX: false,
				width: 0,
				height: 0,
				windowWidth: 0,
				windowHeight: 0,
				isRoot: true,
				// x: 0,
				// y: 0,
				dataSource: null,
				selectNode: {
					name: ''
				},
				firstLoad: true,
				isOpen: true,
				isSame: false,
				// horizontal: 'left',
				// vertical: 'bottom',
				// direction: 'horizontal',
				// pattern: {
				// 	color: '#7A7E83',
				// 	backgroundColor: '#fff',
				// 	selectedColor: '#007AFF',
				// 	buttonColor: "#007AFF"
				// },
				content: [{
						text: '添加人员',
						active: false
					},
					{
						text: '修改人员',
						active: false
					},
					{
						text: '查看人员',
						active: false
					}
				]
			}
		},
		components: {
			treeChart,
			uniPopup
		},
		computed: {
			tranX: function() {
				return (this.width - this.windowWidth) / 2 - 72
			}
		},
		updated() {
			let systemInfo = uni.getSystemInfoSync();
			this.windowWidth = systemInfo.windowWidth;
			this.windowHeight = systemInfo.windowHeight;
			this.initPosition()
		},
		onLoad: function(options) {
			util.loadObj(this.param, options)

		},
		onShow: function() {
			this.loadData(this.param.familyUserId)
		},
		methods: {
			initPosition() {
				//动态设置宽高
				if (this.dataSource) {
					let self = this
					uni.createSelectorQuery().in(this).select('#rootTree').boundingClientRect(function(e) {
						console.log(e)
						self.width = e.width > self.windowWidth ? e.width : self.windowWidth;
						self.height = e.height > self.windowHeight ? e.height : self.windowHeight;
						// console.log('windowWidth=' + self.windowWidth)
						// console.log('windowHeight=' + self.windowHeight)
						// console.log('width=' + self.width)
						// console.log('height=' + self.height)
						// console.log((parseInt(self.width) - parseInt(self.windowWidth)) / 2)
					}).exec()
				}
			},
			loadData: function(mainId) {
				this.$http.get('familyUser/query', {
					familyUserId: mainId,
					language: this.param.language
				}).then(res => {
					if (res.data.code === 200) {
						this.dataSource = res.data.data.familyUserList
						this.setIsSelf(mainId, this.dataSource)
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			openBtnList: function(e) {
				let _node = null
				// #ifdef APP-PLUS
				_node = uni.getStorageSync('selNode')
				// #endif
				// #ifdef H5
				_node = e
				// #endif
				if (this.selectNode && this.selectNode.id == _node.id) {
					this.isSame = true
				} else {
					this.isOpen = false
					this.isSame = false
				}
				if (this.isOpen && this.isSame) {
					// this.$refs.popup.open()
					uni.navigateTo({
						url: 'person/editPerson' + util.jsonToQuery({
							familyUserId: this.selectNode.id,
							familyId: this.param.familyId,
							userId: this.param.userId,
							pname: this.selectNode.name,
							language: this.param.language,
							isFather: this.selectNode.isFather,
							isMother: this.selectNode.isMother,
							isSpouse: this.selectNode.isSpouse
						})
					})
				} else {
					// #ifdef APP-PLUS
					this.selectNode = uni.getStorageSync('selNode')
					// #endif
					// #ifdef H5
					console.log(e)
					this.selectNode = e;
					// this.selChange(this.dataSource)
					// #endif
					this.loadData(this.selectNode.id)
					this.isOpen = true
				}
			},
			setIsSelf(id, ds) {
				if (ds.id === parseInt(id)) {
					ds.isself = true
					this.selectNode = ds
				} else {
					if (ds.spouseTreeDto) {
						this.setIsSelf(id, ds.spouseTreeDto)
					}
					if (ds.childTreeDto) {
						for (let i = 0; i < ds.childTreeDto.length; i++) {
							this.setIsSelf(id, ds.childTreeDto[i])
						}
					}
				}
			},
			// selChange: function(data) {
			// 	if (data.id == this.selectNode.id) {
			// 			data.isself = true
			// 	} else {
			// 		data.isself = false
			// 	}
			// 	if (data.spouseTreeDto) {
			// 		this.selChange(data.spouseTreeDto)
			// 	}
			// 	if (data.childTreeDto && data.childTreeDto.length) {
			// 		for (let i = 0; i < data.childTreeDto.length; i++) {
			// 			this.selChange(data.childTreeDto[i])
			// 		}
			// 	}
			// },
			// trigger(e) {
			// 	for (let i = 0; i < this.content.length; i++) {
			// 		this.content[i].active = e.index === i
			// 	}
			// 	let url = null
			// 	switch (e.index) {
			// 		case 0:
			// 			url = 'person/create' + util.jsonToQuery({
			// 				familyUserId: this.selectNode.id,
			// 				familyId: this.param.familyId,
			// 				userId: this.param.userId,
			// 				pname: this.selectNode.name,
			// 				language: this.param.language
			// 			});
			// 			break;
			// 		case 1:
			// 			url = 'person/edit' + util.jsonToQuery({
			// 				familyUserId: this.selectNode.id,
			// 				familyId: this.param.familyId,
			// 				userId: this.param.userId,
			// 				language: this.param.language
			// 			});
			// 			break;
			// 		case 2:
			// 			url = 'person/info' + util.jsonToQuery({
			// 				familyUserId: this.selectNode.id,
			// 				userId: this.param.userId,
			// 				language: this.param.language
			// 			});
			// 			break;
			// 	}
			// 	uni.navigateTo({
			// 		url: url
			// 	})
			// },
			operate(type) {
				let url = null
				switch (type) {
					case 'add':
						url = 'person/create' + util.jsonToQuery({
							familyUserId: this.selectNode.id,
							familyId: this.param.familyId,
							userId: this.param.userId,
							pname: this.selectNode.name,
							language: this.param.language,
							isFather: this.selectNode.isFather,
							isMother: this.selectNode.isMother,
							isSpouse: this.selectNode.isSpouse
						});
						break;
					case 'edit':
						url = 'person/edit' + util.jsonToQuery({
							familyUserId: this.selectNode.id,
							familyId: this.param.familyId,
							userId: this.param.userId,
							language: this.param.language
						});
						break;
					case 'view':
						url = 'person/info' + util.jsonToQuery({
							familyUserId: this.selectNode.id,
							userId: this.param.userId,
							language: this.param.language
						});
						break;
				}
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style>
	page {
		border-top: 1px solid #e5e5e5;
	}

	movable-area {
		overflow: hidden;
		width: 100vh;
	}

	movable-view {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
