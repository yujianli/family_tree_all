<template>
	<view class="container" style="padding-bottom: 160upx;">
		<view class="wrapper">
			<text class="inner_title">{{i18n.age}}({{i18n.years}})</text>
			<input class="input" type="text" v-model="appearance.age" placeholder-style="color:#999" :placeholder="ageTitle" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.height}}(cm)</text>
			<input class="input" type="text" v-model="appearance.height" placeholder-style="color:#999" :placeholder="heightTitle" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.weight}}(kg)</text>
			<input class="input" type="text" v-model="appearance.weight" placeholder-style="color:#999" :placeholder="weightTitle" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.faceShape}}</text>
			<picker @change="faceShapeBindPickerChange" :value="idx.faceShape" :range="arr.faceShape" range-key="value">
				<view class="picker_inner">
					<view class="input">{{ arr.faceShape[idx.faceShape].value }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.characteristics}}</text>
			<input class="input" type="text" v-model="appearance.characteristics" placeholder-style="color:#999" :placeholder="i18n.characteristics" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.tshirtSize}}</text>
			<picker @change="tshirtSizeBindPickerChange" :value="idx.tshirtSize" :range="arr.tshirtSize" range-key="value">
				<view class="picker_inner">
					<view class="input">{{ arr.tshirtSize[idx.tshirtSize].value }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.shirtSize}}</text>
			<picker @change="shirtSizeBindPickerChange" :value="idx.shirtSize" :range="arr.shirtSize" range-key="value">
				<view class="picker_inner">
					<view class="input">{{ arr.shirtSize[idx.shirtSize].value }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.clothSize}}</text>
			<picker @change="clothSizeBindPickerChange" :value="idx.clothSize" :range="arr.clothSize" range-key="value">
				<view class="picker_inner">
					<view class="input">{{ arr.clothSize[idx.clothSize].value }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.trousersSize}}</text>
			<picker @change="trousersSizeBindPickerChange" :value="idx.trousersSize" :range="arr.trousersSize" range-key="value">
				<view class="picker_inner">
					<view class="input">{{ arr.trousersSize[idx.trousersSize].value }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.shoeSize}}</text>
			<picker @change="shoeSizeBindPickerChange" :value="idx.shoeSize" :range="arr.shoeSize" range-key="value">
				<view class="picker_inner">
					<view class="input">{{ arr.shoeSize[idx.shoeSize].value }}</view>
					<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
				</view>
			</picker>
		</view>
	
		<view class="tags_wrapper">
			<image src="../../static/images/icon_tag.png" class="icon_tags"></image>
			<!-- #ifdef H5 -->
			<view class="mul_tags" :style="{display: tagList.length > 0 ? 'inline-block': 'none'}" v-for="(tag,index) in tagList">{{tag}}</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="mul_tags" v-for="(tag, index) in tagList">{{tag}}</view>
			<!-- #endif -->
			<input type="text" v-model="tag" placeholder-style="color:#EE9C36" class="input smallipt" @blur="setTags" :placeholder="btnText.editTag" />
		</view>
		
		<view class="opt_container" v-if="param.id"><button class="btn_delete" @tap="remove">{{btnText.remove}}</button></view>
	</view>
</template>

<script>
	import dataJson from '@/static/appData.json';
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				param: {
					userId: null,
					moduleId: null,
					id: null,
					language: null
				},
				arr: {
					faceShape: this.$t('selData').faceShape,
					tshirtSize: this.$t('selData').size,
					shirtSize: this.$t('selData').size,
					clothSize: this.$t('selData').size,
					trousersSize: this.$t('selData').size,
					shoeSize: this.$t('selData').size
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
				},
				tagList:[],
				tag:''
			};
		},
		computed:{
			i18n() {
				return this.$t('common')
			},
			btnText(){
				return this.$t('btnText')
			},
			ageTitle:function(){
				return this.i18n.age+'('+this.i18n.years+')'
			},
			heightTitle:function(){
				return this.i18n.height+'(cm)'
			},
			weightTitle:function(){
				return this.i18n.weight+'(kg)'
			}
		},
		filters:{
			formatWords:function(value){
				if(!value) return []
				return value.join('  ');
			}
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({title: this.$t('title').appearance});
			util.loadObj(this.param, options)
			if (options.id) {
				this.isEdit = true;
				this.appearance.id = options.id
				this.loadData(options.id)
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
				this.selProp('tshirtSize', e.target.value, 'size');
			},
			shirtSizeBindPickerChange: function(e) {
				this.selProp('shirtSize', e.target.value, 'size');
			},
			clothSizeBindPickerChange: function(e) {
				this.selProp('clothSize', e.target.value, 'size');
			},
			trousersSizeBindPickerChange: function(e) {
				this.selProp('trousersSize', e.target.value, 'size');
			},
			shoeSizeBindPickerChange: function(e) {
				this.selProp('shoeSize', e.target.value, 'size');
			},
			selProp: function(prop, index, key) {
				this.idx[prop] = index;
				if (!key) {
					key = prop;
				}
				this.appearance[prop] = this.$t('selData')[key][index].key;
			},
			bindProp: function(prop, key, val) {
				let data=this.$t('selData')
				for (var i = 0; i < data[key].length; i++) {
					if (data[key][i].key === val) {
						this.idx[prop]=i
						break
					}
				}
			},
			loadData: function(appearanceId) {
				this.$http.get('appearance/detailAppearance', {
					appearanceId: this.param.id,
					language: this.param.language
				}).then((res) => {
					if (res.data.code === 200) {
						util.loadObj(this.appearance, res.data.data.appearanceInfo);
						if(this.appearance.tags){
							this.tagList=this.appearance.tags.split(',')
						}
						this.bindProp('faceShape','faceShape',this.appearance.faceShape)
						this.bindProp('tshirtSize','size',this.appearance.tshirtSize)
						this.bindProp('shirtSize','size',this.appearance.shirtSize)
						this.bindProp('clothSize','size',this.appearance.clothSize)
						this.bindProp('trousersSize','size',this.appearance.trousersSize)
						this.bindProp('shoeSize','size',this.appearance.shoeSize)
					} else {
						uni.showToast({
							title: '信息加载失败',
							icon: 'none'
						});
					}
				})
			},
			save: function() {
				let url = 'appearance/' + (this.isEdit ? 'editAppearance' : 'createAppearance')
				let postParam = {
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
				util.loadObj(postParam, this.appearance)
				postParam['tags']=this.tagList.join(',')
				if (this.isEdit) {
					postParam['appearanceId']=this.param.id
				} else {
					postParam['userId']=this.param.userId
					postParam['moduleId']=this.param.moduleId
				}
				postParam['language'] = this.param.language
				util.nullFilter(postParam)
				this.$http.post(url, postParam).then((res) => {
					if (res.data.code == 200) {
						uni.navigateBack({
							delta: 1
						})
					} else {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				})
			},
			setTags:function(e){
				// console.log(e);
				// console.log(this.tagList);
				let tagList = this.tagList;
				if(e.detail.value){
					tagList.push(e.detail.value);
					this.tag = '';
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
						  				delta:2
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
	page{
		border-top: 1px solid #e5e5e5;
	}
	.container {
		padding-left: 30upx;
		padding-right: 30upx;
		// padding-bottom: 120upx;
	}

	.wrapper {
		height: 110upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #F0F4F7;
	}

	.mul_wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		border-bottom: 1px solid #e5e5e5;
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
		&.smallipt{
			text-align: left;
			padding:6upx 30upx;font-size: 30upx;flex:none;width:120upx;color: #EE9C36;
			border-radius: 20upx;
			background: #F8F8F8;
		}
	}

	.mul_input {
		font-size: 34upx;
		color: #303641;
		flex: 1;
	}
	
	.tags_wrapper{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 24upx;
		font-size: 25upx;
	}
	.icon_tags{
		width: 38upx;height: 38upx;margin-right: 21upx;
	}
	.mul_tags{
		margin-right: 10upx;
		color: #56D282;
		font-size: 30upx;
		background:#F8F8F8;
		border-radius: 20upx;
		padding:8upx 20upx;
		vertical-align: middle;
	}
	.opt_container {
		// position: fixed;
		margin-top: 60upx;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 104upx;
		z-index: 999;
	
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
	
	.picker_inner{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
		
	.picker_arrow{
		height: 20upx;
		width: 24upx;
		margin-left: 10upx;
	}
</style>
