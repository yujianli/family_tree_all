import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
// export const test = (data) => {
// 	/* http.config.baseUrl = "http://localhost:8080/api/"
// 	//设置请求前拦截器
// 	http.interceptor.request = (config) => {
// 		config.header = {
// 			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// 		}
// 	} */
// 	//设置请求结束后拦截器
// 	http.interceptor.response = (response) => {
// 		console.log('个性化response....')
// 		//判断返回状态 执行相应操作
// 		return response;
// 	}
//     return http.request({
// 		baseUrl: 'https://unidemo.dcloud.net.cn/',
//         url: 'ajax/echo/text?name=uni-app',
// 		dataType: 'text',
//         data,
//     })
// }

// // 轮播图
// export const banner = (data) => {
//     return http.request({
//         url: '/banner/36kr',
//         method: 'GET', 
//         data,
// 		// handle:true
//     })
// }

export const getByToken = (url, data) => {
	http.interceptor.request = (config) => {
		let info = uni.getStorageInfoSync('USER');
		config.header = {
			"token": info.token
			//"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2MSJ9.l9gwfxqVh8dYqiMODN8-M4iq8RpscvYm9l-oqy0zjxQ"
		}
	}
	if(data){
		let _url = '';
		for(var i in data) {
			if(!i) break;
			_url = _url + '&' + i + '=' + data[i];
		}
		if(_url){
			_url = _url.replace('&', '?');
			url += _url;
		}
	}
	return http.request({url: url});
}

export const postByToken = (url, data) => {
	http.interceptor.request = (config) => {
		let info = uni.getStorageInfoSync('USER');
		config.header = {
			"token": info.token,
			//"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2MSJ9.l9gwfxqVh8dYqiMODN8-M4iq8RpscvYm9l-oqy0zjxQ",
			'Content-Type':'application/x-www-form-urlencoded'
		}
	}
	return http.request({url: url, data: data, method: 'post'});
}



// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	// test,
 //    banner,
	getByToken,
	postByToken
}