
export default {
	//模块ID对应跳转页面路径
	linkUrl: {
		0: "../funcList/funcList",
		1: "../personalInfo/personalInfo",
		2: "../appearance/list",
		6: "../hobby/list",
		7: "../hobby/list",
		11: "../hobby/list",
		12: "../hobby/list",
		18: "../hobby/list"
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
	},
	//根据内容请求类型分为flag值传与不传，类型ID（categoryId、periodId、placeId）值传与不传
	requestParam:{
		//不需要flag值（日记，心得感想，格言）
		notFlag:[11,13,19],
		//不需要类型ID（日记）
		notTypeId:[11]
	}
}
