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

class HomeController extends Controller {

	public function __construct()
	{
		$this->middleware('snspassport');
	}

	public function index(Request $request) {
		if (Auth::check()) {
			$user = Auth::user();
		} else {
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

		return view("index", compact('user', 'loginInfo'));
	}
}
