<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			var lan = 'zh_CN'
			 try {
				lan = uni.getStorageSync('language');
			} catch (e) {
				console.log('error='+e)
			}
			console.log('lan='+lan); 
			 if(lan == 'en_US') {
				 this.$i18n.locale = 'en-US'
			 }
			 if(lan=='zh_CN') {
				 this.$i18n.locale = 'zh-CN'
			 }
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
