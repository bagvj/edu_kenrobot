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
		<link href="assets/css/index.css" rel="stylesheet" />
		@if(!env('APP_DEBUG'))
		<script scr="//hm.baidu.com/hm.js?{{env('PV_KEY')}}"></script>
		@endif
		<script src="assets/js/require.js" data-main="assets/js/index"></script>
	</head>
	<body>
		<div class="main">
			<div class="sidebar-region">
				<a class="logo" href="http://www.kenrobot.com">教育版</a>
				<ul class="top">
					<li data-action="project">项目</li>
					<li data-action="hardware">硬件</li>
					<li data-action="software">编程</li>
					<li data-action="code">源代码</li>
				</ul>
				<ul class="bottom">
					<li data-action="upload">上传</li>
					<li data-action="help">帮助</li>
				</ul>
			</div>
			<div class="content-region">
				<div class="sidebar-tabs">
					<div class="tab tab-project">
						项目
					</div>
					<div class="tab tab-hardware">
						硬件
					</div>
					<div class="tab tab-software">
						编程
					</div>
				</div>
				<div class="wrap">
					<div class="content-header">
						<div class="project-region">
							<input class="new" type="button" value="新建项目" />
							<select class="boards">
								<option></option>
								<option></option>
							</select>
							<input class="save" type="button" value="保存" />
							<input class="upload" type="button" value="上传" />
						</div>
						<div class="login-region">
							@if(isset($user))
							<a class="photo" target="_blank" href="{{$loginInfo->home_url}}">
								<img src="{{$user->avatar_url or 'assets/image/default-user.png'}}" />
							</a>
							@else
							<a class="photo no-user" href="javascript:;" target="_blank" data-href="{{$loginInfo->home_url}}">
								<img src="assets/image/default-user.png" />
							</a>
							@endif
							<div class="login-menu">
								<div class="tab tab-action {{isset($user) ? 'active' : ''}}">
									<ul>
										<li><a href="{{$loginInfo->home_url}}" target="_blank">主页</a></li>
										<li><a href="/logout">退出</a></li>
									</ul>
								</div>
								<div class="tab tab-login {{isset($user) ? '' : 'active'}}">
									<input class="login-btn" type="button" value="立即登录" />
									<div class="no-accout">没有账号？<a class="register-btn" href="{{$loginInfo->register_url}}">立即注册</a></div>
								</div>
							</div>
						</div>
					</div>
					<div class="content-tabs">
						<div class="tab tab-hardware">
							硬件
						</div>
						<div class="tab tab-software">
							编程
						</div>
						<div class="tab tab-code">
							代码
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="layers">
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
								<input class="qrcode-key" type="hidden" value="{{$loginInfo->key or ''}}">
								<div class="field">
									<span class="icon"><i class="kenrobot ken-user"></i></span>
									<input class="email" type="email" name="email" placeholder="邮箱地址/手机号码" autocomplete="off" />
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
								<img src="{{asset('assets/image/weixin-scan.png')}}" />
							</div>
							<img class="qrcode" alt="微信扫码" src="{{$loginInfo->qrcode_url or ''}}" />
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
							<a class="forget-password" href="{{$loginInfo->find_password_url}}">忘记密码</a>
							<a class="register" href="{{$loginInfo->register_url}}">点击注册</a>
							<span class="no-account">还没有啃萝卜账号？</span>
						</div>
						<div class="register-footer">
							<span class="no-account">不使用微信？前往</span>
							<a class="register" href="{{$loginInfo->register_url}}">网站注册</a>
						</div>
					</div>
				</div>
			</div>
			<div class="message-layer"></div>
		</div>
	</body>
</html>
