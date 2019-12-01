<template>
	<!--component/treechart.wxml-->
	<movable-area v-if="dataSource" :style="{height: isiPhoneX ? 'calc(100vh - 66upx)' : '100vh',width:'100vh'}">
	  <movable-view scale=0.75 direction="all" id="rootTree" 
	  :style="[{'width':width == 0 ? 'auto' : width + 'upx'},{'height':height == 0 ? 'auto' : height + 'upx'}]" 
	  :x=x
	        :y=y
	  >
	    <tree-chart :dataSource="dataSource" :isRoot="isRoot"></tree-chart>
	  </movable-view>
	</movable-area>
</template>

<script>
	import treeChart from '@/components/tree-chart/tree-chart';
	const { windowWidth, windowHeight } = uni.getSystemInfoSync();	
	export default {
		data() {
			return {
				isiPhoneX: false,
				width: 0,
				height: 0,
				isRoot: true,
				x:0,
				y:0,
				dataSource: {
					"name": "",
					"relationid": 34,
					"username": "何先生",
					"gender": 0,
					"thumb": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIpYoDe6gaZwdbLsZSohOBLgbOib6GCOCn9ulwjXUm4v26HeqA05n0VEWLib7QbBowreO9PUamOrB0w/132",
					"level": null,
					"child": "35,36,51",
					"is_wife": "0",
					"isBind": 1,
					"isself": true,
					"children": [{
						"name": "郭先生",
						"relationid": 35,
						"gender": 0,
						"username": "郭先生",
						"thumb": "",
						"level": 3,
						"child": "37,43",
						"is_wife": "0",
						"isBind": 0,
						"isself": false,
						"wife": {
							"name": "凤姐",
							"relationid": 43,
							"gender": 1,
							"username": "凤姐",
							"thumb": "",
							"level": 3,
							"child": null,
							"is_wife": "1",
							"isBind": 0,
							"isself": false
						},
						"children": [{
							"name": "吴先生",
							"relationid": 37,
							"gender": 0,
							"username": "吴先生",
							"thumb": "",
							"level": 3,
							"child": "38,39,42,45",
							"is_wife": "0",
							"isBind": 0,
							"isself": false,
							"wife": {
								"name": "乔碧萝",
								"relationid": 42,
								"gender": 1,
								"username": "乔碧萝",
								"thumb": "",
								"level": 3,
								"child": null,
								"is_wife": "1",
								"isBind": 0,
								"isself": false
							}
							
						}]
					}]
				}
			}
		},
		components:{
			treeChart
		},
		onReady() {
			//动态设置宽高
			if(this.dataSource){
				 uni.createSelectorQuery().select('#rootTree').boundingClientRect(function(e){
					this.width = e.width > windowWidth ? e.width : windowWidth;
					this.height = e.height > windowHeight ? e.height : windowHeight;
	            }).exec()
			}
		},
		methods: {
		}
	}
</script>

<style>
	movable-area{
	  overflow: hidden;
	  width: 100vh;
	}
	
	movable-view {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
</style>
