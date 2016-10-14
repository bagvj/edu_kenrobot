<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Storage;

class ReportController extends Controller {

	public function index(Request $request) {
		$type = $request->input('type');
		$content = $request->input('content');
		if(!isset($type) || !isset($content)) {
			return;
		}

		if($type == "error") {
			$errors = json_decode($content);
			$str = "---------" . date('Y-m-d H:i:s') . "---------\n";
			foreach($errors as $error) {
				$str = $str . "$error->message($error->src:$error->line:$error->col), count $error->count\n$error->stack\n";
			}
			$str = $str . "-------------------------------------\n\n";
			
			$name = "error.log";
			$storage = Storage::disk("report");
			$storage->exists($name) ? $storage->append($name, $str) : $storage->put($name, $str);
		} else if($type == "debug") {
			$messages = json_decode($content);
			$str = "---------" . date('Y-m-d H:i:s') . "---------\n";
			$str = $str . implode("\n", $messages) . "\n";
			$str = $str . "-------------------------------------\n\n";
			
			$name = "debug.log";
			$storage = Storage::disk("report");
			$storage->exists($name) ? $storage->append($name, $str) : $storage->put($name, $str);
		}		
	}
}