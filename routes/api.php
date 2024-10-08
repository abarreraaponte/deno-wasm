<?php

use App\Http\Controllers\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/accounts', [Api\AccountApiController::class, 'store']);
    Route::post('/currencies', [Api\CurrencyApiController::class, 'store']);
    Route::post('/entity-models', [Api\EntityModelApiController::class, 'store']);
    Route::post('/ledgers', [Api\LedgerApiController::class, 'store']);
    Route::post('/product-models', [Api\ProductModelApiController::class, 'store']);
    Route::post('/transaction-models', [Api\TransactionModelApiController::class, 'store']);
});
