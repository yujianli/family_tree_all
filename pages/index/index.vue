<template>
	<view>
		<view class="person_tabs">
			<view>
				<text class="person_name person_name_active">万少波（本人）</text>
				<view class="tab_line"></view>
			</view>
			<view>
				<text class="person_name">杨林艳（配偶）</text>
				<view class="tab_line tab_line_active"></view>
			</view>
		</view>
		<view class="func_container">
			<view class="func_wrapper" v-for="(basicFunc,index) in basicFuncList">
				<image class="pic_menu" :src="basicFunc.pic"></image>
				<text class="text">{{basicFunc.name}}</text>
				<image src="../../static/images/icon_menu_delete.png"  class="pic_opt"></image>
			</view>	
		</view>
		<view class="person_intro">
			<image src="../../static/images/avatar.png" style="width: 44px;height: 44px;"></image>
			<text class="name">万某某</text>
		</view>
		<view style="margin-bottom: 26px;">
			<view class="other_info_container">
				<text class="other_info">出生：2018/10-2019/11</text>
				<text class="other_info">出生地：浙江杭州</text>
			</view>
			<view class="other_info_container">
				<text class="other_info">民族：汉族</text>
				<text class="other_info">职业：程序员</text>
			</view>
			
		</view>
		
		<view class="card_list" style="padding-left: 18px;padding-right: 18px;">
			<view style="text-align: right;margin-bottom: 22px;"><text style="font-size: 16px;color: $999;">更多</text></view>
			<view class="card_item">
				<image src="../../static/images/icon_func_1.png" class="card_pic"></image>
				<view class="card_inner">
					<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
					<view class="card_others">
						<view class="tags">
							<text>旅行</text>
							<text>游记</text>
						</view>
						<text class="time">2018/10/12</text>
					</view>
				</view>
			</view>
			<view class="card_item">
				<image src="../../static/images/icon_func_1.png" class="card_pic"></image>
				<view class="card_inner">
					<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
					<view class="card_others">
						<view class="tags">
							<text>旅行</text>
						</view>
						<text class="time">2018/10/12</text>
					</view>
				</view>
			</view>
			<view class="card_item">
				<view class="card_inner">
					<text class="card_title">明月几时有把酒问青天不知天上宫阙今夕是何年</text>
					<view class="card_others">
						<view class="tags">
							<text>旅行</text>
						</view>
						<text class="time">2018/10/12</text>
					</view>
				</view>
			</view>
		</view>
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
				},{
					id:10,
					name:'更多',
					pic:'../../static/images/icon_func_0.png'
				}]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.person_tabs{
		display: flex;flex-direction: row;justify-content: space-around; align-items: center;
		height: 50px;
	}
	
	.person_name{
		font-size: 18px;color: #999;
	}
	.person_name_active{
		color: #333;
		font-weight: 600;
	}
	
	.tab_line{
		width:70px;height: 1px;background-color: #4DC578;
		margin: 0 auto;
		margin-top: 14px;
	}
	.tab_line_active{
		background-color: #ffffff;
	}
	.func_container{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		margin-top: 20px;
	}
		
	.func_wrapper{
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
	.person_intro{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin-top: 26px;
	}
		
	.name{
		font-size: 21px;
		color: #333;
		font-weight: 600;
		margin-top: 5px;
	}
	.other_info_container{
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		margin-left: 25px;
		margin-right: 35px;
	}
	.other_info{
		margin-top: 18px;
		font-size: 14px;
		color: #333;
		
		
	}
	.card_item{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		
	}
	.card_inner{
		
		flex-direction: column;
		justify-content:space-between;
	}
	.card_pic{
		width: 123px;height: 92px;
		margin-right: 12px;
	}
	.card_title{
		font-size: 17px;color: #333;font-weight: 600;
	}
	.card_others{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 32px;
	}
	.tags{
		font-size: 13px;
		color: #56D282;
		margin-right: 8px;
	}
	.time{
		font-size: 13px;
		color: #999;
		
	}
	
</style>
