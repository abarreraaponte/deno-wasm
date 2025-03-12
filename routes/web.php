<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;

Route::get('/', function () {
	$cached = Cache::get('test_cached_value');
    return view('welcome', ['cached' => $cached]);
});
