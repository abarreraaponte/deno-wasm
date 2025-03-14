<?php

use App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $cached = Cache::get('test_cached_value');

    return view('welcome', ['cached' => $cached]);
});

Route::middleware(['auth'])->get('/restricted', function () {
    dd('You are in the restricted area', 'You are logged in if you can see this.');
});

/**
 * Cognito authentication routes.
 */
Route::get('/auth/cognito/redirect', [Auth\CognitoController::class, 'redirect']);
Route::get('/auth/cognito/callback', [Auth\CognitoController::class, 'callback']);
