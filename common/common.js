export default {
	language: 'zh_CN',
	setZhCn(){
		this.language='zh_CN';
	},
	setEnUs(){
		this.language='en_US';
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