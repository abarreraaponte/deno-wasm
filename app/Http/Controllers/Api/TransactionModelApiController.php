<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreTransactionModel;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionModelRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionModelApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionModelRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $transaction_model = (new StoreTransactionModel)->execute($validated);

        return response()->json($transaction_model, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
