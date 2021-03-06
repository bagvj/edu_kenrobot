<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\User;
use Auth;
use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use ZipArchive;
use Curl\Curl;
use Session;
use Storage;
use App\Util\Tools;
use App\Project\Project as ProjectModel;

class ProjectController extends Controller {

    public function buildProject(Request $request) {
        $id = $request->input('id');
        $id = intval($id);
        $project = ProjectModel::find($id);

        $user = $this->currentUser();

        if(!$project || !$user || $project['uid'] != $user['uid']) {
            return response()->json(['status' => -1, 'message' => '非法请求']);
        }

        $project_data = json_decode($project->project_data);
        //代码的字节码
        $source = $project_data->code;
        //项目名字
        $project_name = $project->project_name;
        //主板类型
        $board_type = $request->input('board_type');
        $board_type = isset($board_type) ? $board_type : 'uno';
        //项目hash
        $hash = $project->hash;

        $path = "/tmp/build/$hash";
        if(!file_exists($path)) {
            mkdir($path, 0755, true);
        }
        $f = fopen($path . "/main.ino", "wb");
        fwrite($f, $source);
        fclose($f);

        $cmd = "sudo sh ../app/Shell/build.sh $path $board_type $project_name 2>&1";
        $output = array();
        exec($cmd, $output, $status);
        if ($status != 0) {
            // $output = Tools::filterBuildOutput($output, $path);
            return response()->json(['status' => $status, 'message' => '编译失败', 'hash' => $hash, 'output' => $output]);
        }

        return response()->json(['status' => 0, 'message' => '编译成功', 'hash' => $hash, 'url' => "/project/download/$hash"]);
    }

    public function downloadProject(Request $request, $hash, $ext = "zip") {
        $project = ProjectModel::where('hash', $hash)->first();
        if(!$project) {
            return abort(404);
        }

        $ext = "." . $ext;
        $filename = "/tmp/build/$hash/build$ext";
        $build_info = "/tmp/build/$hash/build.info";
        if(!file_exists($filename) || !file_exists($build_info) ) {
            return abort(404);
        }

        $file = fopen($build_info, "r");
        $build_name = trim(fgets($file));
        fclose($file);

        $download_name = $build_name.$ext;
        return response()->download($filename, $download_name);
    }

    /**
     * 保存项目
     */
    public function saveProject(Request $request) {
        $keys_required = array('project_name');
        $keys = array('project_name','project_intro','project_data','public_type', 'imageHash');
        $input = $request->only($keys);

        $input['id'] = $request->input('id');
        $input['user_id'] = 0;

        $is_update = !empty($input['id']);

        //验证数据
        if (!$is_update) {
            foreach ($keys as $key) {
                //是否缺少参数
                if (!isset($input[$key])) {
                    return response()->json(array('status' => -1, 'message' => "[$key]为必需字段"));
                }
                //必要参数是否为空值
                if (in_array($key, $keys_required) && empty($input[$key])) {
                    return response()->json(array('status' => -1, 'message' => "[$key]不能为空"));
                }
            }
        }

        $user = $this->currentUser();
        if ($user === null) {
            return response()->json(['status' => -2, 'message' => "请登录后进行保存"]);
        }

        $input['uid'] = $user['uid'];
        $input['author'] = $user['name'];

        
        if ($is_update) {
            $project = ProjectModel::find($input['id']);
            if ($project == null) {
                return response()->json(['status' => -3, 'message' => '项目不存在']);
            }

            if ($project->uid != $input['uid']) {
                return response()->json(['status' => -5, 'message' => '没有该项目所有权']);
            }

            if(!$this->saveImage($input['imageHash'], $project->imageHash)) {
                unset($input['imageHash']);
            }

            //只留下要修改的字段
            foreach ($input as $k => $val) {
                if (!isset($input[$k])) {
                    unset($input[$k]);
                }
            }

            $ret =  $project->fill($input)->save();

            if ($ret) {
                return response()->json(['status' => 0, 'message' => '保存成功', 'data' => ['project_id' => $project->id, 'hash' => $project->hash]]);
            }else{
                return response()->json(['status' => -4, 'message' => '保存失败']);
            }
        }else {
            if(!$this->saveImage($input['imageHash'])) {
                $input['imageHash'] = '';
            }

            $input['hash'] = Tools::getHash();
            $project =  ProjectModel::create($input);
            if ($project == null) {
                return response()->json(['status' => -4, 'message' => '保存失败']);
            }
            return response()->json(['status' => 0, 'message' => '保存成功', 'data' => ['project_id' => $project->id,  'hash' => $project->hash]]);
        }
    }

    /**
     * 获取项目
     */
    public function getProject(Request $request) {
        $id = $request->input('id');
        $hash = $request->input('hash');
        $type = $request->input('type');
        $type = isset($type) ? $type : (isset($id) ? 'id' : 'hash');

        //获取最新一个
        if ($type != 'last' && empty($id) && empty($hash)) {
            return response()->json(['status' => -1, 'message' => '[id] or [hash]为必需字段']);
        }

        //传递默认参数
        $user = $this->currentUser();
        $uid = isset($user['uid']) ? $user['uid'] : 0;

        if ($type == 'id') {
            $project =  ProjectModel::find($id);
        }else if ($type == 'hash') {
            $project = ProjectModel::where('hash', $hash)->first();
        }else if($type == 'last'){
            $project = ProjectModel::where(array('uid' => $uid))->orderby('updated_at','desc')->first();
            if ($project != null) {
                return response()->json(['status' => 0, 'message' => '获取成功', 'data' => $project->toArray()]);
            }
        }

        if ($project == null) {
            return response()->json(['status' => -2, 'message' => '没有相关的数据']);
        }

        //私密
        if ($uid != $project->uid) {
            if ($project->public_type == 0) { //私有
                return response()->json(['status' => -3, 'message' => '没有权限查看这个项目']);
            }else if ($project->public_type == 1) { //私有
                return response()->json(['status' => -4, 'message' => '该项目仅好友可见']);
            }
        }

        return response()->json(['status' => 0, 'message' => '获取成功', 'data' => $project->toArray()]);
    }

    /**
     * 获取项目列表
     */
    public function getProjects(Request $request) {
     
        $user = $this->currentUser();

        if (empty($user)) {
            return $this->apiReturn(-1, '请登录');
        }

        $uid = $user['uid'];
        $projectList = ProjectModel::where('uid', $uid)
            ->orderby('updated_at', 'desc')
            ->get();
        if (!empty($projectList) && $projectList->count() > 0) {
            return response()->json(['status' => 0, 'message' => '', 'data' => $projectList->toArray()]);
        }
        
        return response()->json(['status' => -2, 'message' => '没有相关的数据', 'data' => []]);
    }

    /**
     * 项目列表,对外接口
     */
    public function getList(Request $request) {
		$uid = $request->input('uid');
		$page = $request->input('page');
		$pagesize = $request->input('pagesize');
		$page = !empty($page) ? intval($page) : 1;
		$pagesize = !empty($pagesize) ? intval($pagesize) : 3; 
        $user_id = 0;
		if ($page <= 0 || $pagesize <1 ) {
			return response()->json(['status' => -3, 'message' => '无效的页码数据']);
		}

		if (empty($uid)) {
			return response()->json(['status' => -1, 'message' => '[uid]为必需字段']);
		}
		$allowKeys = ['id','project_name', 'user_id', 'uid', 'author' ,'project_intro', 'public_type', 'hash'];
		$projectList = ProjectModel::where('uid', $uid)
			->orderby('updated_at','desc')
			->skip(($page-1)*$pagesize)
			->take($pagesize)
			->get($allowKeys);

		if (!empty($projectList) && $projectList->count() > 0) {
			$total = ProjectModel::where('uid', $uid)->count();
			return response()->json(['status' => 0, 'message' => '获取成功', 'data' => [
				'total' => $total, 
				'page' => $page,
				'pagesize' => $pagesize,
				'count' => $projectList->count(),
				'items' => $projectList->toArray()
			]]);
		}

		return response()->json(['status' => -2, 'message' => '没有相关的数据', 'data' => [
			'total' => 0, 
			'page' => $page,
			'pagesize' => $pagesize,
			'count' => 0,
			'items' => []
		]]);
    }

    /**
     * 删除项目
     * @param int id 项目ID
     */
    public function deleteProject(Request $request) {
        $id = $request->input('id');
        $id = intval($id);

        if (empty($id)) {
            return response()->json(['status' => -1, 'message' => '[id]为必需字段且类型为数字']);
        }

        $project = ProjectModel::find($id);

        if ($project == null) {
            return response()->json(['status' => -2, 'message' => '正在删除不存在的数据']);
        }

        //暂时不开放
        // if ($project->user_id != $request->input('user_id')) {
        //     return response()->json(['status' => -3, 'message' => '无权操作这个项目']);
        // }
        $ret = $project->delete();

        if ($ret) {
            return response()->json(['status' => 0, 'message' => '删除成功']);
        } else {
            return response()->json(['status' => -3, 'message' => '删除失败']);
        }
    }

    public function getSchema(Request $request) {
        return response()->json(['status' => 0, 'message' => '获取成功', 'data' => []]);
    }

    public function uploadImage(Request $request) {
        $file = $request->file('file');
        // 文件是否上传成功
        if (!$file || !$file->isValid()) {
            return response()->json(['status' => 1, 'message' => '上传失败']);
        }

        // 获取文件相关信息
        $realPath = $file->getRealPath();
        $hash = Tools::getHash();

        $path = "/tmp/upload";
        Tools::mkdirs($path);
        rename($realPath, "$path/$hash");
        return response()->json(['status' => 0, 'message' => '上传成功', 'hash' => $hash]);
    }

    public function getImage(Request $request, $hash) {
        $file = storage_path('app/upload') . "/$hash";
        if(file_exists($file)) {
            return response()->download($file, null, [], null);
        }

        return response()->download(storage_path('app/upload') . "/default", null, [], null);
    }

    private function saveImage($hash, $oldHash = '') {
        if(!$hash) {
            return false;
        }
        
        $path = "/tmp/upload/$hash";
        if(!file_exists($path)) {
            return false;
        }

        $disk = Storage::disk("upload");
        if($oldHash && $disk->has($oldHash)) {
             $disk->delete($oldHash);
        }

        $disk->put($hash, file_get_contents($path));
        return true;
    }
}