define(function() {
	window.VIDEOJS_NO_DYNAMIC_STYLE = true;
	
	return {
		debug: true,
		greet: "     __ __           ____        __          __ \n    / //_/__  ____  / __ \\\____  / /_  ____  / /_\n   / ,< / _ \\\/ __ \\\/ /_/ / __ \\\/ __ \\\/ __ \\\/ __/\n  / /| /  __/ / / / _, _/ /_/ / /_/ / /_/ / /_  \n /_/ |_\\\___/_/ /_/_/ |_|\\\____/_.___/\____/\\\__/  \n\n啃萝卜是一款在线硬件编程学习平台\n我们的目标是：让机器人编程变得更容易，让学习变得更简单！\n加入啃萝卜，享受硬件编程的乐趣",

		project: {
			buildUrl: "http://ide0.kenrobot.com/api/build",
			maxCodeLength: 10 * 1024 * 1024,
		},

		notify: {
			updateDelay: 5 * 60 * 1000,
		},

		serial: {
			baudRate: 115200,

			nameReg : /(USB-SERIAL)|(arduino)|(\/dev\/cu\.usbmodem)/i,

			//烧写速度
			uploadDelay: 250,

			//串口接收速度
			receiveDelay: 100,
		},

		//chrome扩展app配置
		extension: {
			//Chrome app id
			appId: "hhgmonhbodfiplppmcangkmlfkcnilpd",

			nameReg : /(USB-SERIAL)|(arduino)|(\/dev\/cu\.usbmodem)/i,

			//烧写速度
			uploadDelay: 250,

			//串口接收速度
			serialReceiveDelay: 100,

			interpreterBitRate: 115200,
		},

		video: {
			lang: {
				"Share": "分享",
				"Play": "播放",
				"Pause": "暂停",
				"Current Time": "当前时间",
				"Duration Time": "时长",
				"Remaining Time": "剩余时间",
				"Stream Type": "媒体流类型",
				"LIVE": "直播",
				"Loaded": "加载完毕",
				"Progress": "进度",
				"Fullscreen": "全屏",
				"Non-Fullscreen": "退出全屏",
				"Mute": "静音",
				"Unmute": "取消静音",
				"Playback Rate": "播放码率",
				"Subtitles": "字幕",
				"subtitles off": "字幕关闭",
				"Captions": "内嵌字幕",
				"captions off": "内嵌字幕关闭",
				"Chapters": "节目段落",
				"You aborted the media playback": "视频播放被终止",
				"A network error caused the media download to fail part-way.": "网络错误导致视频下载中途失败。",
				"The media could not be loaded, either because the server or network failed or because the format is not supported.": "视频因格式不支持或者服务器或网络的问题无法加载。",
				"The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。",
				"No compatible source was found for this media.": "无法找到此视频兼容的源。",
				"The media is encrypted and we do not have the keys to decrypt it.": "视频已加密，无法解密。"
			},
		},
	};
});