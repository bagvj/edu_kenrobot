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

class HomeController extends Controller {

	public function __construct()
	{
		$this->middleware('snspassport');
	}

	public function index(Request $request) {
		if (Auth::check()) {
			$user = Auth::user();
		}

		$qrcode = rand(70000,80000);
		$qrcodeurl = $this->getQrcodeurl($qrcode);
		$key = 'qrscene_'.$qrcode;
		Session::put('key',$key);
		$mainpage = config('navigation.master.mainpage');

		$register_url = config('platform.url.register').'&redirect_uri='.urlencode($request->url());
		$find_password_url = config('platform.url.find_password');

		$has_visit = 1;
		return view("index", compact('user', 'mainpage', 'qrcodeurl', 'register_url', 'find_password_url', 'key', 'has_visit'));
	}

	private function getQrcodeurl($key) {
		$url = config('weixin.qrcode.url') . "$key";
		$curl = new Curl();
		$qrcodeurl = $curl->get($url);

		$image_data = base64_encode($curl->get($qrcodeurl));
		return "data:image/jpg;base64," . $image_data;
	}
}
