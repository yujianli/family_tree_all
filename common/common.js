import zhCN from '@/common/language/zh_CN.js'
import enUS from '@/common/language/en_US.js'
export default {
	language: 'zh_CN',
	getLanguage(){
		uni.setStorageSync('language', 'zh_CN')
		return uni.getStorageSync('language')
	},
	setLanguage(type){
		if(type==='English'){
			uni.setStorageSync('language', 'en_US')
		}else{
			uni.setStorageSync('language', 'zh_CN')
		}
	},
	getLanguageData(type){
		if(type==='zh_CN'){
			return zhCN
		}else{
			return enUS
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