export default {
	idcard(value){
		var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
		return reg.test(value)?'':'身份证号码格式不正确';
	},
	telephone(value){
		var reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
		return reg.test(value)?'':'电话号码格式不正确';
	},
	mobile(value){
		var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
		return reg.test(value)?'':'手机号码格式不正确';
	},
	email(value){
		var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
		return reg.test(value)?'':'邮箱格式不正确';
	}
}