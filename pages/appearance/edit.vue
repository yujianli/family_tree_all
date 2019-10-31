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
				<view class="uni-input">{{ arr.faceShape[idx.faceShape].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">个性特点</text>
			<input class="input" type="text" v-model="appearance.characteristics" placeholder-style="color:#999" placeholder="姓名" />
		</view>
		<view class="wrapper">
			<text class="inner_title">T恤衫尺寸</text>
			<picker @change="tshirtSizeBindPickerChange" :value="idx.tshirtSize" :range="arr.tshirtSize" range-key="value">
				<view class="uni-input">{{ arr.tshirtSize[idx.tshirtSize].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">衬衫尺寸</text>
			<picker @change="shirtSizeBindPickerChange" :value="idx.shirtSize" :range="arr.shirtSize" range-key="value">
				<view class="uni-input">{{ arr.shirtSize[idx.shirtSize].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">衣服尺寸</text>
			<picker @change="clothSizeBindPickerChange" :value="idx.clothSize" :range="arr.clothSize" range-key="value">
				<view class="uni-input">{{ arr.clothSize[idx.clothSize].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">裤子尺寸</text>
			<picker @change="trousersSizeBindPickerChange" :value="idx.trousersSize" :range="arr.trousersSize" range-key="value">
				<view class="uni-input">{{ arr.trousersSize[idx.trousersSize].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">鞋子尺寸</text>
			<picker @change="shoeSizeBindPickerChange" :value="idx.shoeSize" :range="arr.shoeSize" range-key="value">
				<view class="uni-input">{{ arr.shoeSize[idx.shoeSize].value }}</view>
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
				appearanceId: '',
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
		if (options.appearanceId) {
			this.isEdit = true;
			this.loadData(options.appearanceId)
		}
	},
	onNavigationBarButtonTap(e) {
		this.save();
	},
	methods: {
		faceShapeBindPickerChange: function(e) {
			this.selProp('faceShape', e.target.value);
		},
		tshirtSizeBindPickerChange: function(e) {
			this.selProp('tshirtSize', e.target.value);
		},
		shirtSizeBindPickerChange: function(e) {
			this.selProp('shirtSize', e.target.value);
		},
		clothSizeBindPickerChange: function(e) {
			this.selProp('clothSize', e.target.value);
		},
		trousersSizeBindPickerChange: function(e) {
			this.selProp('trousersSize', e.target.value);
		},
		shoeSizeBindPickerChange: function(e) {
			this.selProp('shoeSize', e.target.value);
		},
		selProp: function(prop, index) {
			this.idx[prop] = index;
			this.appearance[prop] = dataJson[prop][index].key;
		},
		initProp: function(prop, val) {
			for (var i = 0; i < dataJson[prop].length; i++) {
				if (dataJson[prop][i].key === val) {
					this.idx[prop] = i;
					break;
				}
			}
		},
		loadData:function(appearanceId){
			this.$http.get('appearance/detailAppearance',{
				appearanceId: appearanceId,
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
			let url = 'appearance/' + this.isEdit ? 'editAppearance':'createAppearance'
			this.$http.post(url, this.appearance).then((res)=>{
				if(res.data.code==200){
					uni.showToast({
						title: '保存成功',
						icon:'none'
					});
					uni.redirectTo({url:'list'})
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

<style></style>
