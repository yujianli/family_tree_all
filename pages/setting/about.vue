<template>
	<view style="padding: 30upx;">
		<u-parse :content="article" @preview="preview" @navigate="navigate" />
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		data() {
			return {
				article: '',
				type: null
			}
		},
		components: {
			uParse
		},
		onLoad:function(options){
			this.type=options.type
			uni.setNavigationBarTitle({
				title: this.type==='about'?this.$t('common').about : this.$t('common').privacy
			});
			this.loadData()
		},
		methods: {
			loadData() {
				uni.request({
					url: 'http://47.99.133.113:9693/api/config/list',
					success: (res) => {
						if(this.type==='about'){
							this.article = res.data.data.aboutUs
						}else{
							this.article=res.data.data.privacyPolicy
						}
						
					}
				})
			},
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			}
		},
	}
</script>

<style>
</style>
