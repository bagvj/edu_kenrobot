/**
 * 组件安装
 * npm install gulp gulp-if gulp-rev gulp-rev-replace minimist run-sequence gulp-concat gulp-rename gulp-clean gulp-uglify gulp-jsonminify gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-imagemin gulp-minify-html gulp-ng-annotate gulp-sourcemaps gulp-requirejs-optimize --save-dev
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
	uglify = require('gulp-uglify'),             //js压缩
	jsonminify = require('gulp-jsonminify');     //json压缩
	sass = require('gulp-ruby-sass'),            //sass
	cleanCSS = require('gulp-clean-css'),        //css压缩
	autoprefixer = require('gulp-autoprefixer'), //自动前缀
	imagemin = require('gulp-imagemin'),         //image压缩
	minifyHtml = require("gulp-minify-html");    //html压缩
	ngAnnotate = require('gulp-ng-annotate'),    //ng注释
	sourcemaps = require('gulp-sourcemaps'),     //source map
	requirejsOptimize = require('gulp-requirejs-optimize'); //requirejs打包

var SRC = './resources/assets/';
var DIST = './public/assets/';
var DIST2 = '../kenrobot-pc/assets/';
var args = minimist(process.argv.slice(2));

gulp.task('copy-env', function() {
	if(args.pc) {
		return;
	}

	gulp.src('./.env')
		.pipe(clean());

	var suffix = args.release ? "release" : "debug";
	gulp.src('./.env-' + suffix)
		.pipe(rename('.env'))
		.pipe(gulp.dest('./'));
});

gulp.task('clean-js', function() {
	return gulp.src((args.pc ? DIST2 : DIST) + 'js')
		.pipe(clean({force: true}));
});

gulp.task('copy-config', function() {
	var config = args.pc ? "config-pc.js" : "config-web.js";
	var dir = SRC + 'js/app/';
	return gulp.src(dir + config)
		.pipe(rename("config.js"))
		.pipe(gulp.dest(dir));
});

// js处理
gulp.task('js', ['clean-js', 'copy-env', 'copy-config'], function() {
	var jsSrc = SRC + 'js/**/*.js',
		jsDst = (args.pc ? DIST2 : DIST) + 'js/';

	if(args.release) {
		gulp.src([SRC + 'js/require.js', SRC + 'js/jquery.js'])
			.pipe(gulp.dest(jsDst));

		gulp.src(SRC + 'js/index.js')
			.pipe(requirejsOptimize())
			.pipe(gulp.dest(jsDst));
		
		gulp.src([
				SRC + "js/ng/vendor/autogrow.js",
				SRC + "js/ng/vendor/beautify.js",
				SRC + "js/ng/vendor/prism.js",
				SRC + "js/ng/vendor/prism-line-numbers.js",
				SRC + "js/ng/vendor/lodash.js",
				SRC + "js/ng/vendor/jsPlumb.js",
				SRC + "js/ng/vendor/angular.js",
				SRC + "js/ng/vendor/angular-route.js",
				SRC + "js/ng/vendor/angular-sanitize.js",
				SRC + "js/ng/vendor/angular-translate.js",
				SRC + "js/ng/vendor/ngDialog.js",
				SRC + 'js/ng/**/*.js'])
			.pipe(concat('app.js'))
			.pipe(ngAnnotate())
			.pipe(uglify())
			.pipe(gulp.dest(jsDst));
	} else {
		return gulp.src([jsSrc, '!' + SRC + 'js/app/config-*.js'])
			.pipe(gulp.dest(jsDst));
	}
});

// HTML处理
gulp.task('html', function() {
	var htmlSrc = SRC + 'views/**/*.html',
		htmlDst = (args.pc ? DIST2 : DIST) + 'views/';

	return gulp.src([htmlSrc])
		.pipe(gulpif(args.release, minifyHtml()))
		.pipe(gulp.dest(htmlDst));
});

// 样式处理
gulp.task('css', function() {
	var cssSrc = SRC + 'css/index.scss',
		cssDst = (args.pc ? DIST2 : DIST) + 'css/';

	return sass(cssSrc, {style: 'expanded'})
		.pipe(autoprefixer())
		.pipe(gulpif(args.release, cleanCSS()))
		.pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('image', function() {
	var imgSrc = SRC + 'image/**/*',
		imgDst = (args.pc ? DIST2 : DIST) + 'image/';

	return gulp.src(imgSrc)
		.pipe(gulp.dest(imgDst));
});

// font处理
gulp.task('font', function() {
	var fontSrc = SRC + 'font/**/*',
		fontDst = (args.pc ? DIST2 : DIST) + 'font/';

	return gulp.src(fontSrc)
		.pipe(gulp.dest(fontDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
	var dist = args.pc ? DIST2 : DIST;
	return gulp.src([dist + 'css', dist + 'js', dist + 'image', dist + 'font', dist + 'views'], {read: false})
		.pipe(clean({force: true}));
});

gulp.task('watch', function() {
	gulp.watch(SRC + 'css/index.scss', function() {
		gulp.run('css');
	});
});

// 默认任务
gulp.task('default', function() {
	return runSequence('clean', ['html', 'css', 'image', 'font'], 'js');
});

gulp.task('uuid', function() {
	var n = args.n || 1;
	console.log("uuid:")
	for(var i = 0; i < n; i++) {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		console.log(uuid);
	}
});