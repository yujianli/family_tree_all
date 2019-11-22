<template>
	<view class="container">
		<view class="wrapper avatar_wrapper" style="position: relative;">
			<image :src="imageUrl" style="width: 154upx;height: 154upx;" @tap="openAlbum('avatar')"></image>
			<!-- 			<avatar selWidth="200px" selHeight="400upx" @upload="myUpload" :avatarSrc="imageUrl"
			        avatarStyle="width: 200upx; height: 200upx; border-radius: 100%;">
			</avatar> -->
		</view>
		<view class="wrapper">
			<text class="inner_title">姓名</text>
			<input class="input" type="text" v-model="baseInfo.name" placeholder-style="color:#999" placeholder="姓名" />
		</view>
		<view class="wrapper">
			<text class="inner_title">手机号码</text>
			<input class="input" type="text" v-model="baseInfo.mobile" placeholder-style="color:#999" placeholder="手机号码" />
		</view>
		<view class="wrapper">
			<text class="inner_title">性别</text>
			<picker @change="sexBindPickerChange" :value="idx.sex" :range=" arr.sex" range-key="value">
				<view class="input">{{ arr.sex[idx.sex].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生年月</text>
			<picker mode="date" :value="baseInfo.birth !='' ? baseInfo.birth : '请选择'" :start="startDate" :end="endDate" @change="bindDateChange"
			 :fields="'day'">
				<view class="input">{{baseInfo.birth | formatDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">是否过世</text>
			<switch :checked="isPassedAway" @change="switchChange" class="input" />
		</view>
		<view class="wrapper" :style="{display: isPassedAway ? 'flex' : 'none'}">
			<text class="inner_title">过世年月</text>
			<picker mode="date" :value="baseInfo.passingAway != '' ? baseInfo.passingAway : '请选择'" :start="startDate" :end="endDate"
			 @change="bindPassingAwayDateChange" :fields="'day'">
				<view class="input">{{baseInfo.passingAway | formatDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">职业</text>
			<input class="input" type="text" v-model="baseInfo.career" placeholder-style="color:#999" placeholder="职业" />
		</view>
		<view class="wrapper">
			<text class="inner_title">与之间的关系</text>
			<view>{{relationName}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">同辈排行</text>
			<input class="input" type="text" v-model="baseInfo.temperament" placeholder-style="color:#999" placeholder="同辈排行" />
		</view>
	</view>

</template>

<script>
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import dataJson from '@/static/appData.json'
	import util from '@/common/util.js'
	import reg from '@/common/bizRule.js'

	export default {
		data() {
			return {
				arr: {
					sex: dataJson['sex']
				},
				idx: {
					sex: 0
				},
				relation:[],
				birthDate: '请选择',
				passingAwayDate: '请选择',
				startDate: util.getDate('start'),
				endDate: util.getDate('end'),
				isPassedAway: false,
				baseInfo: {
					familyUserId: null,
					familyId: null,
					userId: null,
					name: '',
					sex: '',
					relationId: null,
					ranking: null,
					mobile: '',
					headUrl: '.',
					birth: '',
					career: '',
					language: null,
					isPassedAway: 0,
					passingAway: ''
				},
				defaultAvatar: '../../static/images/avatar.png'
			}
		},
		components: {avatar},
		computed: {
			imageUrl: function() {
				if (this.baseInfo.headUrl) {
					return this.$common.picPrefix() + this.baseInfo.headUrl
				} else {
					return this.defaultAvatar
				}
			},
			relationName:function(){
				if(this.relation.length){
					return this.relation[this.baseInfo.relationId].name
				}
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return '请选择'
				return util.dateFormat(value)
			}
		},
		onLoad: function(options) {
			util.loadObj(this.baseInfo, options)
			if (options.familyUserId) {
				this.loadData()
			}
		},
		methods: {
			loadRelation:function(){
				this.$http.get('relationType/all',{
					language:this.baseInfo.language
				}).then(res=>{
					if(res.data.code===200){
						let _arr = res.data.data.relationType
						this.arr['relation']=this.arr['relation'].concat(_arr)
					}
				})
			},
			sexBindPickerChange: function(e) {
				this.sexIndex = e.target.value
				this.selProp('sex', e.target.value)
			},
			bindDateChange: function(e) {
				let _date = e.target.value
				console.log(e.target.value);
				this.baseInfo.birth = _date;
				console.log(_date);

				// this.birthDate = _date.replace('-','年')+ '月'
				this.birthDate = _date;
			},
			switchChange: function(e) {
				this.isPassedAway = e.target.value
				this.baseInfo.isPassedAway = e.target.value ? 1 : 0
				console.log('是否在世，携带值为', this.baseInfo.isPassedAway)
			},
			bindPassingAwayDateChange: function(e) {
				console.log(e.target.value);
				let _date = e.target.value
				if (this.isPassedAway) {
					this.baseInfo.passingAway = _date;
					// this.passingAwayDate = _date.replace('-','年')+ '月'
					this.passingAwayDate = _date;
				} else {
					this.baseInfo.passingAway = '';
					this.passingAwayDate = '请选择';
				}

			},
			selProp: function(prop, index) {
				this.idx[prop] = index;
				this.baseInfo[prop] = dataJson[prop][index].key;
			},
			initProp: function(prop, val) {
				console.log(dataJson[prop])
				for (var i = 0; i < dataJson[prop].length; i++) {
					if (dataJson[prop][i].key === val) {
						this.idx[prop] = i;
						break;
					}
				}
			},
			regValid: function(type, value) {
				var _title = '';
				switch (type) {
					case 'mobile':
						_title = reg.mobile(value);
						break;
				}
				if (_title) {
					uni.showToast({
						title: _title,
						icon: 'none'
					});
				}
			},
			myUpload(rsp) {
				console.log(rsp)
				this.url = rsp.path; //更新头像方式一
			},
			openAlbum: function(type) {
				let url = this.$common.uploadUrl();
				let self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths));
						const tempFilePaths = res.tempFilePaths;
						let token = uni.getStorageSync('USER').token;
						new Promise((resolve, reject) => {
							uni.uploadFile({
								url: url,
								header: {
									'token': token
								},
								filePath: tempFilePaths[0],
								name: 'file',
								formData: null,
								success: (res) => {
									console.log(res.data);
									resolve(JSON.parse(res.data).name)
								},
								fail: (res) => {
									console.log('fail upload log' + JSON.stringify(res))
									reject(res)
								}
							})
						}).then((res) => {
							console.log(type);
							if (type == 'avatar') {
								self.baseInfo.headUrl = res
							} else if (type == 'signature') {
								self.baseInfo.signature = res
							}

							console.log(res)
						})

					},
					fail: function(res) {
						console.log(JSON.stringify(res))
					},
					complete: function(res) {
						console.log(JSON.stringify(res))
					}
				})
			},
			save: function() {
				let requestParam = this.baseInfo;
				if (!this.isPassedAway) {
					this.baseInfo.passingAway = '';
					this.passingAwayDate = '请选择';
				}
				if (this.baseInfo.headUrl == this.defaultAvatar) {
					this.baseInfo.headUrl = '';
				}
				this.$http.post('familyUser/createFamilyUser', requestParam).then((res) => {
					if (res.data.code === 200) {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				});
			},
			onNavigationBarButtonTap(e) {
				this.save();
			},
		},
	}
</script>

<style scoped>
	.container {
		padding-left: 30upx;
		padding-right: 30upx;
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
		margin-top: 58upx;
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
</style>
