<template>
	<view class="container">
		<view class="wrapper avatar_wrapper" style="position: relative;">
			<view v-if="isEdit">
				<!-- #ifdef APP-PLUS -->
				<avatar selWidth="200px" selHeight="400upx" @upload="headUpload" :avatarSrc="imageUrl"
				        avatarStyle="width: 154upx; height: 154upx; border-radius: 100%;"> 
				</avatar>
				<avatar selWidth="200px" selHeight="400upx" @upload="signatureUpload" :avatarSrc="signatureUrl"
				        avatarStyle="width: 86upx; height: 86upx; position: absolute;bottom:-22upx;right:46upx;border-radius: 100%;"> 
				</avatar>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<image :src="imageUrl" style="width: 154upx;height: 154upx;border-radius: 50%;" @tap="openAlbum('avatar')"></image>
				<image :src="signatureUrl" style="width: 86upx;height: 86upx;position: absolute;bottom:-22upx;right:46upx" @tap="openAlbum('signature')"></image>
				<!-- #endif -->
			</view>
			<view v-else>
				<image :src="imageUrl" style="width: 154upx;height: 154upx;border-radius: 50%;"></image>
				<image :src="signatureUrl" style="width: 86upx;height: 86upx;position: absolute;bottom:-22upx;right:46upx"></image>
			</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">姓名</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.name" placeholder-style="color:#999" placeholder="姓名" />
			</view>
			<view v-else>{{baseInfo.name}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">身份证</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.idCard" placeholder-style="color:#999" placeholder="身份证" />
			</view>
			<view v-else>{{baseInfo.idCard}}</view>
			<!-- @blur="regValid('idcard', baseInfo.idCard)" -->
		</view>
		<view class="wrapper">
			<text class="inner_title">性别</text>
			<view v-if="isEdit">
				<picker @change="sexBindPickerChange" :value="idx.sex" :range=" arr.sex" range-key="value">
					<view class="input">{{ arr.sex[idx.sex].value }}</view>
				</picker>
			</view>
			<view v-else>{{arr.sex[idx.sex].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">民族</text>
			<view v-if="isEdit">
				<picker @change="nationalityBindPickerChange" :value="idx.nationality" :range=" arr.nationality" range-key="value">
					<view class="input">{{ arr.nationality[idx.nationality].value }}</view>
				</picker>
			</view>
			<view v-else>{{arr.nationality[idx.nationality].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">生肖</text>
			<view v-if="isEdit">
				<picker @change="zodiacBindPickerChange" :value="idx.zodiac" :range=" arr.zodiac" range-key="value">
					<view class="input">{{ arr.zodiac[idx.zodiac].value }}</view>
				</picker>
			</view>
			<view v-else>{{arr.zodiac[idx.zodiac].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生年月</text>
			<view v-if="isEdit">
				<picker mode="date" :value="baseInfo.birth !='' ? baseInfo.birth : '请选择'" :start="startDate" :end="endDate" @change="bindDateChange"
				 :fields="'day'">
					<view class="input">{{baseInfo.birth | formatDate}}</view>
				</picker>
			</view>
			<view v-else>{{baseInfo.birth | formatDate}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生时辰</text>
			<view v-if="isEdit">
				<picker @change="birthTimeBindPickerChange" :value="idx.birthTime" :range=" arr.birthTime" range-key="value">
					<view class="input">{{ arr.birthTime[idx.birthTime].value }}</view>
				</picker>
			</view>
			<view v-else>{{arr.birthTime[idx.birthTime].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生地</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.birthPlace" placeholder-style="color:#999" placeholder="出生地" />
			</view>
			<view v-else>{{baseInfo.birthPlace}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">是否过世</text>
			<view v-if="isEdit">
				<picker @change="birthIsPassedAwayBindPickerChange" :value="idx.yesOrNo" :range=" arr.yesOrNo" range-key="value">
					<view class="input">{{ arr.yesOrNo[idx.yesOrNo].value }}</view>
				</picker>
			</view>
			<view v-else>{{arr.yesOrNo[idx.yesOrNo].value}}</view>
		</view>
		<view class="wrapper" :style="{display: baseInfo.isPassedAway ? 'flex' : 'none'}">
			<text class="inner_title">过世年月</text>
			<view v-if="isEdit">
				<picker mode="date" :value="baseInfo.passingAway != '' ? baseInfo.passingAway : '请选择'" :start="startDate" :end="endDate"
				 @change="bindPassingAwayDateChange" :fields="'day'">
					<view class="input">{{baseInfo.passingAway | formatDate}}</view>
				</picker>
			</view>
			<view v-else>{{baseInfo.passingAway | formatDate}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">居住地</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.placeResidence" placeholder-style="color:#999" placeholder="居住地" />
			</view>
			<view v-else>{{baseInfo.placeResidence}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">固定电话</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.fixedTelephone" placeholder-style="color:#999" placeholder="固定电话" />
			</view>
			<view v-else>{{baseInfo.fixedTelephone}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">手机号码</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.mobile" placeholder-style="color:#999" placeholder="手机号码" />
			</view>
			<view v-else>{{baseInfo.mobile}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">邮箱地址</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.emailAddress" placeholder-style="color:#999" placeholder="邮箱地址" />
			</view>
			<view v-else>{{baseInfo.emailAddress}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">职业</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.career" placeholder-style="color:#999" placeholder="职业" />
			</view>
			<view v-else>{{baseInfo.career}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">体质</text>
			<view v-if="isEdit">
				<picker @change="corporeityBindPickerChange" :value="idx.corporeity" :range=" arr.corporeity" range-key="value">
					<view class="input">{{ arr.corporeity[idx.corporeity].value }}</view>
				</picker>
			</view>
			<view v-else>{{arr.corporeity[idx.corporeity].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">血型</text>
			<view v-if="isEdit">
				<picker @change="bloodTypeBindPickerChange" :value="idx.bloodType" :range=" arr.bloodType" range-key="value">
					<view class="input">{{ arr.bloodType[idx.bloodType].value }}</view>
				</picker>
			</view>
			<view v-else>{{arr.bloodType[idx.bloodType].value}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">基因</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.gene" placeholder-style="color:#999" placeholder="基因" />
			</view>
			<view v-else>{{baseInfo.gene}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">气质</text>
			<view v-if="isEdit">
				<input class="input" type="text" v-model="baseInfo.temperament" placeholder-style="color:#999" placeholder="气质" />
			</view>
			<view v-else>{{baseInfo.temperament}}</view>
		</view>
		<view class="wrapper">
			<text class="inner_title">星座</text>
			<view v-if="isEdit">
				<picker @change="constellationBindPickerChange" :value="idx.constellation" :range=" arr.constellation" range-key="value">
					<view class="input">{{ arr.constellation[idx.constellation].value }}</view>
				</picker>
			</view>
			<view v-else>{{arr.constellation[idx.constellation].value}}</view>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">个人简介</text>
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
				birthDate: '请选择',
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
					birth: '',
					bloodType: '',
					birthTime: '',
					fixedTelephone: '',
					nationality: '',
					zodiac: '',
					corporeity: '',
					gene: '',
					brief: '',
					language:'zh_CN',
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
			
		},
		filters: {
			formatDate: function(value) {
				if (!value) return '请选择'
				return util.dateFormat(value)
			}
		},
		onLoad: function (option) {
			this.loadData(option.id)
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
				this.$http.get('base/detailBase', {'baseId':id, 'language':'zn_CH'}).then((res)=>{
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
						this.date=_info.birth;
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
				let _date = e.target.value
				// if(_date.length<5){
				// 	uni.showToast({
				// 		title: '请选择日期', icon:'none'
				// 	});
				// 	return false;
				// }
				this.baseInfo.birth = _date;
				this.birthDate=_date;
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
					sizeType:['original', 'compressed'],
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
				requestParam['dateOfBirth']=util.dateFormat(this.baseInfo.birth);
				delete requestParam['birth'];
				// this.baseInfo['dateOfBirth']= this.baseInfo.birth;
				// delete this.baseInfo['birth'];
				if(!this.baseInfo.isPassedAway){
					this.baseInfo.passingAway='';
					this.passingAwayDate='请选择';
					//delete requestParam['passingAway'];
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
</style>
