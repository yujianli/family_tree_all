<template>
	<view class="container">
		<view class="wrapper avatar_wrapper" style="position: relative;">
			<image :src="imageUrl" style="width: 154upx;height: 154upx;" @tap="openAlbum('avatar')"></image>
			<!-- 			<avatar selWidth="200px" selHeight="400upx" @upload="myUpload" :avatarSrc="imageUrl"
			        avatarStyle="width: 200upx; height: 200upx; border-radius: 100%;">
			</avatar> -->
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.name}}</text>
			<input class="input" type="text" v-model="baseInfo.name" placeholder-style="color:#999" :placeholder="i18n.name" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.mobile}}</text>
			<input class="input" type="text" v-model="baseInfo.mobile" placeholder-style="color:#999" :placeholder="i18n.mobile" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.gender}}</text>
			<picker @change="sexBindPickerChange" :value="idx.sex" :range=" arr.sex" range-key="value">
				<view class="input">{{ arr.sex[idx.sex].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.birth}}</text>
			<picker mode="date" :value="baseInfo.birth !='' ? baseInfo.birth : defaultText.ctrl" :start="startDate" :end="endDate" @change="bindDateChange"
			 :fields="'day'">
				<view class="input">{{baseInfo.birth | formatDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.isPassaway}}</text>
			<switch :checked="isPassedAway" @change="switchChange" class="input" />
		</view>
		<view class="wrapper" :style="{display: isPassedAway ? 'flex' : 'none'}">
			<text class="inner_title">{{i18n.passingAway}}</text>
			<picker mode="date" :value="baseInfo.passingAway != '' ? baseInfo.passingAway : defaultText.ctrl" :start="startDate" :end="endDate"
			 @change="bindPassingAwayDateChange" :fields="'day'">
				<view class="input">{{baseInfo.passingAway | formatDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.career}}</text>
			<input class="input" type="text" v-model="baseInfo.createBy" placeholder-style="color:#999" :placeholder="i18n.career" />
		</view>
		<view class="wrapper">
			<text class="inner_title" v-if="param.language==='zh_CN'">与{{pname}}之间的关系</text>
			<text class="inner_title" v-else>Relationship with {{pname}}</text>
			<picker @change="relationBindPickerChange" :value="idx.relation" :range=" arr.relation" range-key="name">
				<view class="input">{{ arr.relation[idx.relation].name }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.rank}}</text>
			<input class="input" type="text" v-model="baseInfo.ranking" placeholder-style="color:#999" :placeholder="i18n.rank" />
		</view>
	</view>

</template>

<script>
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import dataJson from '@/static/appData.json'
	import util from '@/common/util.js'
	import reg from '@/common/bizRule.js'

	export default {
		//参数familyUserId=20191028000041&familyId=1044&userId=63&language=zh_CN&pname=张大爷&relationId=3
		data() {
			return {
				arr: {
					sex: this.$t('selData').sex,
					relation:[{id:0,name:this.$t('defaultText').ctrl}]
				},
				idx: {
					sex: 0,
					relation:0
				},
				pname:'',
				relation:[],
				birthDate: this.$t('defaultText').ctrl,
				passingAwayDate: this.$t('defaultText').ctrl,
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
					ranking: '',
					mobile: '',
					headUrl: '',
					birth: '',
					createBy: '',
					language: null,
					isPassedAway: 0,
					passingAway: ''
				},
				defaultAvatar: '../../../static/images/avatar.png'
			}
		},
		components: {avatar},
		computed: {
			i18n() {
				return this.$t('common')
			},
			defaultText(){
				return this.$t('defaultText')
			},
			imageUrl: function() {
				if (this.baseInfo.headUrl) {
					return this.$common.picPrefix() + this.baseInfo.headUrl
				} else {
					return this.defaultAvatar
				}
			},
			relationName:function(){
				if(this.relation.length){
					return this.relation.find(item=>item.id===parseInt(this.baseInfo.relationId)).name
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
			this.pname=options.pname
			util.loadObj(this.baseInfo, options)
			this.loadRelation()
		},
		methods: {
			loadRelation:function(){
				this.$http.get('relationType/all',{
					language:this.baseInfo.language
				}).then(res=>{
					if(res.data.code===200){
						this.arr.relation = this.arr.relation.concat(res.data.data.relationType)
					}
				})
			},
			sexBindPickerChange: function(e) {
				this.selProp('sex', e.target.value)
			},
			relationBindPickerChange: function(e) {
				this.idx.relation=e.target.value
				this.baseInfo.relationId=this.arr.relation[e.target.value].id
			},
			bindDateChange: function(e) {
				let _date = e.target.value
				this.baseInfo.birth = _date;
				this.birthDate = _date;
			},
			switchChange: function(e) {
				this.isPassedAway = e.target.value
				this.baseInfo.isPassedAway = e.target.value ? 1 : 0
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
					this.passingAwayDate = this.$t('defaultText').ctrl;
				}

			},
			selProp: function(prop, index) {
				this.idx[prop] = index;
				this.baseInfo[prop] = this.$t('selData')[prop][index].key;
			},
			initProp: function(prop, val) {
				let data=this.$t('selData')
				for (var i = 0; i < data[prop].length; i++) {
					if (data[prop][i].key === val) {
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
					sizeType: ['original'],
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
					this.passingAwayDate = this.$t('defaultText').ctrl;
				}
				if (this.baseInfo.headUrl == this.defaultAvatar) {
					this.baseInfo.headUrl = '';
				}
				this.$http.post('familyUser/createFamilyUser', requestParam).then((res) => {
					if (res.data.code === 200) {
						uni.navigateBack({
							delta:1
						})
					} else {
						uni.showToast({
							title: res.data.message,
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
	page{
		border-top: 1px solid #e5e5e5;
	}
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
