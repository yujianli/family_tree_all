<template>
	<view class="container">
		 <radio-group @change="radioChange">
				<label class="inner_title" v-for="(item, index) in items" :key="item.value">
					<view>{{item.name}}</view>
					<view>
						<radio :value="item.value" :checked="index === current" />
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
							checked: 'true'
						},
						{
							value: 'English',
							name: 'English',
						},
					],
					current: 0
			}
		},
		methods: {
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			}
		}
	}
</script>

<style>
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
		height: 440upx;
		height: 110upx;
	}
	.inner_text_2{
		font-size:28upx;
		color: #333;
	}
</style>
