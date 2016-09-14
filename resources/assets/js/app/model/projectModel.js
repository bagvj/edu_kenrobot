define(['vendor/jquery', './userModel'], function(_, userModel) {

	function get(key, type) {
		type = type || "id";

		var data = {};
		data.user_id = userModel.getUserId();

		if (type == "hash") {
			data.hash = key;
		} else if (type == "last") {
			data.type = 'last';
		} else {
			data.id = key;
		}

		return $.ajax({
			type: 'POST',
			url: '/api/project/get',
			data: data,
			dataType: 'json',
		});
	}

	function getAll() {
		return $.ajax({
			type: 'POST',
			url: '/api/projects/user',
			data: {
				user_id: userModel.getUserId(),
			},
			dataType: 'json',
		});
	}

	function getSchema() {
		// return $.ajax({
		// 	type: 'POST',
		// 	url: '/api/project/schema',
		// 	data: {
		// 		user_id: userModel.getUserId(),
		// 	},
		// 	dataType: 'json',
		// });

		var data = {
			hardware: {
				boards: [{
					label: "Arduino UNO",
					name: "ArduinoUNO",
					tags: ["Arduino"],
					pins: [{
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad01",
						width: 9,
						height: 15,
						x: 0.478,
						y: 0.098,
						name: "13",
						tags: ["digital"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad02",
						width: 9,
						height: 15,
						x: 0.508,
						y: 0.098,
						name: "12",
						tags: ["digital"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad03",
						width: 9,
						height: 15,
						x: 0.545,
						y: 0.098,
						name: "11",
						tags: ["digital", "analog-out"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad04",
						width: 9,
						height: 15,
						x: 0.58,
						y: 0.098,
						name: "10",
						tags: ["digital", "analog-out"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad05",
						width: 9,
						height: 15,
						x: 0.615,
						y: 0.098,
						name: "9",
						tags: ["digital", "analog-out"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad06",
						width: 9,
						height: 15,
						x: 0.649,
						y: 0.098,
						name: "8",
						tags: ["digital"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad07",
						width: 9,
						height: 15,
						x: 0.695,
						y: 0.098,
						name: "7",
						tags: ["digital"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad08",
						width: 9,
						height: 15,
						x: 0.73,
						y: 0.098,
						name: "6",
						tags: ["digital", "analog-out"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad09",
						width: 9,
						height: 15,
						x: 0.765,
						y: 0.098,
						name: "5",
						tags: ["digital", "analog-out"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad10",
						width: 9,
						height: 15,
						x: 0.795,
						y: 0.098,
						name: "4",
						tags: ["digital"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad11",
						width: 9,
						height: 15,
						x: 0.832,
						y: 0.098,
						name: "3",
						tags: ["digital", "analog-out"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad12",
						width: 9,
						height: 15,
						x: 0.869,
						y: 0.098,
						name: "2",
						tags: ["digital"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad13",
						width: 9,
						height: 15,
						x: 0.9,
						y: 0.098,
						name: "1",
						tags: ["digital"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad13",
						width: 9,
						height: 15,
						x: 0.935,
						y: 0.098,
						name: "0",
						tags: ["digital"],
						overlay: [0.5, 1.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa00",
						width: 9,
						height: 15,
						x: 0.763,
						y: 0.92,
						name: "A0",
						tags: ["analog-in"],
						overlay: [0.5, -0.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa01",
						width: 9,
						height: 15,
						x: 0.795,
						y: 0.92,
						name: "A1",
						tags: ["analog-in"],
						overlay: [0.5, -0.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa02",
						width: 9,
						height: 15,
						x: 0.83,
						y: 0.92,
						name: "A2",
						tags: ["analog-in"],
						overlay: [0.5, -0.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa03",
						width: 9,
						height: 15,
						x: 0.862,
						y: 0.92,
						name: "A3",
						tags: ["analog-in"],
						overlay: [0.5, -0.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa04",
						width: 9,
						height: 15,
						x: 0.895,
						y: 0.92,
						name: "A4",
						tags: ["analog-in"],
						overlay: [0.5, -0.5],
					}, {
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa05",
						width: 9,
						height: 15,
						x: 0.935,
						y: 0.92,
						name: "A5",
						tags: ["analog-in"],
						overlay: [0.5, -0.5],
					}, {
						width: 31,
						height: 62,
						x: 0.048,
						y: 0.321,
						name: "Serial",
						tags: ["serial"],
						uid: "6be0dd9d-2e52-4b7d-9dfc-c9edad53ac05",
						overlay: [0.5, 1.5],
					}],
				}, {
					label: "RoSys开发板",
					name: "NEO328",
					tags: ["RoSys"],
					pins: [{
						uid: "c9168884-b454-4342-b677-f06dacb0b3cc",
						width: 32,
						height: 20,
						x: 0.333,
						y: 0.851,
						name: "2",
						tags: ["digital"],
						overlay: [0.5, -0.5],
					}, {
						uid: "55798942-05de-4d9c-82e8-ddced2259aec",
						width: 32,
						height: 20,
						x: 0.431,
						y: 0.851,
						name: "3",
						tags: ["digital"],
						overlay: [0.5, -0.5],
					}, {
						uid: "c297515b-2a2d-4b5c-96a8-e740d83a75ce",
						width: 32,
						height: 20,
						x: 0.529,
						y: 0.851,
						name: "8",
						tags: ["digital"],
						overlay: [0.5, -0.5],
					}, {
						uid: "86624d9f-0ddb-4356-8664-0afc9223e12e",
						width: 32,
						height: 20,
						x: 0.627,
						y: 0.851,
						name: "9",
						tags: ["digital"],
						overlay: [0.5, -0.5],
					}, {
						uid: "e29d477e-8923-40c2-8922-af988a78811f",
						width: 32,
						height: 20,
						x: 0.725,
						y: 0.851,
						name: "10",
						tags: ["digital"],
						overlay: [0.5, -0.5],
					}, {
						uid: "08001087-da26-451b-b124-5c100d928201",
						width: 32,
						height: 20,
						x: 0.823,
						y: 0.851,
						name: "11",
						tags: ["digital"],
						overlay: [0.5, -0.5],
					}, {
						width: 32,
						height: 20,
						x: 0.333,
						y: 0.149,
						name: "A0",
						tags: ["analog"],
						uid: "7186a1cf-2fab-4c5a-8d1e-19836d4a561d",
						overlay: [0.5, 1.5],
					}, {
						uid: "7c10ef7d-a65e-497d-868a-b9c2e43bea81",
						width: 32,
						height: 20,
						x: 0.431,
						y: 0.149,
						name: "A1",
						tags: ["analog"],
						overlay: [0.5, 1.5],
					}, {
						uid: "15ad5a73-f510-44bc-b4ac-5886a8211d38",
						width: 32,
						height: 20,
						x: 0.529,
						y: 0.149,
						name: "A2",
						tags: ["analog"],
						overlay: [0.5, 1.5],
					}, {
						uid: "129d8693-115f-40c4-a6c1-4315bd020254",
						width: 32,
						height: 20,
						x: 0.627,
						y: 0.149,
						name: "A3",
						tags: ["analog"],
						overlay: [0.5, 1.5],
					}, {
						uid: "d679b1cd-91d4-4aed-8f6f-6ad31d041518",
						width: 32,
						height: 20,
						x: 0.725,
						y: 0.149,
						name: "A6",
						tags: ["analog"],
						overlay: [0.5, 1.5],
					}, {
						uid: "15c50e12-8705-4d47-803d-5c50b7512981",
						width: 32,
						height: 20,
						x: 0.823,
						y: 0.149,
						name: "A7",
						tags: ["analog"],
						overlay: [0.5, 1.5],
					}, {
						uid: "ed9cbaec-e3fb-4acb-87d9-c4825bb5594c",
						width: 40,
						height: 20,
						x: 0.228,
						y: 0.851,
						name: "USART",
						tags: ["serial"],
						overlay: [0.5, -0.5],
					}, {
						uid: "e6f796e0-d283-41d3-a996-7316acb2c4cc",
						width: 40,
						height: 20,
						x: 0.228,
						y: 0.149,
						name: "IIC",
						tags: ["iic"],
						overlay: [0.5, 1.5],
					}, {
						uid: "cc94cecf-1424-4352-8309-474a814981f5",
						width: 40,
						height: 20,
						x: 0.970,
						y: 0.720,
						name: "IIC",
						tags: ["iic"],
						overlay: [0.5, 1.5],
						rotate: true,
					}, {
						uid: "0ae7f137-66e0-437a-998f-c71a2ec62c3b",
						width: 20,
						height: 54,
						x: 0.970,
						y: 0.336,
						name: "MA",
						tags: ["motor"],
						overlay: [0.5, 1.5],
					}, {
						uid: "ee0399c9-2700-4456-96e1-47803c1ff60a",
						width: 20,
						height: 54,
						x: 0.970,
						y: 0.540,
						name: "MB",
						tags: ["motor"],
						overlay: [0.5, 1.5],
					}],
				}],
				components: [{
					uid: "aa1a2f4c-2934-414a-823f-9961fbf23c55",
					name: "led",
					label: "LED",
					type: "led",
					category: "sensor",
					board: "Arduino",
					src: "/assets/image/components/led.png",
					width: 55,
					height: 83,
					pins: [{
						name: "s",
						anchor: [0.5, 1],
						tags: ["digital"],
					}],
				}, {
					uid: "a8466d12-ed5e-4cc8-bffe-1031c3bb10e1",
					name: "rgb",
					label: "RGB LED",
					type: "rgb",
					category: "sensor",
					board: "Arduino",
					src: "/assets/image/components/rgb.png",
					width: 67,
					height: 79,
					pins: [{
						name: "r",
						anchor: [0.25, 1],
						tags: ["analog-out"],
					}, {
						name: "g",
						anchor: [0.5, 1],
						tags: ["analog-out"],
					}, {
						name: "b",
						anchor: [0.75, 1],
						tags: ["analog-out"],
					}],
				}, {
					uid: "abf7ad9a-2bd9-40f4-bf83-0af03e8f4d5a",
					name: "lcd",
					label: "液晶模块",
					type: "lcd",
					category: "action",
					board: "Arduino",
					src: "/assets/image/components/lcd.png",
					width: 170,
					height: 93,
					pins: [{
						name: "sda",
						anchor: [0.33, 0],
						tags: ["analog-in"],
						spec: "A4",
					}, {
						name: "scl",
						anchor: [0.67, 0],
						tags: ["analog-in"],
						spec: "A5",
					}],
				}, {
					uid: "4b8594a2-b7ff-44fe-a8b0-319640722b30",
					name: "serialPort",
					label: "串口模块",
					type: "serial",
					category: "function",
					board: "Arduino",
					src: "/assets/image/components/serialPort.png",
					width: 115,
					height: 71,
					pins: [{
						name: "s",
						anchor: [1, 0.5],
						tags: ["serial"],
						spec: "Serial",
					}],
				}],
			},
			software: {

			},
		};

		var promise = $.Deferred();

		setTimeout(function() {
			promise.resolve({
				data: data,
				status: 0,
				message: "",
			});
		}, 1000);

		return promise;
	}

	function save(project) {
		return $.ajax({
			type: 'POST',
			url: '/api/project/save',
			data: project,
			dataType: 'json',
		});
	}

	function build(id) {
		return $.ajax({
			type: "POST",
			url: "/api/project/build",
			dataType: "json",
			data: {
				id: id,
				user_id: userModel.getUserId(),
			},
		});
	}

	function remove(id) {
		return $.ajax({
			type: "POST",
			url: "/api/project/delete",
			data: {
				id: id,
				user_id: userModel.getUserId(),
			},
			dataType: "json",
		});
	}

	function upload(data, onProgress) {
		return $.ajax({
			type: 'POST',
			url: '/api/project/upload',
			dataType: 'json',
			data: data,
			processData: false,
			contentType: false,
			xhr: function() {
				var xhr = $.ajaxSettings.xhr();
				xhr.upload && onProgress && xhr.upload.addEventListener('progress', onProgress, false);
				return xhr;
			}
		});
	}

	return {
		get: get,
		getAll: getAll,
		save: save,
		build: build,
		remove: remove,
		upload: upload,
		getSchema: getSchema,
	};
});