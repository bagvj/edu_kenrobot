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

Route::get('/api/project/download/{hash}/{ext?}', 'NewProjectController@downloadProject')->where('hash', '[0-9a-zA-Z]{6}');
Route::post('/api/project/build', 'NewProjectController@buildProject');
Route::post('/api/project/save', 'NewProjectController@saveProject');
Route::post('/api/project/delete', 'NewProjectController@deleteProject');
Route::post('/api/project/get', 'NewProjectController@getProject');
Route::any('/api/projects/user', 'NewProjectController@getProjects');

// 登录验证
Route::post('/api/auth/login', 'Auth\WebAuthController@snsPostLogin');
Route::post('/api/auth/login/weixin', 'Auth\WebAuthController@weixinlogin');
Route::get('/api/auth/check', 'Auth\WebAuthController@check');