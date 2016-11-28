/**
 * 组件安装
 * npm install gulp gulp-if gulp-rev gulp-rev-replace minimist run-sequence gulp-concat gulp-rename gulp-clean gulp-uglify gulp-jsonminify gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-imagemin gulp-minify-html gulp-ng-annotate gulp-sourcemaps gulp-requirejs-optimize --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp');                      //基础库
var gulpif = require('gulp-if');                 //条件执行
var rev = require('gulp-rev');                   //rev
var revReplace = require('gulp-rev-replace');    //rev替换
var minimist = require('minimist');              //命令行参数解析
var runSequence = require('run-sequence');       //顺序执行
var concat = require('gulp-concat');             //合并文件
var rename = require('gulp-rename');             //重命名
var clean = require('gulp-clean');               //清空文件夹
var uglify = require('gulp-uglify');             //js压缩
var jsonminify = require('gulp-jsonminify');     //json压缩
var sass = require('gulp-ruby-sass');            //sass
var cleanCSS = require('gulp-clean-css');        //css压缩
var autoprefixer = require('gulp-autoprefixer'); //自动前缀
var imagemin = require('gulp-imagemin');         //image压缩
var minifyHtml = require("gulp-minify-html");    //html压缩
var ngAnnotate = require('gulp-ng-annotate');    //ng注释
var sourcemaps = require('gulp-sourcemaps');     //source map
var requirejsOptimize = require('gulp-requirejs-optimize'); //requirejs打包

var path = require('path');                      //路径
var child_process = require('child_process');    //子进程
var os = require('os');                          //操作系统相关
var crypto = require('crypto');                  //加密

var args = minimist(process.argv.slice(2));      //命令行参数

var SRC = './resources/assets/';
var DIST = './public/assets/';

function move(src, name, ext) {
	ext = ext || "";
	gulp.src(src + name + ext)
		.pipe(clean());

	var suffix = args.release ? "release" : "debug";
	return gulp.src(src + name + '-' + suffix + ext)
		.pipe(rename(name + ext))
		.pipe(gulp.dest(src));
}

gulp.task('js-clean', function() {
	return gulp.src(DIST + 'js')
		.pipe(clean());
});

gulp.task('js-copy-env', function() {
	return move("./", ".env");
});

gulp.task('js-copy-config', function() {
	return move(SRC + "js/app/config/", "config", ".js");
});

var jsSrc = SRC + 'js/**/*.js';
var jsDst = DIST + 'js/';

gulp.task('js-copy', function() {
	return gulp.src(jsSrc)
		.pipe(gulp.dest(jsDst));
});

gulp.task('js-pre-pack', function() {
	return gulp.src([SRC + 'js/require.js'])
		.pipe(gulp.dest(jsDst));
});

gulp.task('js-pack', function() {
	return gulp.src(SRC + 'js/index.js')
		.pipe(requirejsOptimize({
			useStrict: true,
			optimize: args.min == 'false' ? "none" : "uglify",
		}))
		.pipe(gulp.dest(jsDst));
});

// js处理
gulp.task('js', function() {
	if (args.release) {
		return runSequence(["js-clean", "js-copy-env", "js-copy-config"], "js-pre-pack", "js-pack");
	} else {
		return runSequence(["js-clean", "js-copy-env", "js-copy-config"], "js-copy");
	}
});

// 样式处理
gulp.task('css', function() {
	var cssSrc = SRC + 'css/index.scss';
	var cssDst = DIST + 'css/';

	return sass(cssSrc, {
			style: 'expanded'
		})
		.pipe(autoprefixer())
		.pipe(gulpif(args.release, cleanCSS()))
		.pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('image', function() {
	var imgSrc = SRC + 'image/**/*';
	var imgDst = DIST + 'image/';

	return gulp.src(imgSrc)
		.pipe(gulp.dest(imgDst));
});

// font处理
gulp.task('font', function() {
	var fontSrc = SRC + 'font/**/*';
	var fontDst = DIST + 'font/';

	return gulp.src(fontSrc)
		.pipe(gulp.dest(fontDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
	return gulp.src([DIST + 'css', DIST + 'js', DIST + 'image', DIST + 'font'], {
			read: false
		})
		.pipe(clean());
});

// 默认任务
gulp.task('default', function() {
	return runSequence('clean', ['css', 'image', 'font'], 'js');
});

function genUuid() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});

	return uuid;
}

gulp.task('uuid', function() {
	var n = args.n || 1;
	console.log("uuid:")
	for (var i = 0; i < n; i++) {
		console.log(genUuid());
	}
});

function getHash() {
	var key = "HwpGAejoUOPr6DbKBlvRILmsq4z7X3TCtky8NVd5iWE0ga2MchSZxfn1Y9JQuF";

	var result = [];
	var time = new Date().getTime();
	var rand = Math.random();

	var md5 = crypto.createHash('md5');
	md5.update('' + time + rand);
	var salt = md5.digest('hex');

	for (var i = 0; i < 4; i++) {
		var hex = 0x3FFFFFFF & parseInt(salt.substring(i * 8, 8), 16);
		var out = '';
		for (var j = 0; j < 6; j++) {
			var index = 0x0000003D & hex;
			out = out + key[index];
			hex = hex >> 5;
		}
		result.push(out);
	}

	return result[0];
}

gulp.task('hash', function() {
	var n = args.n || 1;
	console.log("hash:");
	for (var i = 0; i < n; i++) {
		console.log(getHash());
	}
});