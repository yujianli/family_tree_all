<template>
	<view>
		<view class="container">
			<view class="wrapper" v-for="(basicFunc,index) in basicFuncList">
				<image class="pic_menu" :src="basicFunc.pic"></image>
				<text class="text">{{basicFunc.name}}</text>
				<image src="../../static/images/icon_menu_delete.png"  class="pic_opt"></image>
			</view>	
		</view>
		<view class="explain" style="">
			<text>以下功能最多展示在首页（9个）</text>
		</view>
		<view class="container">
			<view class="wrapper" v-for="(otherFunc,index) in otherFuncList">
				<image class="pic_menu" :src="otherFunc.pic"></image>
				<text class="text">{{otherFunc.name}}</text>
				<image src="../../static/images/icon_menu_add.png"  class="pic_opt"></image>
			</view>	
		</view>
		<!-- <navigator url="/pages/login/login" hover-class="navigator-hover">aaa</navigator> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				basicFuncList:[{
					id:1,
					name:'基本信息',
					pic:'../../static/images/icon_func_1.png'
				},{
					id:2,
					name:'体貌特征',
					pic:'../../static/images/icon_func_2.png'
				},{
					id:3,
					name:'主要大事',
					pic:'../../static/images/icon_func_3.png'
				},{
					id:4,
					name:'计划安排',
					pic:'../../static/images/icon_func_4.png'
				},{
					id:5,
					name:'照片视频',
					pic:'../../static/images/icon_func_5.png'
				},{
					id:6,
					name:'工资理财',
					pic:'../../static/images/icon_func_6.png'
				},{
					id:7,
					name:'爱好',
					pic:'../../static/images/icon_func_7.png'
				},{
					id:8,
					name:'健康状况',
					pic:'../../static/images/icon_func_8.png'
				},{
					id:9,
					name:'生活习惯',
					pic:'../../static/images/icon_func_9.png'
				}],
				otherFuncList:[{
					id:1,
					name:'日记',
					pic:'../../static/images/icon_func_10.png'
				},{
					id:2,
					name:'文摘',
					pic:'../../static/images/icon_func_11.png'
				},{
					id:3,
					name:'心得感谢',
					pic:'../../static/images/icon_func_12.png'
				},{
					id:4,
					name:'恋爱经历',
					pic:'../../static/images/icon_func_13.png'
				},{
					id:5,
					name:'工作经历',
					pic:'../../static/images/icon_func_14.png'
				},{
					id:6,
					name:'校园经历',
					pic:'../../static/images/icon_func_15.png'
				},{
					id:7,
					name:'住宅居室',
					pic:'../../static/images/icon_func_16.png'
				},{
					id:8,
					name:'八卦风水',
					pic:'../../static/images/icon_func_17.png'
				},{
					id:9,
					name:'格言',
					pic:'../../static/images/icon_func_18.png'
				}],
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.container{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
	}
		
	.wrapper{
		display: flex;
		flex-direction: column;
		width: 20%;
		height: 94px;
		justify-content: center;
		align-items: center;
		position: relative;
	}
		
	.pic_menu{
		width: 44px; height: 44px;
	}
	.pic_opt{
		width: 20px;height: 20px;position: absolute;top: 4px;right: 3%;
	}
		
	.explain{
		margin-top: 30px;margin-bottom: 34px;font-size: 13px;color: #999;text-align: center;
	}
		
	.text{
		margin-top: 8px;
		font-size: 13px;color: #333;
	}
</style>
