<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\User;
use Auth;
use DB;
use Illuminate\Http\Request;
use ZipArchive;
use Curl\Curl;
use Session;
use App\Util\Tools;
use App\WebAuth\Factory as WebAuthFactory;
use App\WeiXin\JsSdk;

class HomeController extends Controller {

	public function index(Request $request) {
		if (Auth::check()) {
			$user = Auth::user();
		} else {
			if ($request->input('from') == 'weixin') {
				header('Location:http://weixinapp.kenrobot.com/social/edubetaauth');
			}

			$openid = $request->input('openid');
			if (!empty($openid)) {
				$webauth = WebAuthFactory::create('weixinweb');
				$crendentials = compact('openid');
				$loginResult = $webauth->validate($crendentials);

		        if ($loginResult === true) {
			        $user = $webauth->localUser();
			        Auth::login($user, true);
		        }
			}
		}


		$loginInfo = Tools::getLoginInfo($request->url());
		Session::put('key', $loginInfo->key);
		
		$isWeiXin = Tools::isWeiXin();
		if($isWeiXin) {
			$jsSdk = new JsSdk();
			$signPackage = $jsSdk->getSignPackage();
			
			return view("index", compact('user', 'loginInfo', 'isWeiXin', 'signPackage'));
		} else {
			return view("index", compact('user', 'loginInfo', 'isWeiXin'));
		}
	}
}
