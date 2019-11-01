<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">时间：</text>
			<picker class="input" mode="date" :value="baseInfo.passingAway" :start="startDate" :end="endDate" @change="bindPassingAwayDateChange"
			 :fields="'month'">
				<view>{{passingAwayDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">地点：</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="地点"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">类型：</text>
			<input class="input" type="text" placeholder-style="color:#999" placeholder="类型"/>
		</view>
		<view class="mul_wrapper">
			<textarea class="mul_input" placeholder-style="color:#999" placeholder="内容" value="爱好内容XXX1爱好内容X2XX爱好内容3XXX爱好内容X4XX爱好内容XX5X爱好内容XXX爱好内容X6XX"/>
		</view>
		<!-- 绑定图片数据，监听添加、删除事件，设置是否拖拉，是否可删除，是否可选择添加，图片数量限制-->		
		<robby-image-upload v-model="imageData" @delete="deleteImage" @add="addImage" 
		:server-url-delete-image="serverUrlDeleteImage" :server-url="serverUrl">
		</robby-image-upload>
		<view>
			<text class="edit_other_opts">
				添加标签
			</text>
		</view>
		<view class="wrapper">
			<text class="edit_other_opts">
				+ 添加关联
			</text>
		</view>		
		<view>
			<text class="edit_other_opts">
				+ 添加类型
			</text>
		</view>
		<view class="opt_container">
			<button class="btn_delete">删除记录</button>
		</view>
	</view>
</template>

<script>
	//组件文档参考地址 https://github.com/smalltee/robby-image-upload
	import robbyImageUpload  from '@/components/robby-image-upload.vue'
	
	function getDate(type){
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
			
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	}
	
	export default {
		data() {
			return {
				enableDel : true,
				enableAdd : true,
				enableDrag : true,
				limitNumber: 8,
				imageData : [],
				serverUrl: null,
				serverUrlDeleteImage: null,
				formData: null,
				showUploadProgerss:false,
			}
		},
		components:{robbyImageUpload},
		methods: {
			deleteImage: function(e){
				
			},
			addImage: function(e){
				console.log(e)
			},
		}
	}
</script>

<style>
	.container{
		padding-left:30upx;
		padding-right:30upx;
		padding-bottom: 120upx;
	}
	.wrapper{
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #E5E5E5;
	}
	.mul_wrapper{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-top: 20upx;
	}
	.inner_title{
		font-size: 34upx;
		color: #333;
		margin-right: 40upx;
	}
	.input{
		font-size: 34upx;
		color: #303641;
		flex:1;
		text-align:left;
	}
	.mul_input{
		height: 492upx;
		font-size: 34upx;
		color: #303641;
		flex: 1;
		border:1px solid #E5E5E5;
		border-radius: 8upx;
		padding: 18upx;
	}
	.opt_container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 114upx;
	
	}
	
	.btn_delete {
		flex: 1;
		font-size: 38upx;
		color: #ffffff;
		background-color: #FB4F4F;
		border-radius: 0;
	}
	
	.btn_delete:after {
		border: 0px;
	}
	
	.edit_other_opts{
		font-size: 32upx;color: #EE9C36;
	}
</style>
