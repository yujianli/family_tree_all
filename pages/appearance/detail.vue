<template>
	<view>
		<view class="container">
			<view class="wrapper">
				<text class="inner_title">{{langData.common.age}}</text>
				<view class="input">{{appearanceInfo.age}}{{langData.common.years}}</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.height}}</text>
				<view class="input">{{appearanceInfo.height}}cm</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.weight}}</text>
				<view class="input">{{appearanceInfo.weight}}kg</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.faceShape}}</text>
				<view class="input">{{appearanceInfo.faceShape}}</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.characteristics}}</text>
				<view class="input">{{appearanceInfo.characteristics}}</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.tshirtSize}}</text>
				<view class="input">{{appearanceInfo.tshirtSize}}</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.shirtSize}}</text>
				<view class="input">{{appearanceInfo.shirtSize}}</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.clothSize}}</text>
				<view class="input">{{appearanceInfo.clothSize}}</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.trousersSize}}</text>
				<view class="input">{{appearanceInfo.trousersSize}}</view>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{langData.common.shoeSize}}</text>
				<view class="input">{{appearanceInfo.shoeSize}}</view>
			</view>
			<view class="detail_tag">
				<image v-if="tags.length" src="../../static/images/icon_tag.png" class="icon_tags"></image>
				<view class="tags_text" v-for="(tag, index) in tags">{{tag}}</view>
			</view>

			<view class="opt_container"><button class="btn_delete" @tap="remove">{{langData.button.delete}}</button></view>
		</view>
	</view>
</template>

<script>
import util from '@/common/util.js';
import dataJson from '@/static/appData.json';
export default {
	data() {
		return {
			param:{
				userId:null,
				moduleId:null,
				id:null,
				language:null
			},
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
	computed:{
		langData:function(){
			let lang=this.$common.getLanguage()
			return this.$common.getLanguageData(lang)
		},
		tags:function(){
			if(!this.appearanceInfo.tags) return []
			return this.appearanceInfo.tags.split(',')
		}
	},
	onLoad: function(options) {
		let _name=this.langData.appearance.title			
		uni.setNavigationBarTitle({title: _name});
		util.loadObj(this.param,options)
	},
	onShow:function(){
		this.loadData(this.param.id);
	},
	onNavigationBarButtonTap(e) {
		uni.navigateTo({
			url: 'edit' + util.jsonToQuery(this.param)
		})
	},
	methods: {
		loadData: function(id) {
			this.$http
				.get('appearance/detailAppearance', {
					appearanceId: this.param.id,
					language: this.param.language
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
					if (res.confirm) {
					  this.$http.post('appearance/deleteAppearance', {
					  		appearanceId: this.param.id,
					  		language: this.param.language
					  	})
					  	.then(res => {
					  		if (res.data.code === 200) {
					  			uni.navigateBack({
					  				delta:1
					  			})
					  		} else {
					  			uni.showToast({
					  				title: '删除失败',
					  				icon: 'none'
					  			});
					  		}
					  	});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
					
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
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
		border-bottom: 1px solid #e5e5e5;
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
		background-color: #FB4F4F;
		border-radius: 0;
	}

	.btn_delete:after {
		border: 0px;
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
	}
</style>
