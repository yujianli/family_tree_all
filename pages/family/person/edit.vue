<template>
	<view class="container">
		<view class="wrapper avatar_wrapper" style="position: relative;">
			<image :src="imageUrl" style="width: 154upx;height: 154upx;" @tap="openAlbum('avatar')"></image>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.name}}</text>
			<input class="input" type="text" v-model="baseInfo.name" placeholder-style="color:#999" :placeholder="i18n.name" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.nationality}}</text>
			<picker @change="nationalityBindPickerChange" :value="idx.nationality" :range=" arr.nationality" range-key="value">
				<view class="input">{{ arr.nationality[idx.nationality].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.zodiac}}</text>
			<picker @change="zodiacBindPickerChange" :value="idx.zodiac" :range=" arr.zodiac" range-key="value">
				<view class="input">{{ arr.zodiac[idx.zodiac].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.birth}}</text>
			<picker mode="date" :value="baseInfo.birth !='' ? baseInfo.birth : defaultText.ctrl" :start="startDate" :end="endDate" @change="bindDateChange"
			 :fields="'day'">
				<view class="input">{{baseInfo.birth | formatDate}}</view>
			</picker>
		</view>
<!-- 		<view class="wrapper">
			<text class="inner_title">出生时辰</text>
			<picker @change="birthTimeBindPickerChange" :value="idx.birthTime" :range=" arr.birthTime" range-key="value">
				<view class="input">{{ arr.birthTime[idx.birthTime].value }}</view>
			</picker>
		</view> -->
		<view class="wrapper">
			<text class="inner_title">{{i18n.birthPlace}}</text>
			<input class="input" type="text" v-model="baseInfo.birthPlace" placeholder-style="color:#999" :placeholder="i18n.birthPlace" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.placeResidence}}</text>
			<input class="input" type="text" v-model="baseInfo.updateBy" placeholder-style="color:#999" :placeholder="i18n.placeResidence" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.fixedTelephone}}</text>
			<input class="input" type="text" v-model="baseInfo.fixedTelephone" placeholder-style="color:#999" :placeholder="i18n.fixedTelephone" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.career}}</text>
			<input class="input" type="text" v-model="baseInfo.createBy" placeholder-style="color:#999" :placeholder="i18n.career" />
		</view>
		<view class="wrapper">
			<text class="inner_title">{{i18n.corporeity}}</text>
			<picker @change="corporeityBindPickerChange" :value="idx.corporeity" :range=" arr.corporeity" range-key="value">
				<view class="input">{{ arr.corporeity[idx.corporeity].value }}</view>
			</picker>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">{{i18n.brief}}</text>
			<textarea class="mul_input" v-model="baseInfo.brief" placeholder-style="color:#999" :placeholder="i18n.brief" />
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
				param:{
					userId:null,
					familyUserId:null,
					language:null,
					familyId:null,
				},
				arr:{
					zodiac: this.$t('selData').zodiac,
					birthTime: this.$t('selData').birthTime,
					nationality: this.$t('selData').nationality,
					corporeity: this.$t('selData').corporeity
				},
				idx:{
					zodiac:0,
					birthTime:0,
					nationality: 0,
					corporeity:0
				},
				birthDate: this.$t('defaultText').ctrl,
				passingAwayDate: this.$t('defaultText').ctrl,
				startDate:util.getDate('start'),
				endDate:util.getDate('end'),
				baseInfo: {
					familyUserId: null,
					name: '',
					sex: '',
					birthPlace: '',
					updateBy: '',
					mobile: '',
					headUrl: '',
					birth: '',
					fixedTelephone: '',
					nationality: '',
					zodiac: '',
					corporeity: '',
					brief: '',
					language: null,
					createBy: '',
					passingAway:'',
					isPassedAway:null
				},
				defaultAvatar:'../../../static/images/avatar.png'
			}
		},
		components:{avatar},
		computed:{
			i18n() {
				return this.$t('common')
			},
			defaultText(){
				return this.$t('defaultText')
			},
			imageUrl:function(){
				if(this.baseInfo.headUrl){
					return this.$common.picPrefix()+this.baseInfo.headUrl
				} else {
					return this.defaultAvatar
				}
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return '请选择'
				return util.dateFormat(value)
			}
		},
		onLoad: function (options) {
			util.loadObj(this.param,options)
			this.loadData()
		},
		methods: {
			loadData: function(){
				this.$http.post('familyUser/detilFamilyUser', {
					familyUserId:this.param.familyUserId,
					userId:this.param.userId,
					language: this.param.language,
					}).then((res)=>{
					if(res.data.code === 200){
						let _info = res.data.data.familyUserInfo;
						_info.birth=util.dateFormat(_info.birth)
						util.loadObj(this.baseInfo, _info);
						this.initProp('sex',_info.sex);
						this.initProp('zodiac',_info.zodiac);
						this.initProp('nationality',_info.nationality);
						this.initProp('birthTime',_info.birthTime);
						this.initProp('corporeity',_info.corporeity);
						this.initProp('constellation',_info.constellation);
						this.date=_info.birth;
						this.isPassedAway=_info.isPassedAway==1;
						
					}else{
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			nationalityBindPickerChange: function(e) {
				this.selProp('nationality', e.target.value)
			},
			zodiacBindPickerChange: function(e) {
				this.selProp('zodiac', e.target.value)
			},
			birthTimeBindPickerChange: function(e) {
				this.selProp('birthTime', e.target.value)
			},
			bindDateChange: function(e) {
				let _date = e.target.value
				this.baseInfo.birth = _date;
				this.birthDate=_date;
			},
			corporeityBindPickerChange: function(e) {
				this.selProp('corporeity', e.target.value)
			},
			constellationBindPickerChange: function(e) {
				this.selProp('constellation', e.target.value)
			},
			selProp:function(prop, index){
				this.idx[prop]=index;
				this.baseInfo[prop]=this.$t('selData')[prop][index].key;
			},
			initProp:function(prop, val){
				if(!val)return
				let data =this.$t('selData')
				for(var i=0;i<data[prop].length;i++){
					if(data[prop][i].key===val){
						this.idx[prop]=i;
						break;
					}
				}
			},
			regValid:function(type, value){
				var _title = '';
				switch(type){
					case 'idcard':
						_title = reg.idcard(value);
						break;
					case 'email': 
						_title=reg.email(value);
						break;
					case 'telephone':
						_title = reg.telephone(value);
						break;
					case 'mobile':
						_title = reg.mobile(value);
						break;
				}
				if(_title){
					uni.showToast({
						title: _title,icon:'none'
					});
				}
			},
			myUpload(rsp) {
				console.log(rsp)
				this.url = rsp.path; //更新头像方式一
				
			},
			openAlbum:function(type){
				let url = this.$common.uploadUrl(); 
				let self = this;
				uni.chooseImage({
					count:1,
					sizeType:['original'],
					sourceType:['album'],
					success: function(res){
						console.log(JSON.stringify(res.tempFilePaths));
						const tempFilePaths = res.tempFilePaths;
						let token=uni.getStorageSync('USER').token;
						new Promise((resolve, reject)=>{
							uni.uploadFile({
							    url: url,
								header: {'token':token},
							    filePath: tempFilePaths[0],
							    name: 'file',
							    formData: null,
							    success: (res) => {
							        console.log(res.data);
									resolve(JSON.parse(res.data).name)
							    },
								fail:(res)=>{
									console.log('fail upload log'+ JSON.stringify(res))
									reject(res)
								}
							})
						}).then((res)=>{
							console.log(type);
							if(type =='avatar'){
								self.baseInfo.headUrl=res
							} else if(type == 'signature'){
								self.baseInfo.signature=res
							}
							
							console.log(res)
						})
						        
					},
					fail:function(res){
						console.log(JSON.stringify(res))
					},
					complete:function(res){
						console.log(JSON.stringify(res))
					}
				})
			},
			save:function(){
				if(this.baseInfo.headUrl == this.defaultAvatar){
					this.baseInfo.headUrl = '';
				}
				this.baseInfo.familyUserId=this.param.familyUserId
				this.baseInfo.language=this.param.language
				this.$http.post('familyUser/editFamilyUser', this.baseInfo).then((res)=>{
					if(res.data.code===200){
						uni.showToast({
							title: '保存成功',icon:'none'
						});
					}else{
						uni.showToast({
							title: '保存失败', icon:'none'
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
		margin-top: 58upx;
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
	.input {
		font-size: 34upx;
		color: #303641;
		flex: 1;
		text-align: right;
	}
</style>
