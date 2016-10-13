<?php

namespace App\WebAuth;

use Curl\Curl;
use App\User;
/**
* 
*/
class WeixinWebAuth implements WebAuth
{

    protected $user;

    protected $url;

    protected $api_user_url;

    protected $api_validate_url;

    protected $curl;

    /**
     * 用于获取用户信息的凭据
     */
    protected $token;
    
    function __construct()
    {

        $this->api_user_url = 'http://weixinapp.kenrobot.com/api/social/userinfo';
        $this->api_validate_url = 'http://weixinapp.kenrobot.com/api/social/userinfo';

        $this->curl = new Curl();
    }

    /**
     * 验证是登录是否成功
     *
     * @param array $crendetials
     * @return bool
     */
    public function validate(array $credentials){

        $key = $credentials['openid'];
        
        //验证参数条件
        if ($key == null) {
            return false;
        }

        $userData = $this->getUserFromServer($credentials);
        
        if ($userData !== null) {
            $userData = $this->formatUserData($userData);
            if ($userData !== null) {
                $this->user = $userData;
                return true;
            }
        }
        return false;
    }

    /**
     * 获取用户信息，登录失败的时候返回null
     * 
     * @return array | null
     */
    public function user(){
        return $this->user;
    }

    /**
     * 本地用户
     */
    public function localUser()
    {
        if (empty($this->user) || empty($this->user['openid'])) {
            return null;
        }


        $user = User::where('email',$this->user['email'])->first();
        if (!empty($user)) {
            $user->name = $this->user['name'];
            $user->avatar_url = $this->user['avatar_url'];
            $user->save();
        } else {
             $user = User::create([
                'name' => $this->user['name'],
                'email' => $this->user['email'],
                'password' => bcrypt($this->user['email'].'321'),
                'openid'   => $this->user['openid'],
                'avatar_url' => $this->user['avatar_url'],
                'source'   => 'weixinweb'
            ]);
        }
        
        return $user;
    }


    /**
     * 格式化数据
     */
    protected function formatUserData($rawuserdata)
    {
       if (empty($rawuserdata)) {
           return null;
       }

       $userdata = [];

       $userdata['openid'] = $rawuserdata['openid'];
       $userdata['name'] = $rawuserdata['nickname'];
       $userdata['email'] = $rawuserdata['openid'].'@kenrobot.com';
       $userdata['avatar_url'] = $rawuserdata['headimgurl'];

       return $userdata;
    }

    /**
     * 调用远程验证
     *
     * @param array $crendentials
     *
     * @return array
     */
    protected function validUserFromServer($crendetials)
    {
        return $this->getUserFromServer($crendetials);
    }

    /**
     * 远程用户接口
     *
     */
    protected function getUserFromServer($params)
    {
        $data = $this->curl->get($this->api_user_url,$params);

        if (is_string($data)) {
            $userData = json_decode($data, true);
        } else {
            $userData = (array) $data;
        }
        if (empty($userData) || $userData['status'] !=0 || empty($userData['data']) ) {
            return null;
        }
        return  (array) $userData['data'];
    }

}