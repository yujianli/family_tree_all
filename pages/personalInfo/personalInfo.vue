<template>
	<view class="container">
		<view class="wrapper avatar_wrapper">
			<image src="baseInfo.headUrl" style="width: 80px;height: 80px;"></image>
		</view>
		<view class="wrapper">
			<text class="inner_title">姓名</text>
			<input class="input" type="text" v-model="baseInfo.name" placeholder-style="color:#999" placeholder="姓名"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">身份证</text>
			<input class="input" type="text" v-model="baseInfo.idCard" placeholder-style="color:#999" placeholder="身份证" @blur="regValid('idcard', baseInfo.idCard)"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">性别</text>
		<picker @change="sexBindPickerChange" :value="idx.sex" :range=" arr.sex" range-key="value">
			<view class="uni-input">{{  arr.sex[idx.sex].value }}</view>
		</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">民族</text>
			<input class="input" type="text" v-model="baseInfo.nationality" placeholder-style="color:#999" placeholder="民族"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">生肖</text>
			<!-- <input class="input" type="text" v-model="baseInfo.zodiac" placeholder-style="color:#999" placeholder="生肖" value="猴"/> -->
			<picker @change="zodiacBindPickerChange" :value="idx.zodiac" :range=" arr.zodiac" range-key="value">
				<view class="uni-input">{{  arr.zodiac[idx.zodiac].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生年月</text>
			<!-- <input class="input" type="text" v-model="baseInfo.birth" placeholder-style="color:#999" placeholder="出生年月"/> -->
		<picker mode="date" :value="baseInfo.birth" :start="startDate" 
		:end="endDate" @change="bindDateChange" :fields="'month'">
			<view class="uni-input">{{birthDate}}</view>
		</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生时辰</text>
			<!-- <input class="input" type="text" v-model="baseInfo.birthTime" placeholder-style="color:#999" placeholder="出生时辰"/> -->
			<picker @change="birthTimeBindPickerChange" :value="idx.birthTime" :range=" arr.birthTime" range-key="value">
				<view class="uni-input">{{  arr.birthTime[idx.birthTime].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生地</text>
			<input class="input" type="text" v-model="baseInfo.birthPlace" placeholder-style="color:#999" placeholder="出生地"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">是否过世</text>
			<!-- <input class="input" type="text" v-model="baseInfo.isPassedAway" placeholder-style="color:#999" placeholder="是否在世"/> -->
			<switch checked="isPassedAway" @change="switchChange" />
		</view>
		<view class="wrapper">
			<text class="inner_title">过世年月</text>
			<!-- <input class="input" type="text" v-model="baseInfo.passingAway" placeholder-style="color:#999" placeholder="过世年月"/> -->
			<picker class="input" mode="date" :value="baseInfo.passingAway" :start="startDate"
			:end="endDate" @change="bindPassingAwayDateChange" :fields="'month'">
				<view>{{passingAwayDate}}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">居住地</text>
			<input class="input" type="text" v-model="baseInfo.placeResidence" placeholder-style="color:#999" placeholder="居住地" value="浙江杭州"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">固定电话</text>
			<input class="input" type="text" v-model="baseInfo.fixedTelephone" placeholder-style="color:#999" placeholder="固定电话" value="0908777"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">手机号码</text>
			<input class="input" type="text" v-model="baseInfo.mobile" placeholder-style="color:#999" placeholder="手机号码" value="1993883833"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">邮箱地址</text>
			<input class="input" type="text" v-model="baseInfo.emailAddress" placeholder-style="color:#999" placeholder="邮箱地址" value="abdd@qq.com"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">职业</text>
			<input class="input" type="text" v-model="baseInfo.career" placeholder-style="color:#999" placeholder="职业" value="工程师"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">体质</text>
			<!-- <input class="input" type="text" v-model="baseInfo.corporeity" placeholder-style="color:#999" placeholder="体质" value="湿热质"/> -->
			<picker @change="corporeityBindPickerChange" :value="idx.corporeity" :range=" arr.corporeity" range-key="value">
				<view class="uni-input">{{  arr.corporeity[idx.corporeity].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">血型</text>
			<!-- <input class="input" type="text" v-model="baseInfo.bloodType" placeholder-style="color:#999" placeholder="血型" value="O型"/> -->
			<picker @change="bloodTypeBindPickerChange" :value="idx.bloodType" :range=" arr.bloodType" range-key="value">
				<view class="uni-input">{{  arr.bloodType[idx.bloodType].value }}</view>
			</picker>
		</view>
		<view class="wrapper">
			<text class="inner_title">基因</text>
			<input class="input" type="text" v-model="baseInfo.gene" placeholder-style="color:#999" placeholder="基因"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">气质</text>
			<input class="input" type="text" v-model="baseInfo.temperament" placeholder-style="color:#999" placeholder="气质"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">星座</text>
			<picker @change="constellationBindPickerChange" :value="idx.constellation" :range=" arr.constellation" range-key="value">
				<view class="uni-input">{{  arr.constellation[idx.constellation].value }}</view>
			</picker>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">个人简介</text>
			<textarea class="mul_input" v-model="baseInfo.brief" placeholder-style="color:#999" placeholder="个人简介" value="我是一个XX的人 我是一个XX的人 我是一个XX的人"/>
		</view>
		<button type="primary"  class="login" @tap="save">保存</button>
	</view>

</template>

<script>
	import dataJson from '@/static/appData.json'
	import util from '@/common/util.js'
	import reg from '@/common/bizRule.js'
	function getDate(type){
				const date = new Date();
			
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
			
			
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				return `${year}年${month}月`;
			}
	export default {
		data() {
			return {
				 arr:{
					sex:dataJson['sex'],
					zodiac: dataJson['zodiac'],
					birthTime: dataJson['birthTime'],
					corporeity: dataJson['corporeity'],
					bloodType: dataJson['bloodType'],
					constellation: dataJson['constellation']
				},
				idx:{
					sex:0,
					zodiac:0,
					birthTime:0,
					corporeity:0,
					bloodType:0,
					constellation:0
				},
				// sexArray: dataJson['sex'],
				// sexIndex: 0,
				// zodiacArray: dataJson['zodiac'],
				// zodiacIndex: 0,
				// birthTimeArray: dataJson['birthTime'],
				// birthTimeIndex: 0,
				// corporeityArray: dataJson['corporeity'],
				// corporeityIndex: 0,
				// bloodTypeArray: dataJson['bloodType'],
				// bloodTypeIndex: 0,
				// constellationArray: dataJson['constellation'],
				// constellationIndex: 0,
				birthDate: getDate(),
				passingAwayDate: '请选择',
				startDate:getDate('start'),
				endDate:getDate('end'),
				isPassedAway: false,
				baseInfo: {
							userId:'',
				            name: '',
				            sex: '',
				            birthPlace: '',
				            placeResidence: '',
				            mobile: '',
							headUrl: '../../static/images/avatar.png',
							birth: getDate({format:true}),
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
				        }
			}
		},
		onLoad: function (option) {
			this.loadData(option.id)
		},
		methods: {
			loadData: function(id){
				this.$api.getByToken('base/detailBase', {'baseId':id, 'language':'zn_CH'}).then((res)=>{
					if(res.data.code === 200){
						let _info = res.data.data.baseInfo;
						util.loadObj(this.baseInfo, _info);
						this.initProp('sex',_info.sex);
						this.initProp('zodiac',_info.zodiac);
						this.initProp('birthTime',_info.birthTime);
						this.initProp('corporeity',_info.corporeity);
						this.initProp('bloodType',_info.bloodType);
						this.initProp('constellation',_info.constellation);
						this.date=_info.birth;
						this.isPassedAway=_info.birth==1;
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
			zodiacBindPickerChange: function(e) {
			    // this.zodiacIndex = e.target.value
				this.selProp('zodiac', e.target.value)
			},
			birthTimeBindPickerChange: function(e) {
			    // this.birthTimeIndex = e.target.value
				this.selProp('birthTime', e.target.value)
			},
			bindDateChange: function(e) {
				let _date = e.target.value
				console.log(e.target.value);
				if(_date.length<5){
					uni.showToast({
						title: '请选择日期', icon:'none'
					});
					return false;
				}
				this.baseInfo.birth = _date;
				console.log(_date);

				this.birthDate = _date.replace('-','年')+ '月'
			},
			switchChange: function(e){
				this.isPassedAway = e.target.value
				this.baseInfo.isPassedAway = e.target.value?1:0
				console.log('是否在世，携带值为', this.baseInfo.isPassedAway)
			},
			bindPassingAwayDateChange: function(e) {
				let _date = e.target.value
				if(_date.length<5){
					uni.showToast({
						title: '请选择日期', icon:'none'
					});
					return false;
				}
				this.baseInfo.passingAway=_date;
				this.passingAwayDate = _date.replace('-','年')+ '月'
			},
			corporeityBindPickerChange: function(e) {
			    // this.corporeityIndex = e.target.value
				this.selProp('corporeity', e.target.value)
			},
			bloodTypeBindPickerChange: function(e) {
			    // this.bloodTypeIndex = e.target.value
				this.selProp('bloodType', e.target.value)
			},
			constellationBindPickerChange: function(e) {
			    // this.constellationIndex = e.target.value
				this.selProp('constellation', e.target.value)
			},
			selProp:function(prop, index){
				this.idx[prop]=index;
				this.baseInfo[prop]=dataJson[prop][index].key;
			},
			initProp:function(prop, val){
				for(var i=0;i<dataJson[prop].length;i++){
					if(dataJson[prop][i].value===val){
						this.idx[prop]=dataJson[prop][i].key;
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
			save:function(){
				this.baseInfo['dateOfBirth']= this.baseInfo.birth;
				delete this.baseInfo['birth'];
				this.$api.postByToken('base/editBase', this.baseInfo).then((res)=>{
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
			}
		}
	}
</script>

<style>
	.container{
		padding-left:15px;
		padding-right:15px;
	}
	.wrapper{
		height: 55px;
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
		margin-top: 22px;
		justify-content: center;
		margin-bottom: 18px;
	}
	.inner_title{
		font-size: 17px;
		color: #333;
		margin-right: 20px;
	}
	.input{
		font-size: 17px;
		color: #303641;
		flex:1;
		text-align:right;
	}
	.mul_input{
		font-size: 17px;
		color: #303641;
		flex: 1;
		
		
	}
</style>
