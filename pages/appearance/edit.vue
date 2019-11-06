<template>
	<view class="container">
		<view class="wrapper">
			<text class="inner_title">年龄</text>
			<input class="input" type="text" v-model="appearance.age" placeholder-style="color:#999" placeholder="年龄" />
		</view>
		<view class="wrapper">
			<text class="inner_title">身高</text>
			<input class="input" type="text" v-model="appearance.height" placeholder-style="color:#999" placeholder="身高" />
		</view>
		<view class="wrapper">
			<text class="inner_title">体重</text>
			<input class="input" type="text" v-model="appearance.weight" placeholder-style="color:#999" placeholder="体重" />
		</view>
		<view class="wrapper">
			<text class="inner_title">脸型</text>
			<picker @change="faceShapeBindPickerChange" :value="idx.faceShape" :range="arr.faceShape" range-key="value">
				<view class="input">{{ arr.faceShape[idx.faceShape].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">个性特点</text>
			<input class="input" type="text" v-model="appearance.characteristics" placeholder-style="color:#999" placeholder="个性特点" />
		</view>
		<view class="wrapper">
			<text class="inner_title">T恤衫尺寸</text>
			<picker @change="tshirtSizeBindPickerChange" :value="idx.tshirtSize" :range="arr.tshirtSize" range-key="value">
				<view class="input">{{ arr.tshirtSize[idx.tshirtSize].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">衬衫尺寸</text>
			<picker @change="shirtSizeBindPickerChange" :value="idx.shirtSize" :range="arr.shirtSize" range-key="value">
				<view class="input">{{ arr.shirtSize[idx.shirtSize].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">衣服尺寸</text>
			<picker @change="clothSizeBindPickerChange" :value="idx.clothSize" :range="arr.clothSize" range-key="value">
				<view class="input">{{ arr.clothSize[idx.clothSize].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">裤子尺寸</text>
			<picker @change="trousersSizeBindPickerChange" :value="idx.trousersSize" :range="arr.trousersSize" range-key="value">
				<view class="input">{{ arr.trousersSize[idx.trousersSize].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">鞋子尺寸</text>
			<picker @change="shoeSizeBindPickerChange" :value="idx.shoeSize" :range="arr.shoeSize" range-key="value">
				<view class="input">{{ arr.shoeSize[idx.shoeSize].value }}</view>
			</picker>
		</view>
	</view>
</template>

<script>
import dataJson from '@/static/appData.json';

export default {
	data() {
		return {
			arr: {
				faceShape: dataJson['faceShape'],
				tshirtSize: dataJson['size'],
				shirtSize: dataJson['size'],
				clothSize: dataJson['size'],
				trousersSize: dataJson['size'],
				shoeSize: dataJson['size']
			},
			idx: {
				faceShape: 0,
				tshirtSize: 0,
				shirtSize: 0,
				clothSize: 0,
				trousersSize: 0,
				shoeSize: 0
			},
			isEdit: false,
			appearance: {
				id: '',
				userId: '',
				moduleId: '',
				age: '',
				height: '',
				weight: '',
				tags: '',
				faceShape: '',
				characteristics: '',
				tshirtSize: '',
				shirtSize: '',
				clothSize: '',
				trousersSize: '',
				shoeSize: '',
				language: ''
			}
		};
	},
	onLoad: function(options) {
		if (options.id) {
			this.isEdit = true;
			this.appearance.id=options.id
			this.loadData(options.id)
		}
		this.appearance.userId=options.userId
		this.appearance.moduleId=options.moduleId
	},
	onNavigationBarButtonTap(e) {
		this.save();
	},
	methods: {
		faceShapeBindPickerChange: function(e) {
			this.selProp('faceShape', e.target.value);
		},
		tshirtSizeBindPickerChange: function(e) {
			this.selProp('tshirtSize', e.target.value,'size');
		},
		shirtSizeBindPickerChange: function(e) {
			this.selProp('shirtSize', e.target.value,'size');
		},
		clothSizeBindPickerChange: function(e) {
			this.selProp('clothSize', e.target.value,'size');
		},
		trousersSizeBindPickerChange: function(e) {
			this.selProp('trousersSize', e.target.value,'size');
		},
		shoeSizeBindPickerChange: function(e) {
			this.selProp('shoeSize', e.target.value,'size');
		},
		selProp: function(prop, index, key) {
			this.idx[prop] = index;
			if(!key){
				key=prop;
			}
			this.appearance[prop] = dataJson[key][index].key;
		},
		loadData:function(appearanceId){
			this.$http.get('appearance/detailAppearance',{
				appearanceId: this.appearance.id,
				language: this.$common.language
			}).then((res)=>{
				if (res.data.code === 200) {
					util.loadObj(this.appearance, res.data.data.appearance);
				} else {
					uni.showToast({
						title: '体貌特征信息加载失败',
						icon: 'none'
					});
				}
			})
		},
		save: function() {
			let url = 'appearance/' + (this.isEdit ? 'editAppearance':'createAppearance')
			this.$http.post(url, this.appearance).then((res)=>{
				if(res.data.code==200){
					uni.redirectTo({
						url:'list?userId=' + this.appearance.userId + '&moduleId=' + this.appearance.moduleId
					})
				}else{
					uni.showToast({
						title: '保存失败', icon:'none'
					});
				}
			})
		}
	}
};
</script>

<style>
	.container{
		padding-left:30upx;
		padding-right:30upx;
	}
	.wrapper{
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.mul_wrapper{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
	}
	.avatar_wrapper{
		margin-top: 44upx;
		justify-content: center;
		margin-bottom: 36upx;
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
		text-align:right;
	}
	.mul_input{
		font-size: 34upx;
		color: #303641;
		flex: 1;
	}
</style>
