<?php

use App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

/**
 * Login page. For the time being only redirects to the Auth0 authentication page.
 */
Route::get('/login', [Auth\AuthController::class, 'login'])->name('login');

/**
 * Restricted area.
 */
Route::middleware(['auth'])->get('/restricted', function () {
    return Inertia::render('Restricted');
})->name('restricted');

/**
 * Auth0 authentication routes.
 */
Route::get('/auth/auth0/redirect', [Auth\Auth0Controller::class, 'redirect']);
Route::get('/auth/auth0/callback', [Auth\Auth0Controller::class, 'callback']);
