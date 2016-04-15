/**
 * 组件安装
 * npm install gulp gulp-util gulp-jsonminify gulp-requirejs-optimize gulp-minify-html gulp-imagemin gulp-ruby-sass gulp-clean-css gulp-jshint gulp-uglify gulp-rename gulp-sourcemaps gulp-ng-annotate gulp-concat gulp-clean --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'),                   //基础库
	jshint = require('gulp-jshint'),          //js检查
	imagemin = require('gulp-imagemin'),      //图片压缩
	sass = require('gulp-ruby-sass'),         //sass
	cleanCSS = require('gulp-clean-css'),     //css压缩
	uglify = require('gulp-uglify'),          //js压缩
	minifyHtml = require("gulp-minify-html"); //html压缩
	rename = require('gulp-rename'),          //重命名
	ngAnnotate = require('gulp-ng-annotate'), //ng注释
	concat = require('gulp-concat'),          //合并文件
	sourcemaps = require('gulp-sourcemaps'),  //source map
	clean = require('gulp-clean');            //清空文件夹
	requirejsOptimize = require('gulp-requirejs-optimize');
	jsonminify = require('gulp-jsonminify');

var SRC = './resources/assets/';
var DIST = './public/assets/';

gulp.task('rm-env', function() {
	return gulp.src('./.env')
		.pipe(clean());
});

gulp.task('copy-env-debug', ['rm-env'], function() {
	return gulp.src('./.env-debug')
		.pipe(rename('.env'))
		.pipe(gulp.dest('.'));
});

gulp.task('copy-env-release', ['rm-env'], function() {
	return gulp.src('./.env-release')
		.pipe(rename('.env'))
		.pipe(gulp.dest('.'));
});

gulp.task('clean-js', function() {
	return gulp.src(DIST + 'js')
		.pipe(clean());
});

// js处理
gulp.task('js', ['clean-js', 'copy-env-release'], function() {
	var jsSrc = SRC + 'js/**/*.js',
		jsDst = DIST + 'js/';

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
			SRC + "js/ng/vendor/bloqs.js",
			SRC + "js/ng/vendor/angular.js",
			SRC + "js/ng/vendor/angular-route.js",
			SRC + "js/ng/vendor/angular-sanitize.js",
			SRC + "js/ng/vendor/angular-translate.js",
			SRC + "js/ng/vendor/angular-translate-loader-static-files.js",
			SRC + "js/ng/vendor/ngDialog.js",
			SRC + 'js/ng/**/*.js'])
		.pipe(concat('app.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest(jsDst));
});

// HTML处理
gulp.task('html', function() {
	var htmlSrc = SRC + 'views/**/*.html',
		htmlDst = DIST + 'views/';

	return gulp.src([htmlSrc])
		.pipe(minifyHtml())
		.pipe(gulp.dest(htmlDst));
});

// 样式处理
gulp.task('css', function() {
	var cssSrc = SRC + 'css/index.scss',
		cssDst = DIST + 'css/';

	return sass(cssSrc, {style: 'expanded'})
		.pipe(cleanCSS())
		.pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function() {
	var imgSrc = SRC + 'images/**/*',
		imgDst = DIST + 'images/';

	return gulp.src(imgSrc)
		// .pipe(imagemin())
		.pipe(gulp.dest(imgDst));
});

// font处理
gulp.task('fonts', function() {
	var fontSrc = SRC + 'fonts/**/*',
		fontDst = DIST + 'fonts/';

	return gulp.src(fontSrc)
		.pipe(gulp.dest(fontDst));
});

// res处理
gulp.task('res', function() {
	var resSrc = SRC + 'res/**/*.json',
		resDst = DIST + 'res/';

	return gulp.src(resSrc)
		.pipe(jsonminify())
		.pipe(gulp.dest(resDst));
});

gulp.task('switch', ['clean-js', 'copy-env-debug'], function() {
	return gulp.src(SRC + "js/**/*.js")
		.pipe(gulp.dest(DIST + "js"));
});

// 清空图片、样式、js
gulp.task('clean', function() {
	return gulp.src([DIST + 'css', DIST + 'js', DIST + 'images', DIST + 'fonts', DIST + 'res', DIST + 'views'], {read: false})
		.pipe(clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function() {
	gulp.run('html', 'css', 'images', 'fonts', 'res', 'js');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {
	// 监听html
	gulp.watch(SRC + 'views/**/*.html', function(event) {
		gulp.run('html');
	});

	// 监听fonts
	gulp.watch(SRC + 'fonts/**/*', function(event) {
		gulp.run('fonts');
	});

	// 监听res
	gulp.watch(SRC + 'res/**/*', function(event) {
		gulp.run('res');
	});

	// 监听css
	gulp.watch(SRC + 'css/**/*.scss', function() {
		gulp.run('css');
	});

	// 监听images
	gulp.watch(SRC + 'images/**/*', function() {
		gulp.run('images');
	});

	// 监听js
	gulp.watch(SRC + 'js/**/*.js', function() {
		gulp.run('js');
	});
});