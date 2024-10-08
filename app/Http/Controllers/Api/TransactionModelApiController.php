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

        $transactionModel = new TransactionModel;
        $transactionModel->ref_id = $validated['ref_id'] ?? 'TM_'.Str::ulid();
        $transactionModel->alt_id = $validated['alt_id'] ?? null;
        $transactionModel->name = $validated['name'];
        $transactionModel->description = $validated['description'] ?? '';
        $transactionModel->save();

        return response()->json([
            'transactionModel' => $transactionModel,
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
