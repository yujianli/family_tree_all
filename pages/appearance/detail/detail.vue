<template>
	<view>
		<view class="container">
			<view class="wrapper">
				<text class="inner_title">年龄</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.age" placeholder="年龄" />
			</view>
			<view class="wrapper">
				<text class="inner_title">身高</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.height" placeholder="身高" />
			</view>
			<view class="wrapper">
				<text class="inner_title">体重</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.weight" placeholder="体重" />
			</view>
			<view class="wrapper">
				<text class="inner_title">脸型</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.faceShape" placeholder="脸型" />
			</view>
			<view class="wrapper">
				<text class="inner_title">个性特点</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.characteristics" placeholder="个性特点" />
			</view>
			<view class="wrapper">
				<text class="inner_title">T恤尺寸</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.tshirtSize" placeholder="T恤尺寸" />
			</view>
			<view class="wrapper">
				<text class="inner_title">衬衫尺寸</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.shirtSize" placeholder="衬衫尺寸" />
			</view>
			<view class="wrapper">
				<text class="inner_title">衣服尺寸</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.clothSize" placeholder="衣服尺寸" />
			</view>
			<view class="wrapper">
				<text class="inner_title">裤子尺寸</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.trousersSize" placeholder="裤子尺寸"/>
			</view>
			<view class="wrapper">
				<text class="inner_title">鞋尺寸</text>
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.shoeSize" placeholder="鞋尺寸" />
			</view>

			<view class="opt_container"><button class="btn_delete" @tap="remove">删除</button></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			appearanceId:-1,
			appearanceInfo: {
				age: '',
				height: '',
				weight: '',
				faceShape: '',
				characteristics: '',
				tshirtSize: '',
				shirtSize: '',
				clothSize: '',
				trousersSize: '',
				shoeSize: '',
				tags: ''
			}
		};
	},
	onLoad:function(options){
		this.appearanceId=options.appearanceId;
		
	},
	methods: {
		loadData:function(){
			
		},
		remove:function(){
			
		}
	}
};
</script>

<style>
.container {
	padding-left: 30upx;
	padding-right: 30upx;
	padding-bottom: 120upx;
}

.wrapper {
	height: 110upx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.mul_wrapper {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
}

.avatar_wrapper {
	margin-top: 44upx;
	justify-content: center;
	margin-bottom: 36upx;
}

.inner_title {
	font-size: 34upx;
	color: #333;
	margin-right: 40upx;
}

.input {
	font-size: 34upx;
	color: #303641;
	flex: 1;
	text-align: right;
}

.mul_input {
	font-size: 34upx;
	color: #303641;
	flex: 1;
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
	height: 104upx;
}

.btn_delete {
	flex: 1;
	font-size: 38upx;
	color: #ffffff;
	background-color: #fb4f4f;
	border-radius: 0;
}

.btn_delete:after {
	border: 0px;
}
</style>
