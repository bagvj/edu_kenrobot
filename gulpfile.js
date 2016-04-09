/**
 * 组件安装
 * npm install gulp gulp-util gulp-imagemin gulp-ruby-sass gulp-clean-css gulp-jshint gulp-uglify gulp-rename gulp-sourcemaps gulp-ng-annotate gulp-concat gulp-clean --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'),                   //基础库
	imagemin = require('gulp-imagemin'),      //图片压缩
	sass = require('gulp-ruby-sass'),         //sass
	cleanCSS = require('gulp-clean-css'),     //css压缩
	jshint = require('gulp-jshint'),          //js检查
	uglify = require('gulp-uglify'),          //js压缩
	rename = require('gulp-rename'),          //重命名
	ngAnnotate = require('gulp-ng-annotate'), //ng注释
	concat = require('gulp-concat'),          //合并文件
	sourcemaps = require('gulp-sourcemaps'),  //source map
	clean = require('gulp-clean');            //清空文件夹
	rjs = require('gulp-rjs2');

var SRC = './resources/assets/';
var DIST = './public/assets/';

// HTML处理
gulp.task('html', function() {
	var htmlSrc = SRC + 'views/**/*.html',
		htmlDst = DIST + 'views/';

	return gulp.src([htmlSrc])
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
	var resSrc = SRC + 'res/**/*',
		resDst = DIST + 'res/';

	return gulp.src(resSrc)
		.pipe(gulp.dest(resDst));
});

// js处理
gulp.task('js', function() {
	var jsSrc = SRC + 'js/**/*.js',
		jsDst = DIST + 'js/';

	rjs({
		baseUrl: 'resources/assets/js',
		mainConfigFile: 'resources/assets/js/index.js',
		modules: [{
			name: 'index',
		}],
			// dir: jsDst,
		// name: 'index',
	})
	.pipe(uglify())
	.pipe(gulp.dest(jsDst));

	// gulp.src([jsSrc, '!./src/js/vendor/*.js'])
	// 	// .pipe(jshint('.jshintrc'))
	// 	// .pipe(jshint.reporter('default'))
	// 	.pipe(concat('main.js'))
	// 	.pipe(ngAnnotate())
	// 	.pipe(uglify())
	// 	.pipe(gulp.dest(jsDst));

	// gulp.src([
	// 		'./src/js/vendor/angular.js',
	// 		'./src/js/vendor/angular-clipboard.js',
	// 		'./src/js/vendor/angular-route.js',
	// 		'./src/js/vendor/angular-sanitize.js',
	// 		'./src/js/vendor/angular-translate.js',
	// 		'./src/js/vendor/angular-translate-loader-static-files.js',
	// 		'./src/js/vendor/ngDialog.js',
	// 	])
	// 	.pipe(concat('angular.js'))
	// 	.pipe(ngAnnotate())
	// 	.pipe(gulp.dest('./dist/js/vendor'));

	// gulp.src([
	// 		'./src/js/vendor/jquery.js',
	// 		'./src/js/vendor/autogrow.js',
	// 		'./src/js/vendor/beautify.js',
	// 		'./src/js/vendor/prism.js',
	// 		'./src/js/vendor/prism-line-numbers.js',
	// 		'./src/js/vendor/lodash.js',
	// 		'./src/js/vendor/jsPlumb.js',
	// 		'./src/js/vendor/bloqs.js',
	// 	])
	// 	.pipe(concat('vendor.js'))
	// 	.pipe(uglify())
	// 	.pipe(gulp.dest('./dist/js/vendor'));
});

gulp.task('switch', function() {
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