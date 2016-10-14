define(function() {	
	return {
		debug: false,
		greet: "     __ __           ____        __          __ \n    / //_/__  ____  / __ \\\____  / /_  ____  / /_\n   / ,< / _ \\\/ __ \\\/ /_/ / __ \\\/ __ \\\/ __ \\\/ __/\n  / /| /  __/ / / / _, _/ /_/ / /_/ / /_/ / /_  \n /_/ |_\\\___/_/ /_/_/ |_|\\\____/_.___/\____/\\\__/  \n\n啃萝卜是一款在线硬件编程学习平台\n我们的目标是：让机器人编程变得更容易，让学习变得更简单！\n加入啃萝卜，享受硬件编程的乐趣",

		project: {
			buildUrl: "http://ide0.kenrobot.com/api/build",
			maxCodeLength: 10 * 1024 * 1024,
		},

		//chrome扩展app配置
		chromeExt: {
			//Chrome app id
			appId: "hhgmonhbodfiplppmcangkmlfkcnilpd",

			//串口名字
			serialNameReg : /(USB-SERIAL)|(arduino)|(\/dev\/cu\.usbmodem)/i,

			//烧写速度
			uploadDelay: 250,

			//波特率
			bitRate: 115200,
		},
	};
});