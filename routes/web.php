<?php

use App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Web;
use Inertia\EncryptHistoryMiddleware;

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
Route::middleware(['auth'])->group(function () {
	Route::get('/home', Web\HomeController::class)->name('home');
	Route::post('/organizations', [Web\OrganizationController::class, 'store'])->name('organizations.store');
});

/**
 * Organization Area
 */
Route::prefix('/web/{organization_id}')->middleware(['auth', EncryptHistoryMiddleware::class /*,'organization'*/])->group(function () {
	Route::get('/', Web\DashboardController::class)->name('dashboard');
});

/**
 * Auth0 authentication routes.
 */
Route::get('/auth/auth0/redirect', [Auth\Auth0Controller::class, 'redirect']);
Route::get('/auth/auth0/callback', [Auth\Auth0Controller::class, 'callback']);
