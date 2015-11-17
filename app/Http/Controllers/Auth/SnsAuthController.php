<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Auth;
use Session;
use App\User;
use Curl\Curl;

class SnsAuthController extends Controller
{


    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
      //  $this->middleware('guest', ['except' => 'getLogout']);
        $this->redirectPath = '/';
        $this->loginPath = '/auth/snslogin';        
    }

 



    /**
     * SNS登录.
     *
     * @return \Illuminate\Http\Response
     */
    public function snsLogin(Request $request)
    {
        $uid = $request->input('uid');
        $token = $request->input('token');

        

        $data = $this->getUserinfo($token);
        if ($data == null) {
            return redirect('/');//跳转根目录
        }

        $userInfo = array_only($data,['uid','uname','email','avatar_big']);

        $userInfo['name'] = $userInfo['uname'];
        unset($userInfo['uname']);

        $userInfo['avatar_url'] = $userInfo['avatar_big'];
        unset($userInfo['avatar_big']);

        $user = $this->getUser($userInfo);
        if ($user == null) {
           $user = $this->createUser($userInfo);
        }
        Auth::login($user,false);
        return redirect('/');

    }   

    /**
     * 使用sns账号密码登录
     */
    public function snsPostLogin(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');
        if (empty($email) || empty($password)) {
            redirect('/login')->with('message','登录失败');
        }

        $data = $this->validateSnsUser($email,$password);

        if ($data == null) {
            //验证失败了也要退出
            return redirect('/login');//跳转回登录界面
        }
        // dd($data);
        $userInfo = array_only($data,['uid','uname','email','avatar_big']);

        $userInfo['name'] = $userInfo['uname'];
        unset($userInfo['uname']);

        $userInfo['avatar_url'] = isset($userInfo['avatar_big']) ? $userInfo['avatar_big'] : '';
        unset($userInfo['avatar_big']);

        $user = $this->getUser($userInfo);
        if ($user == null) {
           $user = $this->createUser($userInfo);
        }
        Auth::logout();
        Auth::login($user,true);
        return redirect('/');



    }



    /**
     * 验证sns账号密码
     * 这个应该移到controller外面去
     * 且应该和
     */
    private function validateSnsUser($email,$password){

        $url = config('sns.validate.url');
        // $url = 'http://localhost:8800/N1CwG46Ml';
        $referer = config('sns.validate.referer');
        $key = config('sns.key');


        // echo $url,$referer,$key;

        $curl = new Curl();
        $curl->setReferrer($referer);

        $data = $curl->post($url,[
            'key' => $key,
            'email' => $email,
            'password' => $password
            ]);
       
            $userData = json_decode($data,true);
            return $userData;
    }


    private function getUserinfo($token = '')
    {

        $url = config('sns.userinfo.url');
        $referer = config('sns.userinfo.referer');
        $key = config('sns.key');

        $curl = new Curl();
        $curl->setReferrer($referer);
        $data = $curl->post($url,[
            'key' => $key,
            'token' => $token
            ]);
        $userData = json_decode($data,true);

        return $userData;
    }

    /**
     * 弃用方法，这个应该写在单元测试里，
     *
     */
    private function getFakeUserinfo($token = '')
    {
        $name = str_random();

        return ['name' => $name,
                'email' => $name.'@qq.com',
                'password' => $name,
                'uid'   => rand(1,99999)
        ];
    }


    /**
     * 获取本地用户
     * 这个功能应该放在UserRepository里
     */
    private function getUser($data = array()){
        if (!isset($data['uid'])) {
            return null;
        }

        $user = User::where('uid',$data['uid'])->first();
        return $user;
    }


    /**
     * 创建用户
     * 应该放在UserRepository里面
     */
    private function createUser($data = array())
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['email'].'321'),
            'uid'   => $data['uid'],
            'avatar_url' => $data['avatar_url'],
            'source'   => 'sns'
        ]);
    }



}
