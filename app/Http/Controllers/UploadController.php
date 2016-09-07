<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;
use App\Http\Requests;
use App\Util\Tools;

class UploadController extends Controller {

    public function index(Request $request) {
        $file = $request->file('image');
        // 文件是否上传成功
        if ($file->isValid()) {
            return response()->json(['status' => 1, 'message' => '上传失败']);
        }

        // 获取文件相关信息
        $ext = $file->getClientOriginalExtension();
        $realPath = $file->getRealPath();
        $hash = Tools::getHash();
        $filename = "$hash.$ext";
        $success = Storage::disk('uploads')->put($filename, file_get_contents($realPath));
        if(!$success) {
            return response()->json(['status' => 2, 'message' => '上传失败']);
        }

        return response()->json(['status' => 0, 'message' => '上传成功', 'hash' => $hash]);
    }
}