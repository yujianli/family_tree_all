<template>
	<view class="container">
		<view class="wrapper avatar_wrapper" style="position: relative;">
			<image :src="imageUrl" style="width: 154upx;height: 154upx;" @tap="openAlbum('avatar')"></image>
<!-- 			<avatar selWidth="200px" selHeight="400upx" @upload="myUpload" :avatarSrc="imageUrl"
			        avatarStyle="width: 200upx; height: 200upx; border-radius: 100%;">
			</avatar> -->
			<image :src="signatureUrl" style="width: 86upx;height: 86upx;position: absolute;bottom:-22upx;right:46upx" @tap="openAlbum('signature')"></image>
		</view>
		<view class="wrapper">
			<text class="inner_title">姓名</text>
			<input class="input" type="text" v-model="baseInfo.name" placeholder-style="color:#999" placeholder="姓名" />
		</view>
		<view class="wrapper">
			<text class="inner_title">身份证</text>
			<input class="input" type="text" v-model="baseInfo.idCard" placeholder-style="color:#999" placeholder="身份证" @blur="regValid('idcard', baseInfo.idCard)" />
		</view>
		<view class="wrapper">
			<text class="inner_title">性别</text>
			<picker @change="sexBindPickerChange" :value="idx.sex" :range=" arr.sex" range-key="value">
				<view class="input">{{ arr.sex[idx.sex].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">民族</text>
			<!-- <input class="input" type="text" v-model="baseInfo.nationality" placeholder-style="color:#999" placeholder="民族" /> -->
			<picker @change="nationalityBindPickerChange" :value="idx.nationality" :range=" arr.nationality" range-key="value">
				<view class="input">{{ arr.nationality[idx.nationality].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">生肖</text>
			<!-- <input class="input" type="text" v-model="baseInfo.zodiac" placeholder-style="color:#999" placeholder="生肖" value="猴"/> -->
			<picker @change="zodiacBindPickerChange" :value="idx.zodiac" :range=" arr.zodiac" range-key="value">
				<view class="input">{{ arr.zodiac[idx.zodiac].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生年月</text>
			<!-- <input class="input" type="text" v-model="baseInfo.birth" placeholder-style="color:#999" placeholder="出生年月"/> -->
			<picker mode="date" :value="baseInfo.birth !='' ? baseInfo.birth : '请选择'" :start="startDate" :end="endDate" @change="bindDateChange" :fields="'day'">
				<view class="input">{{baseInfo.birth | formatDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生时辰</text>
			<!-- <input class="input" type="text" v-model="baseInfo.birthTime" placeholder-style="color:#999" placeholder="出生时辰"/> -->
			<picker @change="birthTimeBindPickerChange" :value="idx.birthTime" :range=" arr.birthTime" range-key="value">
				<view class="input">{{ arr.birthTime[idx.birthTime].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生地</text>
			<input class="input" type="text" v-model="baseInfo.birthPlace" placeholder-style="color:#999" placeholder="出生地" />
		</view>
		<view class="wrapper">
			<text class="inner_title">是否过世</text>
			<!-- <input class="input" type="text" v-model="baseInfo.isPassedAway" placeholder-style="color:#999" placeholder="是否在世"/> -->
			<switch :checked="isPassedAway" @change="switchChange" class="input" />
		</view>
		<view class="wrapper" :style="{display: isPassedAway ? 'flex' : 'none'}">
			<text class="inner_title">过世年月</text>
			<!-- <input class="input" type="text" v-model="baseInfo.passingAway" placeholder-style="color:#999" placeholder="过世年月"/> -->
			<picker mode="date" :value="baseInfo.passingAway != '' ? baseInfo.passingAway : '请选择'" :start="startDate" :end="endDate" @change="bindPassingAwayDateChange" :fields="'day'">
				<view class="input">{{baseInfo.passingAway | formatDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">居住地</text>
			<input class="input" type="text" v-model="baseInfo.placeResidence" placeholder-style="color:#999" placeholder="居住地"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">固定电话</text>
			<input class="input" type="text" v-model="baseInfo.fixedTelephone" placeholder-style="color:#999" placeholder="固定电话"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">手机号码</text>
			<input class="input" type="text" v-model="baseInfo.mobile" placeholder-style="color:#999" placeholder="手机号码"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">邮箱地址</text>
			<input class="input" type="text" v-model="baseInfo.emailAddress" placeholder-style="color:#999" placeholder="邮箱地址"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">职业</text>
			<input class="input" type="text" v-model="baseInfo.career" placeholder-style="color:#999" placeholder="职业"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">体质</text>
			<!-- <input class="input" type="text" v-model="baseInfo.corporeity" placeholder-style="color:#999" placeholder="体质" value="湿热质"/> -->
			<picker @change="corporeityBindPickerChange" :value="idx.corporeity" :range=" arr.corporeity" range-key="value">
				<view class="input">{{ arr.corporeity[idx.corporeity].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">血型</text>
			<!-- <input class="input" type="text" v-model="baseInfo.bloodType" placeholder-style="color:#999" placeholder="血型" value="O型"/> -->
			<picker @change="bloodTypeBindPickerChange" :value="idx.bloodType" :range=" arr.bloodType" range-key="value">
				<view class="input">{{ arr.bloodType[idx.bloodType].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">基因</text>
			<input class="input" type="text" v-model="baseInfo.gene" placeholder-style="color:#999" placeholder="基因" />
		</view>
		<view class="wrapper">
			<text class="inner_title">气质</text>
			<input class="input" type="text" v-model="baseInfo.temperament" placeholder-style="color:#999" placeholder="气质" />
		</view>
		<view class="wrapper">
			<text class="inner_title">星座</text>
			<picker @change="constellationBindPickerChange" :value="idx.constellation" :range=" arr.constellation" range-key="value">
				<view class="input">{{ arr.constellation[idx.constellation].value }}</view>
			</picker>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">个人简介</text>
			<textarea class="mul_input" v-model="baseInfo.brief" placeholder-style="color:#999" placeholder="个人简介" />
			</view>
		<!-- <button type="primary"  class="login" @tap="save">保存</button> -->
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
					sex:dataJson['sex'],
					zodiac: dataJson['zodiac'],
					nationality: dataJson['nationality'],
					birthTime: dataJson['birthTime'],
					corporeity: dataJson['corporeity'],
					bloodType: dataJson['bloodType'],
					constellation: dataJson['constellation']
				},
				idx:{
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
				defaultSignature:'../../static/images/avatar.png'
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
						this.isPassedAway=_info.isPassedAway==1;
						
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
				console.log(e.target.value);
				// if(_date.length<5){
				// 	uni.showToast({
				// 		title: '请选择日期', icon:'none'
				// 	});
				// 	return false;
				// }
				this.baseInfo.birth = _date;
				console.log(_date);

				// this.birthDate = _date.replace('-','年')+ '月'
				this.birthDate=_date;
			},
			switchChange: function(e){
				this.isPassedAway = e.target.value
				this.baseInfo.isPassedAway = e.target.value?1:0
				console.log('是否在世，携带值为', this.baseInfo.isPassedAway)
			},
			bindPassingAwayDateChange: function(e) {
				console.log(e.target.value);
				let _date = e.target.value
				if(this.isPassedAway) {
					this.baseInfo.passingAway=_date;
					// this.passingAwayDate = _date.replace('-','年')+ '月'
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
				console.log(dataJson[prop])
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
					sizeType:['original', 'compressed'],
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
				let requestParam = this.baseInfo;
				requestParam['dateOfBirth']=util.dateFormat(this.baseInfo.birth);
				delete requestParam['birth'];
				// this.baseInfo['dateOfBirth']= this.baseInfo.birth;
				// delete this.baseInfo['birth'];
				if(!this.isPassedAway){
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
			onNavigationBarButtonTap(e) {
				this.save();
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

