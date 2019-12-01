export default {
	language: 'zh_CN',
	getLanguage(){
		return uni.getStorageSync('language')
	},
	setLanguage(type){
		if(type==='English'){
			uni.setStorageSync('language', 'en_US')
		}else{
			uni.setStorageSync('language', 'zh_CN')
		}
	},
	apiPrefix: 'http://47.99.133.113:8989/api/',
	picPrefix(){
		return this.apiPrefix + 'download?url=';
	},
	uploadUrl(){
		return this.apiPrefix + 'upload';
	},
	deleteImgUrl(){
		return this.apiPrefix + 'resource/delete'
	}
}