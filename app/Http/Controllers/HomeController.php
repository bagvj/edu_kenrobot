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
use App\WeiXin\JsSdk;

class HomeController extends Controller {

	public function index(Request $request) {
	
		$attachSession = $this->attachSession();

		if ($attachSession) {
			return $attachSession;
		}

		$user = $this->currentUser();

		$mainpage = config('platform.url.mainpage');
		$find_password_url = config('platform.url.find_password');

		$isWeiXin = Tools::isWeiXin();
		if($isWeiXin) {
			$jsSdk = new JsSdk();
			$signPackage = $jsSdk->getSignPackage();
			
			return view("index", compact('user', 'mainpage', 'find_password_url', 'isWeiXin', 'signPackage'));
		} else {
			return view("index", compact('user', 'mainpage', 'find_password_url', 'isWeiXin'));
		}
	}
}
