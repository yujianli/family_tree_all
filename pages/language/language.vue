<template>
	<view class="container">
		 <radio-group @change="radioChange">
				<label class="inner_title" v-for="(item, index) in items" :key="item.value">
					<view>{{item.name}}</view>
					<view>
						<radio :value="item.value" :checked="index === current" color='#4DC578'/>
					</view>
				</label> 
		</radio-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: [{
							value: 'Chinese',
							name: '简体中文',
							checked: true
						},
						{
							value: 'English',
							name: 'English',
							checked: false
						},
					],
					current: 0
			}
		},
		onLoad:function(){
			let lang=this.$common.getLanguage()
			if(lang==='zh_CN'){
				this.$forceUpdate();
				this.$set(this.items[0], 'checked', true)
			}else{
				this.$forceUpdate();
				this.$set(this.items[1], 'checked', true)
			}
		},
		onNavigationBarButtonTap(e) {
			for(let i=0;i<this.items.length;i++){
				if(this.items[i]['checked']){
					this.$common.setLanguage(this.items[i].value)
					break
				}
			}
			uni.showToast({
				title: '设置成功',icon:'none'
			});
		},
		methods: {
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						this.items[i].checked=true
					}else{
						this.items[i].checked=false
					}
				}
			}
		}
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
	.inner_title{
		font-size: 32upx;
		color: #333;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 110upx;
		border-bottom: 1px solid #F0F4F7;
	}
	.inner_text_2{
		font-size:28upx;
		color: #333;
	}
</style>
