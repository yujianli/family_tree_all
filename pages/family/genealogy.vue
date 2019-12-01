<template>
	<!--component/treechart.wxml-->
	<view>
		<view style="margin-left: 10px;font-size:28upx">当前选中人员：{{selectNode.name}}</view>
		<movable-area v-if="dataSource" style="height:calc(100vh - 66upx);width:100vh">
			<movable-view scale=1 direction="all" id="rootTree" style="width:100%;height:100%;justify-content: flex-start;">
				<tree-chart :dataSource="dataSource" :isRoot="isRoot" @openBtn="openBtnList"></tree-chart>
			</movable-view>
		</movable-area>
		<uni-fab :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
		 @trigger="trigger"></uni-fab>
	</view>

</template>

<script>
	import treeChart from '@/components/tree-chart/tree-chart';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
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
				// width: 0,
				// height: 0,
				isRoot: true,
				// x: 0,
				// y: 0,
				dataSource: null,
				selectNode: {
					name:''
				},
				horizontal: 'left',
				vertical: 'bottom',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: "#007AFF"
				},
				content: [{
						text: '添加人员',
						active: false
					},
					{
						iconPath: '/static/api.png',
						selectedIconPath: '/static/apiHL.png',
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
			uniFab
		},
		onReady() {
			//动态设置宽高
			// if (this.dataSource) {
			// 	uni.createSelectorQuery().select('#rootTree').boundingClientRect(function(e) {
			// 		this.width = e.width > windowWidth ? e.width : windowWidth;
			// 		this.height = e.height > windowHeight ? e.height : windowHeight;
			// 	}).exec()
			// }
		},
		onLoad: function(options) {
			util.loadObj(this.param, options)
		},
		onShow:function(){
			this.loadData()
		},
		methods: {
			loadData: function() {
				this.$http.get('familyUser/query', {
					familyUserId: this.param.familyUserId,
					language: this.param.language
				}).then(res => {
					if (res.data.code === 200) {
						this.dataSource = res.data.data.familyUserList
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			openBtnList: function(e) {
				// #ifdef APP-PLUS
				this.selectNode=uni.getStorageSync('selNode')
				// #endif
				// #ifdef H5
				console.log(e)
				this.selectNode = e;
				// this.selChange(this.dataSource)
				// #endif
			},
			selChange: function(data) {
				if (data.id == this.selectNode.id) {
						data.isself = true
				} else {
					data.isself = false
				}
				if (data.spouseTreeDto) {
					this.selChange(data.spouseTreeDto)
				}
				if (data.childTreeDto && data.childTreeDto.length) {
					for (let i = 0; i < data.childTreeDto.length; i++) {
						this.selChange(data.childTreeDto[i])
					}
				}
			},
			trigger(e) {
				for (let i = 0; i < this.content.length; i++) {
					this.content[i].active = e.index === i
				}
				let url = null
				switch (e.index) {
					case 0:
						url = 'person/create' + util.jsonToQuery({
							familyUserId: this.selectNode.id,
							familyId: this.param.familyId,
							userId: this.param.userId,
							pname: this.selectNode.name,
							language: this.param.language
						});
						break;
					case 1:
						url = 'person/edit' + util.jsonToQuery({
							familyUserId: this.selectNode.id,
							familyId: this.param.familyId,
							userId: this.param.userId,
							language: this.param.language
						});
						break;
					case 2:
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
