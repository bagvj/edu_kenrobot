<?php

namespace App\WebAuth;

/**
* 工厂
*/
class Factory
{
	public static function create($driver = null)
	{
		switch ($driver) {
				case 'sns':
					return new SnsAuth();
					
				case 'weixin':
					return new WeixinAuth();
				case 'weixinweb':
					return new WeixinWebAuth();
					break;
				default:
					return null;
				}	
	}
}