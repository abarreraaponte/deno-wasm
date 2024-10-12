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
    Route::put('/currencies/{currency_id}', [Api\CurrencyApiController::class, 'update']);
    Route::post('/entities/{model_route}', [Api\EntityApiController::class, 'store']);
    Route::post('/entity-models', [Api\EntityModelApiController::class, 'store']);
    Route::post('/ledgers', [Api\LedgerApiController::class, 'store']);
    Route::put('/ledgers/{ledger_id}', [Api\LedgerApiController::class, 'update']);
    Route::post('/product-models', [Api\ProductModelApiController::class, 'store']);
    Route::post('/products/{model_route}', [Api\ProductApiController::class, 'store']);
    Route::post('/transaction-models', [Api\TransactionModelApiController::class, 'store']);
});
