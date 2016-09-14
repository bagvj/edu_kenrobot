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
Route::get('/project/download/{hash}/{ext?}', 'ProjectController@downloadProject')->where('hash', '[0-9a-zA-Z]{6}');
Route::get('/project/image/{hash}', 'ProjectController@getImage');

Route::post('/api/project/schema', 'ProjectController@getSchema');
Route::post('/api/project/build', 'ProjectController@buildProject');
Route::post('/api/project/save', 'ProjectController@saveProject');
Route::post('/api/project/delete', 'ProjectController@deleteProject');
Route::post('/api/project/get', 'ProjectController@getProject');
Route::post('/api/project/upload', 'ProjectController@uploadImage');
Route::post('/api/projects/user', 'ProjectController@getProjects');
Route::post('/api/projects/list', 'ProjectController@getList');

// 登录验证
Route::post('/api/auth/info', 'Auth\WebAuthController@loginInfo');
Route::post('/api/auth/check', 'Auth\WebAuthController@check');
Route::post('/api/auth/login', 'Auth\WebAuthController@snsPostLogin');
Route::post('/api/auth/login/weixin', 'Auth\WebAuthController@weixinLogin');
Route::post('/api/auth/logout', 'Auth\WebAuthController@postLogout2');