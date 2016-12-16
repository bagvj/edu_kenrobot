var configs = {
	//基本配置
	base: {
		target: "web",
		title: "啃萝卜智能硬件平台",
		//问候
		greet: "     __ __           ____        __          __ \n    / //_/__  ____  / __ \\\____  / /_  ____  / /_\n   / ,< / _ \\\/ __ \\\/ /_/ / __ \\\/ __ \\\/ __ \\\/ __/\n  / /| /  __/ / / / _, _/ /_/ / /_/ / /_/ / /_  \n /_/ |_\\\___/_/ /_/_/ |_|\\\____/_.___/\____/\\\__/  \n\n啃萝卜是一款在线硬件编程学习平台\n我们的目标是：让机器人编程变得更容易，让学习变得更简单！\n加入啃萝卜，享受硬件编程的乐趣",
		//加密
		encrypt: {
			//公钥
			publicKey: "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7Jat1/19NDxOObrFpW8USTia6\nuHt34Sac1Arm6F2QUzsdUEUmvGyLIOIGcdb+F6pTdx4ftY+wZi7Aomp4k3vNqXmX\nT0mE0vpQlCmsPUcMHXuUi93XTGPxLXIv9NXxCJZXSYI0JeyuhT9/ithrYlbMlyNc\nwKB/BwSpp+Py2MTT2wIDAQAB\n-----END PUBLIC KEY-----"
		},
		//分享
		share: {
			weixin: {
				shareData: {
					desc: "啃萝卜是一款在线硬件编程学习平台",
					imgUrl: "http://edu.kenrobot.com/assets/image/logo3.png"
				}
			},
			weibo: {
				appKey: "1443867127",
				url: "http://service.weibo.com/share/share.php"
			}
		},
		//项目
		project: {
			//编译url
			buildUrl: "http://ide.kenrobot.com/api/build",
			//最大长度
			maxCodeLength: 10 * 1024 * 1024
		},
		//chrome扩展app配置
		chromeExt: {
			//Chrome app id
			appId: "hhgmonhbodfiplppmcangkmlfkcnilpd",
			//串口名字
			serialNameReg: "(usb-serial)|(arduino)|(\/dev\/cu\.usbmodem)",
			//烧写速度
			uploadDelay: 250,
			//波特率
			bitRate: 115200,
		}
	},
	//pc端配置
	pc: {
		target: "pc",
		chromeExt: undefined,
		host: "http://edu0.kenrobot.com",
	},
	//调试模式
	debug: {
		debug: true,
		greet: undefined,
	}
}

var template = "define(function() {\n	return {config};\n});"

function extend(target) {
	var sources = [].slice.call(arguments, 1);
	sources.forEach(function(source) {
		for (var prop in source) {
			target[prop] = source[prop];
		}
	});
	return target;
}

function gen(target, debug) {
	target = target || "web";
	var config = extend({}, configs.base, target == "pc" ? configs.pc : {}, debug ? configs.debug : {});
	return template.replace("{config}", JSON.stringify(config));
}

module.exports = gen;