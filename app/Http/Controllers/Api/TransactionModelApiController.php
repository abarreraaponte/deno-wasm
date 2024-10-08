<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionModelRequest;
use App\Models\TransactionModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

        $transaction_model = new TransactionModel;
        $transaction_model->ref_id = $validated['ref_id'] ?? 'TM_'.Str::ulid();
        $transaction_model->alt_id = $validated['alt_id'] ?? null;
        $transaction_model->name = $validated['name'];
        $transaction_model->description = $validated['description'] ?? '';

        $transaction_model->route = Str::slug($transaction_model->name);
        $transaction_model->save();

        return response()->json([
            'transactionModel' => $transaction_model,
            'message' => 'Transaction Model created successfully',
        ], 201);
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
