<template>
	<view>
		<view style="position:relative">
			<myTab :tabList="tabList" @tabSelect="tabSelect" :tabActiveIdx="tabActiveIdx" />
		</view>
		<view class="container" v-if="tabActiveIdx==1">
			<view class="wrapper avatar_wrapper" style="position: relative;">
				<image :src="eimageUrl" style="width: 154upx;height: 154upx;" @tap="openAlbum"></image>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.name}}</text>
				<input class="input" type="text" v-model="ebaseInfo.name" placeholder-style="color:#999" :placeholder="i18n.name" />
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.mobile}}</text>
				<input class="input" type="text" v-model="ebaseInfo.mobile" placeholder-style="color:#999" :placeholder="i18n.mobile" />
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.gender}}</text>
				<picker @change="sexBindPickerChange" :value="idx.esex" :range=" arr.sex" range-key="value">
					<view class="input">{{ arr.sex[idx.esex].value }}</view>
				</picker>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.birth}}</text>
				<picker mode="date" :value="ebaseInfo.birth !='' ? ebaseInfo.birth : defaultText.ctrl" :start="startDate" :end="endDate"
				 @change="bindDateChange" :fields="'day'">
					<view class="input">{{birth}}</view>
				</picker>
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.birthTime}}</text>
				<picker @change="birthTimeBindPickerChange" :value="idx.ebirthTime" :range=" arr.birthTime" range-key="value">
					<view class="input">{{ arr.birthTime[idx.ebirthTime].value }}</view>
				</picker>
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
				<text class="inner_title">{{i18n.birthPlace}}</text>
				<input class="input" type="text" v-model="ebaseInfo.birthPlace" placeholder-style="color:#999" :placeholder="i18n.birthPlace" />
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.placeResidence}}</text>
				<input class="input" type="text" v-model="ebaseInfo.updateBy" placeholder-style="color:#999" :placeholder="i18n.placeResidence" />
			</view>
			<view class="wrapper">
				<text class="inner_title">{{i18n.career}}</text>
				<input class="input" type="text" v-model="ebaseInfo.createBy" placeholder-style="color:#999" :placeholder="i18n.career" />
			</view>
			<view class="mul_wrapper">
				<text class="inner_title">{{i18n.brief}}</text>
				<textarea class="mul_input" v-model="ebaseInfo.brief" placeholder-style="color:#999" :placeholder="i18n.brief" />
				</view>
	</view>
	<view class="container" v-else-if="tabActiveIdx===0">
		<view class="wrapper avatar_wrapper" style="position: relative;">
				<image :src="cimageUrl" style="width: 154upx;height: 154upx;" @tap="openAlbum"></image>
				</view>
				<view class="wrapper">
					<text class="inner_title">{{i18n.name}}</text>
					<input class="input" type="text" v-model="cbaseInfo.name" placeholder-style="color:#999" :placeholder="i18n.name" />
				</view>
				<view class="wrapper">
					<text class="inner_title">{{i18n.mobile}}</text>
					<input class="input" type="text" v-model="cbaseInfo.mobile" placeholder-style="color:#999" :placeholder="i18n.mobile" />
				</view>
				<view class="wrapper">
					<text class="inner_title">{{i18n.gender}}</text>
					<picker @change="sexBindPickerChange" :value="idx.csex" :range=" arr.sex" range-key="value">
						<view class="input">{{ arr.sex[idx.csex].value }}</view>
					</picker>
				</view>
				<view class="wrapper">
					<text class="inner_title">{{i18n.birth}}</text>
					<picker mode="date" :value="cbaseInfo.birth !='' ? cbaseInfo.birth : defaultText.ctrl" :start="startDate" :end="endDate"
					 @change="bindDateChange" :fields="'day'">
						<view class="input">{{cbaseInfo.birth | formatDate}}</view>
					</picker>
				</view>
				<view class="wrapper">
					<text class="inner_title">{{i18n.birthTime}}</text>
					<picker @change="birthTimeBindPickerChange" :value="idx.cbirthTime" :range=" arr.birthTime" range-key="value">
						<view class="input">{{ arr.birthTime[idx.cbirthTime].value }}</view>
					</picker>
				</view>
				<view class="wrapper">
					<text class="inner_title">{{i18n.career}}</text>
					<input class="input" type="text" v-model="cbaseInfo.createBy" placeholder-style="color:#999" :placeholder="i18n.career" />
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
					<input class="input" type="text" v-model="cbaseInfo.ranking" placeholder-style="color:#999" :placeholder="i18n.rank" />
				</view>
	</view>
	</view>
</template>

<script>
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import myTab from '@/components/xyz-tab';
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
				tabActiveIdx: 0,
				tabList:[{label:'成员新增'},{label:'成员编辑'}],
				arr:{
					sex: this.$t('selData').sex,
					zodiac: this.$t('selData').zodiac,
					birthTime: this.$t('selData').birthTime,
					nationality: this.$t('selData').nationality,
					relation: [{
						id: 0,
						name: this.$t('defaultText').ctrl
					}]
				},
				idx:{
					csex:0,
					esex:0,
					zodiac:0,
					cbirthTime:0,
					ebirthTime:0,
					nationality: 0,
					relation: 0
				},
				birthDate: this.$t('defaultText').ctrl,
				startDate:util.getDate('start'),
				endDate:util.getDate('end'),
				pname: '',
				relation: [],
				ebaseInfo: {
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
				},
				cbaseInfo: {
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
				},
				defaultAvatar:'../../../static/images/avatar.png',
				isFather: null,
				isMother: null,
				isSpouse: null
			}
		},
		components:{avatar,myTab},
		computed:{
			i18n() {
				return this.$t('common')
			},
			defaultText(){
				return this.$t('defaultText')
			},
			cimageUrl:function(){
				if(this.cbaseInfo.headUrl){
					return this.$common.picPrefix()+this.cbaseInfo.headUrl
				} else {
					return this.defaultAvatar
				}
			},
			eimageUrl:function(){
				if(this.ebaseInfo.headUrl){
					return this.$common.picPrefix()+this.ebaseInfo.headUrl
				} else {
					return this.defaultAvatar
				}
			},
			birth:function(){
				if(this.ebaseInfo.birth){
					return util.dateFormat(this.ebaseInfo.birth)
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
			this.pname = options.pname
			this.isFather = options.isFather
			this.isMother = options.isMother
			this.isSpouse = options.isSpouse
			util.loadObj(this.param,options)
			this.loadRelation()
			this.loadData()
		},
		methods: {
			tabSelect(idx) {
				this.tabActiveIdx = idx;
			},
			loadData: function(){
				this.$http.post('familyUser/detilFamilyUser', {
					familyUserId:this.param.familyUserId,
					userId:this.param.userId,
					language: this.param.language,
					}).then((res)=>{
					if(res.data.code === 200){
						let _info = res.data.data.familyUserInfo;
						_info.birth=util.dateFormat(_info.birth,'yyyy-MM-dd')
						util.loadObj(this.ebaseInfo, _info);
						this.initProp('sex','esex',_info.sex);
						this.initProp('zodiac','zodiac',_info.zodiac);
						this.initProp('nationality','nationality',_info.nationality);
						this.initProp('birthTime','ebirthTime', parseInt(_info.birthTime));
						this.date=_info.birth;
					}else{
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						});
					}
				})
			},
			loadRelation: function() {
				this.$http.get('relationType/all', {
					language: this.param.language
				}).then(res => {
					if (res.data.code === 200) {
						let arrays = res.data.data.relationType
						if (this.isSpouse === '0') {
							arrays.splice(4, 2)
						}
						if (this.isMother === '0') {
							arrays.splice(1, 1)
						}
						if (this.isFather === '0') {
							arrays.splice(0, 1)
						}
						this.arr.relation = this.arr.relation.concat(arrays)
					}
				})
			},
			sexBindPickerChange: function(e) {
				if(this.tabActiveIdx===0){
					this.idx['csex']=e.target.value;
					this.cbaseInfo['sex']=this.$t('selData')['sex'][e.target.value].key;
				}else{
					this.idx['esex']=e.target.value;
					this.ebaseInfo['sex']=this.$t('selData')['sex'][e.target.value].key;
				}
			},
			nationalityBindPickerChange: function(e) {
				this.idx['nationality']=e.target.value;
				this.ebaseInfo['nationality']=this.$t('selData')['nationality'][e.target.value].key;
			},
			zodiacBindPickerChange: function(e) {
				this.idx['zodiac']=e.target.value;
				this.ebaseInfo['zodiac']=this.$t('selData')['zodiac'][e.target.value].key;
			},
			birthTimeBindPickerChange: function(e) {
				// this.selProp('birthTime', e.target.value)
				if(this.tabActiveIdx===0){
					this.idx.cbirthTime=e.target.value
					this.cbaseInfo.birthTime=this.$t('selData').birthTime[e.target.value].key
				}else{
					this.idx.ebirthTime=e.target.value
					this.ebaseInfo.birthTime=this.$t('selData').birthTime[e.target.value].key
				}
			},
			bindDateChange: function(e) {
				let _date = e.target.value
				if(this.tabActiveIdx===0){
					this.cbaseInfo.birth = _date;
					this.birthDate=_date;
				}else{
					this.ebaseInfo.birth = _date;
					this.birthDate=_date;
				}
			},
			relationBindPickerChange: function(e) {
				this.idx.relation = e.target.value
				this.cbaseInfo.relationId = this.arr.relation[e.target.value].id
			},
			initProp:function(prop, asProp, val){
				if(!val)return
				let data =this.$t('selData')
				for(var i=0;i<data[prop].length;i++){
					if(data[prop][i].key===val){
						this.idx[asProp]=i;
						break;
					}
				}
			},
			regValid:function(type, value){
				var _title = '';
				switch(type){
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
			openAlbum:function(){
				let url = this.$common.uploadUrl(); 
				let self = this;
				uni.chooseImage({
					count:1,
					sizeType:['original'],
					sourceType:['album'],
					success: function(res){
						// console.log(JSON.stringify(res.tempFilePaths));
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
							if(this.tabActiveIdx===0){
								self.cbaseInfo.headUrl=res
							}else{
								self.ebaseInfo.headUrl=res
							}
							// console.log(res)
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
			addRecord(){
				let requestParam = this.cbaseInfo;
				if (this.cbaseInfo.headUrl == this.defaultAvatar) {
					this.cbaseInfo.headUrl = '';
				}
				requestParam.passingAway=''
				requestParam.isPassedAway=0
				requestParam.familyUserId=this.param.familyUserId
				requestParam.familyId=this.param.familyId
				requestParam.userId=this.param.userId
				requestParam.language=this.param.language
				this.$http.post('familyUser/createFamilyUser', requestParam).then((res) => {
					if (res.data.code === 200) {
						uni.navigateBack({
							delta: 1
						})
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				});
			},
			editRecord(){
				if(this.ebaseInfo.headUrl == this.defaultAvatar){
					this.ebaseInfo.headUrl = '';
				}
				this.ebaseInfo.familyUserId=this.param.familyUserId
				this.ebaseInfo.language=this.param.language
				this.$http.post('familyUser/editFamilyUser', this.ebaseInfo).then((res)=>{
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
				if(this.tabActiveIdx===0){
					this.addRecord()
				}else{
					this.editRecord()
				}
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
