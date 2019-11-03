
export default {
	//模块ID对应跳转页面路径
	linkUrl: {
		0: "../funcList/funcList",
		1: "../personalInfo/personalInfo",
		2: "../appearance/list",
		7: "../hobby/list"
	},
	//模块ID对应模块类型
	linkFlag:function(moduleId){
		let flag = null;
		switch(moduleId){
			//工资理财
			case 6:
			//爱好
			case 7:
			//文摘
			case 12:
			//八卦风水
			case 18: flag= 'category';break;
				break;
			//计划安排
			case 4:
			//恋爱经历
			case 14:
			//工作经历
			case 15:
			//校园经历
			case 16: flag = 'period';break;
			case 17: flag = 'place'; break;
		}
		return flag;
	}
}
