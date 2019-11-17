export default {
	//模块ID对应跳转页面路径
	linkUrl: {
		0: "../funcList/funcList",
		1: "../personalInfo/personalInfo",
		2: "../appearance/list",
		4: "../hobby/stageList",
		5: "../video/video",
		6: "../hobby/list",
		7: "../hobby/list",
		8: "../hobby/list",
		9: "../hobby/list",
		10: "../hobby/list",
		11: "../hobby/list",
		12: "../hobby/list",
		13: "../hobby/list",
		14: "../hobby/stageList",
		15: "../hobby/stageList",
		16: "../hobby/stageList",
		17: "../hobby/placeList",
		18: "../hobby/list",
		19: "../hobby/list",
		21: "../family/trainEdit",
		22: "../hobby/list",
		24: "../hobby/list",
		25: "../hobby/list",
		26: "../hobby/list",
		27: "../hobby/stageList",
		28: "../hobby/list",
		29: "../hobby/list",
		30: "../hobby/list",
		31: "../hobby/stageList",
		32: "../hobby/stageList",
		33: "../family/inherit",
		34: "../video/video"
	},
	//模块ID对应模块类型
	linkFlag: function(moduleId) {
		let flag = null;
		switch (moduleId) {
			//健康状况
			case 8:
				//生活习惯
			case 9:
				//大事记
			case 22:
				//族群协商
			case 24:
				//节日纪事
			case 30:
				flag = 'self';
				break;
				//工资理财
			case 6:
				//爱好
			case 7:
				//喜好产品
			case 10:
				//文摘
			case 12:
				//八卦风水
			case 18:
				//亡故
			case 25:
				//通信记录
			case 26:
				//自媒体关注
			case 28:
				//收藏品
			case 29:
				flag = 'category';
				break;
				//计划安排
			case 4:
				//恋爱经历
			case 14:
				//工作经历
			case 15:
				//校园经历
			case 16:
				//同事朋友
			case 27:
				//车辆
			case 31:
				//婚礼
			case 32:
				flag = 'period';
				break;
				//住宅居室
			case 17:
				flag = 'place';
				break;
		}
		return flag;
	},
	//根据内容请求类型分为flag值传与不传，类型ID（categoryId、periodId、placeId）值传与不传
	requestParam: {
		//不需要flag值（日记，心得感想，格言）
		notFlag: [9, 11, 13, 19, 22],
		//不需要类型ID（日记）
		notTypeId: [9, 11, 13, 17, 19, 22]
	},
	isStage: [4, 14, 15, 16, 17, 27],
	viewCtrlName: {
		4: '计划名称',
		14: '恋爱对象',
		15: '历程',
		16: '历程',
		27: '名字',
		31: '车辆名称',
		32: '婚礼'
	}
}
