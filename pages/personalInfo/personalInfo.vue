<template>
	<view class="container">
		<view class="wrapper avatar_wrapper" style="position: relative;border-top: none;">
			<view v-if="isEdit">
				<!-- #ifdef APP-PLUS -->
				<avatar selWidth="200px" selHeight="400upx" @upload="headUpload" :avatarSrc="imageUrl" avatarStyle="width: 154upx; height: 154upx; border-radius:100%;">
				</avatar>
				<avatar selWidth="200px" selHeight="400upx" @upload="signatureUpload" :avatarSrc="signatureUrl" avatarStyle="width: 86upx; height: 86upx; position: absolute;bottom:-22upx;right:46upx;border-radius: 20upx;border:2px solid #e5e5e5;">
				</avatar>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<image :src="imageUrl" style="width: 154upx;height: 154upx;border-radius: 50%;" @tap="openAlbum('avatar')"></image>
				<image :src="signatureUrl" style="width: 86upx;height: 86upx;position: absolute;bottom:-22upx;right:46upx;border-radius: 20upx;border:2px solid #e5e5e5" @tap="openAlbum('signature')"></image>
				<!-- #endif -->
			</view>
			<view v-else>
				<image :src="imageUrl" style="width: 154upx;height: 154upx;border-radius: 50%;"></image>
				<image :src="signatureUrl" style="width: 86upx;height: 86upx;position: absolute;bottom:-22upx;right:46upx;border-radius: 20upx;border:2px solid #e5e5e5"></image>
			</view>
		</view>
		<view class="wrapper" style="margin-top: 60upx;">
			<text class="inner_title">{{langData.common.name}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.name" placeholder-style="color:#999" placeholder="姓名" />
			</view>
			<view class="input" v-else>{{baseInfo.name}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.idcard}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.idCard" placeholder-style="color:#999" placeholder="身份证" />
			</view>
			<view class="input" v-else>{{baseInfo.idCard}}</view>
			<!-- @blur="regValid('idcard', baseInfo.idCard)" -->
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.gender}}</text>
			<view v-if="isEdit">
				<picker @change="sexBindPickerChange" :value="idx.sex" :range=" arr.sex" range-key="value">
					<view class="picker_inner">
						<view class="input">{{ arr.sex[idx.sex].value }}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{arr.sex[idx.sex].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.nationality}}</text>
			<view v-if="isEdit">
				<picker @change="nationalityBindPickerChange" :value="idx.nationality" :range=" arr.nationality" range-key="value">
					<view class="picker_inner">
						<view class="input">{{ arr.nationality[idx.nationality].value }}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{arr.nationality[idx.nationality].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.zodiac}}</text>
			<view v-if="isEdit">
				<picker @change="zodiacBindPickerChange" :value="idx.zodiac" :range=" arr.zodiac" range-key="value">
					<view class="picker_inner">
						<view class="input">{{ arr.zodiac[idx.zodiac].value }}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{arr.zodiac[idx.zodiac].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.birth}}</text>
			<view v-if="isEdit">
				<picker mode="date" :value="baseInfo.dateOfBirth !='' ? baseInfo.dateOfBirth : '请选择'" :start="startDate" :end="endDate" 
				@change="bindDateChange"
				 :fields="'day'">
					<view class="picker_inner">
						<view class="input">{{baseInfo.dateOfBirth | formatDate}}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{baseInfo.dateOfBirth | formatDate}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.birthTime}}</text>
			<view v-if="isEdit">
				<picker @change="birthTimeBindPickerChange" :value="idx.birthTime" :range=" arr.birthTime" range-key="value">
					<view class="picker_inner">
						<view class="input">{{ arr.birthTime[idx.birthTime].value }}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{arr.birthTime[idx.birthTime].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.birthPlace}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.birthPlace" placeholder-style="color:#999" placeholder="出生地" />
			</view>
			<view class="input" v-else>{{baseInfo.birthPlace}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.isPassaway}}</text>
			<view v-if="isEdit">
				<picker @change="birthIsPassedAwayBindPickerChange" :value="idx.yesOrNo" :range=" arr.yesOrNo" range-key="value">
					<view class="picker_inner">
						<view class="input">{{ arr.yesOrNo[idx.yesOrNo].value }}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{arr.yesOrNo[idx.yesOrNo].value}}</view>
		</view>
		<view class="wrapper" :style="{display: baseInfo.isPassedAway ? 'flex' : 'none'}">
			<text class="inner_title">{{langData.common.passingAway}}</text>
			<view v-if="isEdit">
				<picker mode="date" :value="baseInfo.passingAway != '' ? baseInfo.passingAway : '请选择'" :start="startDate" :end="endDate"
				 @change="bindPassingAwayDateChange" :fields="'day'">
					<view class="picker_inner">
						<view class="input">{{baseInfo.passingAway | formatDate}}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{baseInfo.passingAway | formatDate}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.placeResidence}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.placeResidence" placeholder-style="color:#999" placeholder="居住地" />
			</view>
			<view class="input" v-else>{{baseInfo.placeResidence}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.fixedTelephone}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.fixedTelephone" placeholder-style="color:#999" placeholder="固定电话" />
			</view>
			<view class="input" v-else>{{baseInfo.fixedTelephone}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.mobile}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.mobile" placeholder-style="color:#999" placeholder="手机号码" />
			</view>
			<view class="input" v-else>{{baseInfo.mobile}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.emailAddress}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.emailAddress" placeholder-style="color:#999" placeholder="邮箱地址" />
			</view>
			<view class="input" v-else>{{baseInfo.emailAddress}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.career}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.career" placeholder-style="color:#999" placeholder="职业" />
			</view>
			<view class="input" v-else>{{baseInfo.career}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.corporeity}}</text>
			<view v-if="isEdit">
				<picker @change="corporeityBindPickerChange" :value="idx.corporeity" :range=" arr.corporeity" range-key="value">
					<view class="picker_inner">
						<view class="input">{{ arr.corporeity[idx.corporeity].value }}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{arr.corporeity[idx.corporeity].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.bloodType}}</text>
			<view v-if="isEdit">
				<picker @change="bloodTypeBindPickerChange" :value="idx.bloodType" :range=" arr.bloodType" range-key="value">
					<view class="picker_inner">
						<view class="input">{{ arr.bloodType[idx.bloodType].value }}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{arr.bloodType[idx.bloodType].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.gene}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.gene" placeholder-style="color:#999" placeholder="基因" />
			</view>
			<view class="input" v-else>{{baseInfo.gene}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.temperament}}</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.temperament" placeholder-style="color:#999" placeholder="气质" />
			</view>
			<view class="input" v-else>{{baseInfo.temperament}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">{{langData.common.constellation}}</text>
			<view v-if="isEdit">
				<picker @change="constellationBindPickerChange" :value="idx.constellation" :range=" arr.constellation" range-key="value">
					<view class="picker_inner">
						<view class="input">{{ arr.constellation[idx.constellation].value }}</view>
						<image src="../../static/images/jiantou.png" class="picker_arrow"></image>
					</view>
				</picker>
			</view>
			<view class="input" v-else>{{arr.constellation[idx.constellation].value}}</view>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">{{langData.common.brief}}</text>
			<template v-if="isEdit">
				<textarea class="mul_input" v-model="baseInfo.brief" placeholder-style="color:#999" placeholder="个人简介" />
				</template>
			<view v-else class="mul_input" style="min-height: 200upx;">{{baseInfo.brief}}</view>
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
					language:null
				},
				arr:{
					yesOrNo:dataJson['yesOrNo'],
					sex:dataJson['sex'],
					zodiac: dataJson['zodiac'],
					nationality: dataJson['nationality'],
					birthTime: dataJson['birthTime'],
					corporeity: dataJson['corporeity'],
					bloodType: dataJson['bloodType'],
					constellation: dataJson['constellation']
				},
				idx:{
					yesOrNo:0,
					sex:0,
					zodiac:0,
					nationality: 0,
					birthTime:0,
					corporeity:0,
					bloodType:0,
					constellation:0
				},
				// birthDate: '请选择',
				passingAwayDate: '请选择',
				startDate:util.getDate('start'),
				endDate:util.getDate('end'),
				isPassedAway: false,
				baseInfo: {
					userId:'',
					name: '',
					sex: '',
					birthPlace: '',
					placeResidence: '',
					mobile: '',
					headUrl: '.',
					signature: '',
					dateOfBirth:'',
					bloodType: '',
					birthTime: '',
					fixedTelephone: '',
					nationality: '',
					zodiac: '',
					corporeity: '',
					gene: '',
					brief: '',
					language: null,
					constellation: '',
					career: '',
					emailAddress: '',
					isPassedAway: 0,
					passingAway: '',
					temperament: '',
					idCard: ''
				},
				defaultAvatar:'../../static/images/avatar.png',
				defaultSignature:'../../static/images/avatar.png',
				isEdit: false
			}
		},
		components:{avatar},
		computed:{
			imageUrl:function(){
				if(this.baseInfo.headUrl){
					return this.$common.picPrefix()+this.baseInfo.headUrl
				} else {
					return this.defaultAvatar
				}
			},
			signatureUrl:function(){
				if(this.baseInfo.signature){
					return this.$common.picPrefix()+this.baseInfo.signature
				} else {
					return this.defaultSignature
				}
			},
			langData:function(){
				let lang=this.$common.getLanguage()
				return this.$common.getLanguageData(lang)
			}
		},
		filters: {
			formatDate: function(value) {
				if (!value) return '请选择'
				return util.dateFormat(value)
			}
		},
		onLoad: function (options) {
			let _name=this.langData.personInfo.title
			uni.setNavigationBarTitle({title: _name});
			util.loadObj(this.param,options)
			this.baseInfo.language=options.language
			this.loadData()
		},
		onNavigationBarButtonTap(e) {
			if(this.isEdit){
				this.save()
			}
			this.isEdit = !this.isEdit;
			const buttonIndex = e.index;
			if (buttonIndex === 0) {
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				let titleObj = currentWebview.getStyle().titleNView;
				if (!titleObj.buttons) return;
				if (titleObj.buttons[0].text == '编辑') {
					titleObj.buttons[0].text = "完成";
				} else {
					titleObj.buttons[0].text = "编辑";
				}
				currentWebview.setStyle({
					titleNView: titleObj
				});
				// #endif
			}
		},
		methods: {
			loadData: function(id){
				this.$http.get('base/selectBase', this.param).then((res)=>{
					if(res.data.code === 200){
						let _info = res.data.data.baseInfo;
						util.loadObj(this.baseInfo, _info);
						this.initProp('sex',_info.sex);
						this.initProp('zodiac',_info.zodiac);
						this.initProp('nationality',_info.nationality);
						this.initProp('birthTime',_info.birthTime);
						this.initProp('corporeity',_info.corporeity);
						this.initProp('bloodType',_info.bloodType);
						this.initProp('constellation',_info.constellation);
						let idx= dataJson['yesOrNo'].findIndex(item=>item.key===_info.isPassedAway)
						this.idx['yesOrNo']=idx
						
					}else{
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				})
			},
			sexBindPickerChange: function(e) {
			    this.sexIndex = e.target.value
				this.selProp('sex', e.target.value)
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
				console.log(e.target.value)
				let _date = e.target.value
				this.baseInfo.dateOfBirth = _date;
				// this.birthDate=_date;
			},
			birthIsPassedAwayBindPickerChange: function(e){
				this.idx['yesOrNo']=e.target.value
				this.baseInfo.isPassedAway=dataJson['yesOrNo'][e.target.value].key;
			},
			bindPassingAwayDateChange: function(e) {
				let _date = e.target.value
				if(this.baseInfo.isPassedAway=1) {
					this.baseInfo.passingAway=_date;
					this.passingAwayDate=_date;
				} else {
					this.baseInfo.passingAway='';
					this.passingAwayDate='请选择';
				}
				
			},
			corporeityBindPickerChange: function(e) {
				this.selProp('corporeity', e.target.value)
			},
			bloodTypeBindPickerChange: function(e) {
				this.selProp('bloodType', e.target.value)
			},
			constellationBindPickerChange: function(e) {
				this.selProp('constellation', e.target.value)
			},
			selProp:function(prop, index){
				this.idx[prop]=index;
				this.baseInfo[prop]=dataJson[prop][index].key;
			},
			initProp:function(prop, val){
				for(var i=0;i<dataJson[prop].length;i++){
					if(dataJson[prop][i].key===val){
						this.idx[prop]=i;
						break;
					}
				}
			},
			regValid:function(type, value){
				var _title = '';
				switch(type){
					// case 'idcard':
					// 	_title = reg.idcard(value);
					// 	break;
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
			headUpload(rsp) {
				console.log(rsp)
				this.url = rsp.path; //更新头像方式一
				this.uploadFile('avatar',this.url)
			},
			signatureUpload(rsp) {
				console.log(rsp)
				this.url = rsp.path; //更新头像方式一
				this.uploadFile('signature',this.url)
			},
			openAlbum:function(type){
				
				let self = this;
				uni.chooseImage({
					count:1,
					sizeType:['original'],
					sourceType:['album'],
					success: function(res){
						console.log(JSON.stringify(res.tempFilePaths));
						const tempFilePaths = res.tempFilePaths;
						self.uploadFile(type, tempFilePaths[0])
						        
					},
					fail:function(res){
						console.log(JSON.stringify(res))
					},
					complete:function(res){
						console.log(JSON.stringify(res))
					}
				})
			},
			uploadFile:function(type,path){
				let url = this.$common.uploadUrl(); 
				let token=uni.getStorageSync('USER').token;
				new Promise((resolve, reject)=>{
					uni.uploadFile({
					    url: url,
						header: {'token':token},
					    filePath: path,
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
						this.baseInfo.headUrl=res
					} else if(type == 'signature'){
						this.baseInfo.signature=res
					}
					
					console.log(res)
				})
			},
			save:function(){
				let requestParam = this.baseInfo;
				if(!this.baseInfo.isPassedAway){
					this.baseInfo.passingAway='';
					this.passingAwayDate='请选择';
					requestParam['passingAway'] = '';
				}
				if(this.baseInfo.headUrl == this.defaultAvatar){
					this.baseInfo.headUrl = '';
				}
				if(this.baseInfo.signature == this.defaultSignature){
					this.baseInfo.signature = '';
				}
				this.$http.post('base/editBase', requestParam).then((res)=>{
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
		border-top: 1px solid #F0F4F7;
	}
	.mul_wrapper{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		padding-top: 40upx;
		border-top: 1px solid #F0F4F7;
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
