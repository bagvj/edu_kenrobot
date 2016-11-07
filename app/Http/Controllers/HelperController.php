<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Storage;
use Endroid\QrCode\QrCode;

class HelperController extends Controller {

	public function report(Request $request) {
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

	public function qrcode(Request $request) {
		$content = $request->input("content");
		if(!isset($content)) {
			echo "content required";
			return;
		}

		$size = $request->input("size", 240);
		$logo_size = $request->input("logo_size", 72);

		$logo = $request->input("logo", true);
		$logo = $logo ? realpath("./assets/image/logo3.png") : false;

		$qrCode = new QrCode();
		$qrCode->setText($content)->setSize($size)->setPadding(0)->setErrorCorrection('high');

		if($logo && file_exists($logo)) {
			$qrCode->setLogoSize($logo_size)->setLogo($logo);
		}

		return new Response($qrCode->get(), 200, array('Content-Type' => $qrCode->getContentType()));
	}
}