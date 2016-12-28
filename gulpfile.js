/**
 * 组件安装
 * npm install --save-dev gulp gulp-if gulp-rename gulp-clean gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-requirejs-optimize run-sequence minimist fs-extra uuid
 */

// 引入 gulp及组件
const gulp = require('gulp')                      //基础库
const gulpif = require('gulp-if')                 //条件执行
const rename = require('gulp-rename')             //重命名
const clean = require('gulp-clean')               //清空文件夹
const sass = require('gulp-ruby-sass')            //sass
const cleanCSS = require('gulp-clean-css')        //css压缩
const autoprefixer = require('gulp-autoprefixer') //自动前缀
const requirejsOptimize = require('gulp-requirejs-optimize') //requirejs打包

const runSequence = require('run-sequence')       //顺序执行
const minimist = require('minimist')              //命令行参数解析
const fs = require('fs-extra')                    //文件操作
const uuid = require('uuid')

const path = require('path')                      //路径
const child_process = require('child_process')    //子进程
const os = require('os')                          //操作系统相关
const crypto = require('crypto')                  //加密

var args = minimist(process.argv.slice(2))        //命令行参数

const ASSETS_SRC = './resources/assets/'
const ASSETS_DIST = './public/assets/'

gulp.task('replace-env', callback => {
	var name = ".env"
	var suffix = args.release ? "release" : "debug"
	fs.removeSync(name)
	fs.copySync(name + "-" + suffix, name)
	callback()
})

gulp.task('clean-js', _ => {
	return gulp.src(ASSETS_DIST + 'js', {read: false})
		.pipe(clean())
})

gulp.task('clean-css', _ => {
	return gulp.src(ASSETS_DIST + 'css', {read: false})
		.pipe(clean())
})

gulp.task('clean-image', _ => {
	return gulp.src(ASSETS_DIST + 'image', {read: false})
		.pipe(clean())
})

gulp.task('clean-font', _ => {
	return gulp.src(ASSETS_DIST + 'font', {read: false})
		.pipe(clean())
})

gulp.task('pack-js', ['clean-js'], _ => {
	if(args.release) {
		gulp.src(ASSETS_SRC + 'js/require.js')
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
			
		return gulp.src(ASSETS_SRC + 'js/index.js')
			.pipe(requirejsOptimize({
				useStrict: true,
				optimize: args.min == 'false' ? "none" : "uglify",
			}))
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
	} else {
		return gulp.src(ASSETS_SRC + 'js/**/*.js')
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
	}
})

gulp.task('pack-css', ['clean-css'], _ => {
	return sass(ASSETS_SRC + 'css/*.scss', {style: "expanded"})
		.pipe(autoprefixer())
		.pipe(gulpif(args.release, cleanCSS()))
		.pipe(gulp.dest(ASSETS_DIST + 'css/'))
})

gulp.task('pack-image', ['clean-image'], _ => {
	return gulp.src(ASSETS_SRC + 'image/**/*')
		.pipe(gulp.dest(ASSETS_DIST + 'image/'))
})

gulp.task('pack-font', ['clean-font'], _ => {
	return gulp.src(ASSETS_SRC + 'font/**/*')
		.pipe(gulp.dest(ASSETS_DIST + 'font/'))
})

gulp.task('pack', ['replace-env', 'pack-image', 'pack-font', 'pack-css', 'pack-js'])

gulp.task('default', ['pack'])


gulp.task('uuid', function() {
	var n = args.n || 1
	console.log("uuid:")
	for (var i = 0; i < n; i++) {
		console.log(uuid())
	}
})

function getHash() {
	var key = "HwpGAejoUOPr6DbKBlvRILmsq4z7X3TCtky8NVd5iWE0ga2MchSZxfn1Y9JQuF"

	var result = []
	var time = new Date().getTime()
	var rand = Math.random()

	var md5 = crypto.createHash('md5')
	md5.update('' + time + rand)
	var salt = md5.digest('hex')

	for (var i = 0; i < 4; i++) {
		var hex = 0x3FFFFFFF & parseInt(salt.substring(i * 8, 8), 16)
		var out = ''
		for (var j = 0; j < 6; j++) {
			var index = 0x0000003D & hex
			out = out + key[index]
			hex = hex >> 5
		}
		result.push(out)
	}

	return result[0]
}

gulp.task('hash', function() {
	var n = args.n || 1
	console.log("hash:")
	for (var i = 0; i < n; i++) {
		console.log(getHash())
	}
});