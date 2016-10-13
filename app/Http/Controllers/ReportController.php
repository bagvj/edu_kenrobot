<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Curl\Curl;

class ReportController extends Controller {

	public function error(Request $request) {
		$errors = $request->input('error');
		$errors = json_decode($errors);
		var_dump($errors);
	}
}