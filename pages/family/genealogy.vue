<template>
	<view>
		<button class="btn_delete" @tap="add">添加人员</button>
		<button class="btn_delete" @tap="view">查看人员</button>
		<button class="btn_delete" @tap="remove">删除</button>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	export default {
		data() {
			return {
				param:{
					familyId:null,
					language:null,
					familyUserId:null
				}
			};
		},
		methods:{
			// loadFamilyList:function(){
			// 	this.$http.get('familyUser/familyUserList',{
			// 		familyId:this.param.familyId,
			// 		language:this.param.language
			// 	}).then(res=>{
					
			// 	})
			// },
			loadGenealogy:function(){
				this.$http.get('familyUser/query',{
					familyUserId:this.param.familyUserId,
					language:this.param.language
				}).then(res=>{
					
				})
			},
			add:function(){
				
			}
		}
	}
</script>

<style lang="less">

</style>
