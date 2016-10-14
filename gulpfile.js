/**
 * 组件安装
 * npm install gulp gulp-if gulp-rev gulp-rev-replace minimist run-sequence gulp-concat gulp-rename gulp-clean gulp-jshint gulp-uglify gulp-jsonminify gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-imagemin gulp-minify-html gulp-ng-annotate gulp-sourcemaps gulp-requirejs-optimize --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'),                      //基础库
	gulpif = require('gulp-if');                 //条件执行
	rev = require('gulp-rev');                   //rev
	revReplace = require('gulp-rev-replace');    //rev替换
	minimist = require('minimist')               //命令行参数解析
	runSequence = require('run-sequence');       //顺序执行
	concat = require('gulp-concat'),             //合并文件
	rename = require('gulp-rename'),             //重命名
	clean = require('gulp-clean');               //清空文件夹
	jshint = require('gulp-jshint'),             //js检查
	uglify = require('gulp-uglify'),             //js压缩
	jsonminify = require('gulp-jsonminify');     //json压缩
	sass = require('gulp-ruby-sass'),            //sass
	cleanCSS = require('gulp-clean-css'),        //css压缩
	autoprefixer = require('gulp-autoprefixer'), //自动前缀
	imagemin = require('gulp-imagemin'),         //image压缩
	minifyHtml = require("gulp-minify-html");    //html压缩
	ngAnnotate = require('gulp-ng-annotate'),    //ng注释
	sourcemaps = require('gulp-sourcemaps'),     //source map
	requirejsOptimize = require('gulp-requirejs-optimize'), //requirejs打包
	path = require('path'),
	child_process = require('child_process'),
	os = require('os'),
	crypto = require('crypto');

var SRC = './resources/assets/';
var DIST = './public/assets/';
var args = minimist(process.argv.slice(2));

function move(src, name, ext) {
	ext = ext || "";
	gulp.src(src + name + ext)
		.pipe(clean());

	var suffix = args.release ? "release" : "debug";
	gulp.src(src + name + '-' + suffix + ext)
		.pipe(rename(name + ext))
		.pipe(gulp.dest(src));
}

// js处理
gulp.task('js', function() {
	gulp.src(DIST + 'js')
		.pipe(clean());

	move("./", ".env");
	move(SRC + "js/app/config/", "config", ".js");

	var jsSrc = SRC + 'js/**/*.js',
		jsDst = DIST + 'js/';

	if(args.release) {
		gulp.src([SRC + 'js/require.js', SRC + 'js/go.js'])
			.pipe(gulp.dest(jsDst));

		gulp.src(SRC + 'js/index.js')
			.pipe(requirejsOptimize({
				useStrict: true,
				optimize: args.min == 'false' ? "none" : "uglify",
			}))
			.pipe(gulp.dest(jsDst));
	} else {
		gulp.src(jsSrc)
			.pipe(gulp.dest(jsDst));
	}
});

// 样式处理
gulp.task('css', function() {
	var cssSrc = SRC + 'css/index.scss',
		cssDst = DIST + 'css/';

	return sass(cssSrc, {style: 'expanded'})
		.pipe(autoprefixer())
		.pipe(gulpif(args.release, cleanCSS()))
		.pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('image', function() {
	var imgSrc = SRC + 'image/**/*',
		imgDst = DIST + 'image/';

	return gulp.src(imgSrc)
		// .pipe(imagemin())
		.pipe(gulp.dest(imgDst));
});

// font处理
gulp.task('font', function() {
	var fontSrc = SRC + 'font/**/*',
		fontDst = DIST + 'font/';

	return gulp.src(fontSrc)
		.pipe(gulp.dest(fontDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
	return gulp.src([DIST + 'css', DIST + 'js', DIST + 'image', DIST + 'font'], {read: false})
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
	for(var i = 0; i < n; i++) {
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

	for(var i = 0; i < 4; i++) {
		var hex = 0x3FFFFFFF & parseInt(salt.substring(i * 8, 8), 16);
		var out = '';
		for(var j = 0; j < 6; j++) {
			var index = 0x0000003D & hex;
			out = out + key[index];
			hex = hex >> 5;
		}
		result.push(out);
	}

	return result[0];
}

gulp.task('hash', function(){
	var n = args.n || 1;
	console.log("hash:");
	for(var i = 0; i < n; i++) {
		console.log(getHash());
	}
});