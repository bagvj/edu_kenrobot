define(function() {
	return {
		pc: true,
		
		//引导配置
		guide: {
			showIfFirstVisit: true,
			autoNextDelay: 3000,
		},

		project: {
			maxCodeLength: 10 * 1024 * 1024,
		},

		host: "http://platform0.kenrobot.com",

		//chrome扩展app配置
		extension: {
			//Chrome app id
			appId: "hhgmonhbodfiplppmcangkmlfkcnilpd",

			//烧写速度
			uploadDelay: 250,

			bitRate: 115200,
		},
	};
});