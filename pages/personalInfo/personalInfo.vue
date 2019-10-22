<template>
	<view class="container">
		<view class="wrapper avatar_wrapper">
			<image src="../../static/images/avatar.png" style="width: 80px;height: 80px;"></image>
		</view>
		<view class="wrapper">
			<text class="inner_title">姓名</text>
			<input class="input" type="text" v-model="person.name" placeholder-style="color:#999" placeholder="姓名"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">身份证</text>
			<input class="input" type="text" v-model="person.idCard" placeholder-style="color:#999" placeholder="身份证"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">性别</text>
			<input class="input" type="text" v-model="person.sex" placeholder-style="color:#999" placeholder="性别"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">民族</text>
			<input class="input" type="text" v-model="person.nationality" placeholder-style="color:#999" placeholder="民族"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">生肖</text>
			<input class="input" type="text" v-model="person.zodiac" placeholder-style="color:#999" placeholder="生肖" value="猴"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生年月</text>
			<input class="input" type="text" v-model="person.dateOfBirth" placeholder-style="color:#999" placeholder="出生年月"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生时辰</text>
			<input class="input" type="text" v-model="person.birthTime" placeholder-style="color:#999" placeholder="出生时辰"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">出生地</text>
			<input class="input" type="text" v-model="person.birthPlace" placeholder-style="color:#999" placeholder="出生地"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">是否在世</text>
			<input class="input" type="text" v-model="person.isPassedAway" placeholder-style="color:#999" placeholder="是否在世"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">过世年月</text>
			<input class="input" type="text" v-model="person.passingAway" placeholder-style="color:#999" placeholder="过世年月"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">居住地</text>
			<input class="input" type="text" v-model="person.placeResidence" placeholder-style="color:#999" placeholder="居住地" value="浙江杭州"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">固定电话</text>
			<input class="input" type="text" v-model="person.fixedTelephone" placeholder-style="color:#999" placeholder="固定电话" value="0908777"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">手机号码</text>
			<input class="input" type="text" v-model="person.mobile" placeholder-style="color:#999" placeholder="手机号码" value="1993883833"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">邮箱地址</text>
			<input class="input" type="text" v-model="person.emailAddress" placeholder-style="color:#999" placeholder="邮箱地址" value="abdd@qq.com"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">职业</text>
			<input class="input" type="text" v-model="person.career" placeholder-style="color:#999" placeholder="职业" value="工程师"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">体质</text>
			<input class="input" type="text" v-model="person.corporeity" placeholder-style="color:#999" placeholder="体质" value="湿热质"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">血型</text>
			<input class="input" type="text" v-model="person.bloodType" placeholder-style="color:#999" placeholder="血型" value="O型"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">基因</text>
			<input class="input" type="text" v-model="person.gene" placeholder-style="color:#999" placeholder="基因"/>
		</view>
		<view class="wrapper">
			<text class="inner_title">气质</text>
			<input class="input" type="text" v-model="person.temperament" placeholder-style="color:#999" placeholder="气质"/>
		</view>
		<view class="mul_wrapper">
			<text class="inner_title">个人简介</text>
			<textarea class="mul_input" v-model="person.brief" placeholder-style="color:#999" placeholder="个人简介" value="我是一个XX的人 我是一个XX的人 我是一个XX的人"/>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				baseInfo: {
				            name: null,
				            sex: null,
				            career: null,
				            birthPlace: null,
				            placeResidence: null,
				            mobile: null,
				            fixedTelephone: null,
				            nationality: null,
				            birthTime: null,
				            birth: null,
				            zodiac: null,
				            corporeity: null,
				            bloodType: null,
				            gene: null,
				            headUrl: null,
				            brief: null,
				            idCard: null,
				            emailAddress: null,
				            temperament: null,
				            passingAway: null,
				            isPassedAway: null
				        }
			}
		},
		onLoad: function (option) {
			this.loadData(option.id)
		},
		methods: {
			loadData: function(id){
				this.$api.getByToken('base/detailBase', {'baseId':id, 'language':'zn_CH'}).then((res)=>{
					if(res.code === 200){
						this.baseInfo = res.data.baseInfo;
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				})
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
