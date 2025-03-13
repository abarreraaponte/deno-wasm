<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
	$cached = Cache::get('test_cached_value');
    return view('welcome', ['cached' => $cached]);
});

Route::middleware(['auth'])->get('/restricted', function () {
	dd('You are in the restricted area');
});

Route::get('/auth/cognito/redirect', function () {
	return Socialite::driver('cognito')->redirect();
});

Route::get('/auth/cognito/callback', function () {
	$user = Socialite::driver('cognito')->user();
	return $user;
});
