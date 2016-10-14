<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Storage;

class ReportController extends Controller {

	public function error(Request $request) {
		$errors = $request->input('error');
		$errors = json_decode($errors);

		$str = "---------" . date('Y-m-d H:i:s') . "---------\n";
		foreach($errors as $error) {
			$str = $str . "$error->message($error->src:$error->line:$error->col), count $error->count\n$error->stack\n";
		}
		$str = $str . "-------------------------------------\n\n";
		
		$name = "error.log";
		$storage = Storage::disk("report");
		$storage->exists($name) ? $storage->append($name, $str) : $storage->put($name, $str);
	}
}