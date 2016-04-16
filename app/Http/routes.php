<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
 */
Route::get('/', 'HomeController@index');
Route::get('/logout', 'Auth\AuthController@getLogout2');

Route::post('/api/project/build', 'ProjectController@buildProject');
Route::post('/api/project/save', 'ProjectController@saveProject');
Route::post('/api/project/delete', 'ProjectController@deleteProject');
Route::get('/api/project/download/{key}/{ext?}', 'ProjectController@downloadProject')->where('key', '([1-9][0-9]*)|([0-9a-zA-Z]{6,6})');
Route::get('/api/project/{key}', 'ProjectController@getProject')->where('key', '([1-9][0-9]*)|([0-9a-zA-Z]{6,6})');
Route::get('/api/projects/{user_id}', 'ProjectController@getProjects')->where('user_id', '[1-9][0-9]*');

// 登录验证
Route::post('/api/auth/login', 'Auth\WebAuthController@snsPostLogin');
Route::post('/api/auth/login/weixin', 'Auth\WebAuthController@weixinlogin');
Route::get('/api/auth/check', 'Auth\AuthServerController@index');