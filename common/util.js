export default {
	//不同对象同属性非空值赋值
	loadObj(obj, newObj) {
		for (var p in newObj) {
			if (newObj[p] && obj[p] !== undefined) {
				obj[p] = newObj[p]
			}
		}
	},
	//时间格式化 默认yyyy-MM-dd
	dateFormat(timestamp, format) {
		let date = new Date(timestamp);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		if(!format){
			return `${year}-${month}-${day}`;
		}
		let _date = null;
		switch(format){
			case 'yyyy/MM/dd':
				_date = `${year}/${month}/${day}`;
				break;
			case 'yyyy.MM.dd':
				_date = `${year}.${month}.${day}`;
				break;
		}
		return _date
	},
	//获取时间
	getDate(type){
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
			
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	},
	//json对象转地址参数
	jsonToQuery(data){
		let _q = '';
		for(var i in data) {
			if(!i) break;
			_q = _q + '&' + i + '=' + data[i];
		}
		if(_q){
			_q = _q.replace('&', '?');
		}
		return _q;
	},
	//对象空值属性过滤
	nullFilter:function(obj){
		for(var i in obj){
			if(obj[i]==null || obj[i]==undefined){
				delete obj[i]
			}
		}
	},
	//对象转换
	/*
		arr:对象，oldProp:旧对象被替换属性,newProp:新对象属性
	*/
	objectTransfer:function(arr,oldProp,newProp){
		let newArr=[];
		for(let k=0;k<arr.length;k++){
			let newObj={};
			for(let i=0;i<newProp.length;i++){
				newObj[newProp[i]]=arr[k][oldProp[i]]
			}
			newArr.push(newObj)
		}
		return newArr
	}

}
