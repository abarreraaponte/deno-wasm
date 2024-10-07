<?php

use App\Http\Controllers\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/currencies', [Api\CurrencyApiController::class, 'store']);
    Route::post('/ledgers', [Api\LedgerApiController::class, 'store']);
    Route::post('/accounts', [Api\AccountApiController::class, 'store']);
});
