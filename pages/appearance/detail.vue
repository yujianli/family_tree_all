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
				<input class="input" type="text" placeholder-style="color:#999" v-model="appearanceInfo.trousersSize" placeholder="裤子尺寸" />
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
import util from '@/common/util.js';
import dataJson from '@/static/appData.json';
export default {
	data() {
		return {
			userId:null,
			moduleId:null,
			appearanceInfo: {
				id:null,
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
	onLoad: function(options) {
		this.appearanceInfo.id=options.id;
		this.userId=options.userId
		this.moduleId=options.moduleId
		this.loadData(options.id);
	},
	methods: {
		loadData: function(id) {
			this.$http
				.get('appearance/detailAppearance', {
					appearanceId: id,
					language: this.$common.language
				})
				.then(res => {
					if (res.data.code === 200) {
						let obj = res.data.data.appearanceInfo;
						obj.faceShape = this.bindProp('faceShape', obj.faceShape);
						obj.tshirtSize = this.bindProp('size', obj.tshirtSize);
						obj.shirtSize = this.bindProp('size', obj.shirtSize);
						obj.clothSize = this.bindProp('size', obj.clothSize);
						obj.trousersSize = this.bindProp('size', obj.trousersSize);
						obj.shoeSize = this.bindProp('size', obj.shoeSize);
						util.loadObj(this.appearanceInfo, obj);
					} else {
						uni.showToast({
							title: '体貌特征信息加载失败',
							icon: 'none'
						});
					}
				});
		},
		bindProp: function(key, val) {
			for (var i = 0; i < dataJson[key].length; i++) {
				if (dataJson[key][i].key === val) {
					return dataJson[key][i].value;
				}
			}
		},
		remove: function() {
			uni.showModal({
				title: '删除',
				content: '确认删除该记录？',
				confirmText: '确认',
				success: res => {
					this.$http.post('appearance/deleteAppearance', {
							appearanceId: this.appearanceInfo.id,
							language: this.$common.language
						})
						.then(res => {
							if (res.data.code === 200) {
								uni.navigateTo({
									url: '/pages/appearance/list?userId='+this.userId+'&moduleId='+this.moduleId
								});
							} else {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
							}
						});
				}
			});
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
