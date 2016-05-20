<!DOCTYPE HTML>
<html>
	<head>
		<meta charset='utf-8'>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>啃萝卜智能硬件平台</title>
		<meta name="keywords" content="arduino 开发 IDE 开发平台 教程" />
		<meta name="description" content="啃萝卜智能硬件平台" />
		<meta name="csrf-token" content="{{csrf_token()}}" />
		<link href="/assets/css/index.css" rel="stylesheet" />
@if(!env('APP_DEBUG'))
		<script src="//hm.baidu.com/hm.js?{{env('PV_KEY')}}" async></script>
@endif
		<script src="/assets/js/jquery.js"></script>
@if(env('APP_DEBUG'))
		<script src="/assets/js/ng/vendor/autogrow.js"></script>
		<script src="/assets/js/ng/vendor/beautify.js"></script>
		<script src="/assets/js/ng/vendor/prism.js"></script>
		<script src="/assets/js/ng/vendor/prism-line-numbers.js"></script>
		<script src="/assets/js/ng/vendor/lodash.js"></script>
		<script src="/assets/js/ng/vendor/jsPlumb.js"></script>

		<script src="/assets/js/ng/vendor/angular.js"></script>
		<script src="/assets/js/ng/vendor/angular-route.js"></script>
		<script src="/assets/js/ng/vendor/angular-sanitize.js"></script>
		<script src="/assets/js/ng/vendor/angular-translate.js"></script>
		<script src="/assets/js/ng/vendor/ngDialog.js"></script>

		<script src="/assets/js/ng/app.js"></script>

		<script src="/assets/js/ng/provider/langProvider.js"></script>
		<script src="/assets/js/ng/factory/VendorFactory.js"></script>

		<script src="/assets/js/ng/service/common.js"></script>
		<script src="/assets/js/ng/service/bloqsUtils.js"></script>
		<script src="/assets/js/ng/service/bloqs.js"></script>
		<script src="/assets/js/ng/service/hw2Bloqs.js"></script>
		<script src="/assets/js/ng/service/utils.js"></script>
		<script src="/assets/js/ng/service/alerts.js"></script>

		<script src="/assets/js/ng/directive/tab.js"></script>
		<script src="/assets/js/ng/directive/tabset.js"></script>
		<script src="/assets/js/ng/directive/dropdown.js"></script>
		<script src="/assets/js/ng/directive/toolbox.js"></script>
		<script src="/assets/js/ng/directive/creator.js"></script>
		<script src="/assets/js/ng/directive/draggable.js"></script>
		<script src="/assets/js/ng/directive/droppable.js"></script>
		<script src="/assets/js/ng/directive/scrollBar.js"></script>
		<script src="/assets/js/ng/directive/prism.js"></script>
		<script src="/assets/js/ng/directive/commonDropdown.js"></script>

		<script src="/assets/js/ng/controller/AlertController.js"></script>
		<script src="/assets/js/ng/controller/ProjectController.js"></script>
		<script src="/assets/js/ng/controller/ApiController.js"></script>
		<script src="/assets/js/ng/controller/HardwareController.js"></script>
		<script src="/assets/js/ng/controller/SoftwareController.js"></script>
@else
		<script src="/assets/js/app.js"></script>
@endif
		<script src="/assets/js/require.js" data-main="/assets/js/index"></script>
	</head>
	<body>
		<div class="main">
			<div class="main-wrap">
				<div class="main-header">
					<a class="logo" href="http://www.kenrobot.com"></a>
					<div class="wrap">
						<div class="top-menu">
							<ul>
								<li data-action="new"><i class="kenrobot ken-project"></i>新建</li><li data-action="save"><i class="kenrobot ken-save"></i>保存</li>
							</ul>
						</div>
						<div class="user{{isset($user) ? ' active' : ''}}">
							<div class="user-info">
								<a class="photo" href="{{$mainpage}}" target="_blank">
									<img src="{{$user->avatar_url or asset('assets/image/default_portrait.png')}}" />
								</a>
								<div class="welcome">
									<span class="name">{{isset($user) ? $user->name : ''}}</span><i class="kenrobot ken-triangle-down arrow"></i>
								</div>
							</div>
							<div class="user-login">
								<ul>
									<li data-action="login">登录</li><li data-action="register">注册</li>
								</ul>
							</div>
							<div class="user-menu">
								<ul>
									<li data-action="share"><i class="kenrobot ken-share"></i>分享</li>
									<li data-action="setting"><i class="kenrobot ken-setting"></i>设置</li>
									<li data-action="logout"><i class="kenrobot ken-logout"></i>退出</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="main-content">
					<div class="ng-app">
						<div ng-include="'assets/image/sprite.svg'" ng-hide="true"></div>
						<div ng-include="'assets/views/components/alerts.html'" ng-controller="AlertController" class="alerts--container"></div>
						<div ng-view></div>
					</div>
					<div class="sidebar">
						<ul>
							<li data-action="upload"><button><i class="kenrobot ken-upload"></i></button></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="layers">
			<div class="float-layer">
				<div class="copyright">
					<div class="wrap">
						备案号：京ICP备15039570号&nbsp;&nbsp;&nbsp;&nbsp;Copyright © 2014 KenRobot.com All Rights Reserved
						<i class="kenrobot ken-close close-btn"></i>
					</div>
				</div>
			</div>
			<div class="modal dialog-layer">
				<div class="x-dialog x-dialog-custom login-dialog">
					<i class="kenrobot ken-close x-dialog-close"></i>
					<ul class="switch">
						<li class="account active" data-action="account"></li>
						<li class="weixin" data-action="weixin"><div class="tips">扫码登录更安全</div></li>
					</ul>
					<div class="logo"></div>
					<div class="seperator"></div>
					<div class="wrap">
						<div class="tab tab-account active">
							<div class="title">账号登录</div>
							<form>
								{!! csrf_field() !!}
								<input class="qrcode-key" type="hidden" value="{{$key or ''}}">
								<div class="field">
									<span class="icon"><i class="kenrobot ken-user"></i></span>
									<input class="email" type="email" name="email" value="{{old('email')}}" placeholder="邮箱地址/手机号码" autocomplete="off" />
								</div>
								<div class="field">
									<span class="icon"><i class="kenrobot ken-password"></i></span>
									<input class="password" type="password" name="password" placeholder="密码" />
								</div>
								<div class="message">
									<span></span>
								</div>
								<input class="login-btn" type="button" value="登录" />
							</form>
						</div>
						<div class="tab tab-weixin">
							<div class="scan">
								<img src="{{asset('/assets/image/weixin-scan.png')}}" />
							</div>
							<img class="qrcode" alt="微信扫码" src="{{$qrcodeurl or ''}}" />
							<div class="login-tips tips">
								请使用微信扫一扫<br />扫码关注后即可直接登录
							</div>
							<div class="register-tips tips">
								推荐使用微信扫码功能<br />扫码后将完成注册并登录
							</div>
						</div>
					</div>
					<div class="footer">
						<div class="login-footer">
							<a class="forget-password" href="{{$find_password_url}}">忘记密码</a>
							<a class="register" href="{{$register_url}}">点击注册</a>
							<span class="no-account">还没有啃萝卜账号？</span>
						</div>
						<div class="register-footer">
							<span class="no-account">不使用微信？前往</span>
							<a class="register" href="{{$register_url}}">网站注册</a>
						</div>
					</div>
				</div>
				<div class="x-dialog x-dialog-info install-dialog">
					<div class="x-dialog-title">安装</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content selectable">
						你没有安装啃萝卜<span class="strong">KenExt.crx</span>，请按以下步骤操作:
						<div class="step">
							Step 1: 点击<a href="/download/KenExt.crx" title="啃萝卜">下载</a><br />
							Step 2: 打开chrome浏览器，在地址栏输入<span class="strong">chrome://extensions</span><br />
							Step 3: 把<span class="strong">KenExt.crx</span>拖入浏览器<br />
							Step 4: 完成安装
						</div>
						<div class="des">说明: 如果顶部弹出“无法添加来自此网站的应用...”，请点击确定。由于一些你懂的原因，我们不能把插件发布到google应用商店。就算能发布，部分用户也不能...，所以<span class="helpless">╮(╯▽╰)╭</span></div>
					</div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-info arduino-driver-dialog">
					<div class="x-dialog-title">驱动问题</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content selectable">
						如果你遇到了Arduino<span class="strong">驱动问题</span>，请按以下步骤操作:
						<div class="step">
							Step 1: 点击<a class="downloadUrl" href="#" title="Arduino驱动">下载</a>并解压<br />
							Step 2: 运行<span class="strong">arduino驱动安装.exe</span><br />
							Step 3: 完成安装
						</div>
					</div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-info building-dialog">
					<div class="x-dialog-title">烧写</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content"></div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm-btn">确定</button>
					</div>
				</div>
				<div class="x-dialog save-dialog">
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content">
						<form>
							<div>
								<span class="filed-key">项目名称：</span>
								<input class="name" name="name" type="text" autocomplete="off" spellcheck="false" />
							</div>
							<div class="filed-intro">
								<span class="filed-key">项目简介：</span>
								<textarea class="intro" name="intro" rows="5" spellcheck="false"></textarea>
							</div>
							<div>
								<span class="filed-key">公开：</span>
								<div class="public-type">
									<label><input type="radio" name="public-type" value="0" checked="true" />私有</label>
									<label><input type="radio" name="public-type" value="1" />好友公开</label>
									<label><input type="radio" name="public-type" value="2" />完全公开</label>
								</div>
							</div>
							<input class="save-btn" type="button" value="保存" />
						</form>
					</div>
				</div>
			</div>
			<div class="message-layer"></div>
		</div>
	</body>
</html>
