<!DOCTYPE HTML>
<html>
	<head>
		<meta charset='utf-8'>
		<meta name="viewport" content="user-scalable=no">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="screen-orientation" content="landscape">
		<meta name="x5-orientation" content="landscape">
		<title>啃萝卜智能硬件平台</title>
		<meta name="keywords" content="arduino 开发 IDE 开发平台 教程">
		<meta name="description" content="啃萝卜智能硬件平台">
		<meta name="csrf-token" content="{{csrf_token()}}">
		<link href="assets/css/index.css?v={{time()}}" rel="stylesheet">
		@if(!env('APP_DEBUG'))
		<script scr="//hm.baidu.com/hm.js?{{env('PV_KEY')}}"></script>
		@endif
		<script src="assets/js/require.js" data-main="assets/js/index"></script>
	</head>
	<body>
		<div class="main no-select">
			<div class="sidebar-region">
				<div class="top">
					<div class="logo"></div>
					<div class="name">教育版</div>
					<div class="url">edu.kenrobot.com</div>
				</div>
				<ul class="center">
					<li data-action="project"><i class="icon kenrobot ken-edu-project"></i><span class="name">项目</span></li>
					<li data-action="hardware"><i class="icon kenrobot ken-edu-hardware"></i><span class="name">硬件</span></li>
					<li data-action="software"><i class="icon kenrobot ken-edu-block"></i><span class="name">编程</span></li>
					<li data-action="code"><i class="icon kenrobot ken-edu-code"></i><span class="name">源码</span></li>
				</ul>
				<ul class="bottom">
					<li data-action="share"><i class="icon kenrobot ken-edu-share"></i><span class="name">分享</span></li>
					<li data-action="help" data-href="http://www.kenrobot.com/index.php?app=square&mod=Index&act=help"><i class="icon kenrobot ken-edu-help"></i><span class="name">帮助</span></li>
				</ul>
			</div>
			<div class="content-region">
				<div class="sidebar-tabs">
					<div class="tab tab-project no-scrollbar">
						<ul class="list"></ul>
					</div>
					<div class="tab tab-hardware">
						<div class="search-wrap">
							<input class="search" type="text" placeholder="搜索..." />
							<i class="kenrobot ken-search"></i>
						</div>
						<div class="filters-wrap">
							<ul class="filters">
								<li data-filter="all">全部</li>
								<li data-filter="sensor">传感模块</li>
								<li data-filter="action">执行模块</li>
								<li data-filter="function">功能模块</li>
							</ul>
						</div>
						<div class="components-wrap no-scrollbar">
							<ul class="components"></ul>
						</div>
					</div>
					<div class="tab tab-software">
						<div class="filters-wrap">
							<ul class="filters">
								<li data-filter="module">模块</li>
								<li data-filter="function">函数</li>
								<li data-filter="var">变量</li>
								<li data-filter="code">代码</li>
								<li data-filter="math">数学函数</li>
								<li data-filter="text">文本</li>
								<li data-filter="control">控制</li>
								<li data-filter="logic">逻辑运算</li>
							</ul>
						</div>
						<div class="filter">
							<span class="filter-name">全部</span>
							<input class="advanced" type="button" value="高级" />
						</div>
						<div class="blocks-wrap no-scrollbar">
							<ul class="blocks"></ul>
						</div>
					</div>
				</div>
				<div class="wrap">
					<div class="content-header">
						<div class="project-region">
							<div class="name-wrap">
								<div class="name ellipsis"></div>
							</div>
							<div class="project-wrap clearfix">
								<input class="x-btn new" type="button" value="新建项目" />
								<div class="x-select boards">
									<div class="placeholder"></div>
									<ul></ul>
								</div>
								<input class="x-btn share" type="button" value="分享" />
								<input class="x-btn save" type="button" value="保存" />
								<input class="x-btn upload" type="button" value="上传" />
							</div>
						</div>
						<div class="login-region">
							<div class="photo{{isset($user) ? '' : ' no-user'}}" data-href="{{$loginInfo->home_url}}">
								@if(isset($user))
								<img src="{{$user->avatar_url or 'assets/image/default-user.png'}}" />
								@else
								<img src="assets/image/default-user.png" />
								@endif
							</div>
							<div class="login-menu">
								<div class="tab tab-user {{isset($user) ? 'active' : ''}}">
									<ul>
										<li data-action="setting"><span>设置</span></li>
										<li><a href="/logout">退出</a></li>
									</ul>
								</div>
								<div class="tab tab-no-user{{isset($user) ? '' : ' active'}}">
									<ul>
										<li data-action="login"><span>登录</span></li>
										<li data-action="register"><span>注册</span></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="content-tabs">
						<div class="tab tab-hardware" data-action="hardware">
							<div id="hardware-container" class="hardware-container" droppable="true">
								<div class="board absolute-center">
								</div>
							</div>
							<div class="component-dialog">
								<span class="name-label">名字</span>
								<input class="name" type="text" spellcheck="false" />
							</div>
							<ul class="x-context-menu component-menu">
								<li data-action="copy">复制</li>
								<li data-action="disconnect">断开</li>
								<li data-action="delete">删除</li>
							</ul>
							<ul class="x-context-menu board-menu">
								<li data-action="disconnect">断开</li>
								<li data-action="delete">删除</li>
							</ul>
						</div>
						<div class="tab tab-software" data-action="software">
							<div id="software-container" class="software-container no-scrollbar">
								<div class="block-group-region block-global">
									<div class="group-header"><span>全局变量、函数</span></div>
									<div class="group-extension">
										<div class="group-description">如果你有变量需要在setup和loop里面同时使用，要在这里定义哦<br />如果你需要定义函数，要在这里定义哦</div>
										<div class="group-placeholder">拖一个块放到这里开始你第一个程序吧</div>
									</div>
								</div>
								<div class="block-group-region block-setup">
									<div class="group-header"><span>Setup</span></div>
									<div class="group-extension">
										<div class="group-description">什么事情需要程序开始时只做一遍，放在这里面吧</div>
										<div class="group-placeholder">拖一个块放到这里开始你第一个程序吧</div>
									</div>
								</div>
								<div class="block-group-region block-loop">
									<div class="group-header"><span>Loop</span></div>
									<div class="group-extension">
										<div class="group-description">这里就是程序一直在做的事情，记得是无循环哦</div>
										<div class="group-placeholder">拖一个块放到这里开始你第一个程序吧</div>
									</div>
								</div>
							</div>
							<ul class="x-context-menu block-menu">
								<li data-action="copy">复制</li>
								<li data-action="comment">注释</li>
								<li data-action="uncomment">取消注释</li>
								<li data-action="delete">删除</li>
							</ul>
						</div>
						<div class="tab tab-code" data-action="code">
							<div id="code-container" class="code-container"></div>
						</div>
					</div>
					<div class="layer message-layer" data-offset="120"></div>
				</div>
			</div>
		</div>
		<div class="no-select">
			<div class="layer modal dialog-layer">
				<div class="x-dialog login-dialog">
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
				<div class="x-dialog project-dialog">
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="image no-image">
						<div class="mask"></div>
						<input class="absolute-center upload" type="button" value="上传项目图片" />
						<input class="file" type="file" accept="image/jpeg" />
						<div class="message"></div>
					</div>
					<div class="info">
						<div class="field-label">项目名称：</div>
						<input class="name" type="text" placeholder="在此输入项目名称，如Arduino Project 01" />
						<div class="field-label">项目介绍：</div>
						<textarea class="intro" placeholder="介绍下您的项目，如项目背景、目的、功能..." spellcheck="false"></textarea>
						<div class="field-label public-label">公开程度：</div>
						<div>
							<input class="public" id="public-2" name="public" type="radio" value="2" checked="checked" /><label for="public-2">完全公开</label>
							<input class="public" id="public-1" name="public" type="radio" value="1" /><label for="public-1">好友公开</label>
							<input class="public" id="public-0" name="public" type="radio" value="0" /><label for="public-0">仅自己可见</label>
						</div>
					</div>
					<div class="x-dialog-btns">
						<input class="x-dialog-btn cancel" type="button" value="取消" /><input class="x-dialog-btn confirm" type="button" value="创建" />
					</div>
				</div>
				<div class="x-dialog common-dialog">
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-header"></div>
					<div class="x-dialog-content"></div>
					<div class="x-dialog-btns">
						<input class="x-dialog-btn cancel" type="button" value="取消" /><input class="x-dialog-btn confirm" type="button" value="确定" />
					</div>
				</div>
				<div class="x-dialog share-dialog">
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-header"></div>
					<div class="x-dialog-content">
						<div class="left">
							<div class="share" data-action="wechat"><i class="kenrobot ken-wechat"></i>微信扫码</div>
							<img class="qrcode" />
						</div>
						<div class="right">
							<ul>
								<li class="share" data-action="weibo"><i class="kenrobot ken-weibo"></i>新浪微博</li>
								<li class="share" data-action="qzone"><i class="kenrobot ken-qzone"></i>QQ空间</li>
								<li class="share" data-action="kenrobot"><i class="kenrobot ken-kenrobot-logo"></i>啃萝卜</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="x-dialog port-dialog">
					<div class="x-dialog-title"><i class="kenrobot ken-setting"></i>端口选择</div>
					<div class="port-label">端口:</div>
					<div class="x-select port-list">
						<div class="placeholder"></div>
						<ul></ul>
					</div>
					<div class="x-dialog-btns">
						<input class="x-dialog-btn cancel" type="button" value="取消" /><input class="x-dialog-btn confirm" type="button" value="确定" />
					</div>
				</div>
				<div class="x-dialog install-dialog">
					<div class="x-dialog-title">安装</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content selectable">
						你没有安装啃萝卜<span class="strong">KenExt.crx</span>，请按以下步骤操作:
						<div class="step">
							Step 1: 点击<a href="http://ide.kenrobot.com/download/KenExt.crx" title="啃萝卜">下载</a><br />
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
			</div>
			<div class="layer drag-layer block-drag-layer"></div>
			<div class="layer drag-layer component-drag-layer"></div>
		</div>
	</body>
</html>
