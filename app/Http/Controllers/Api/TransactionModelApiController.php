<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreTransactionModel;
use App\Actions\UpdateTransactionModel;
use App\Http\Controllers\Controller;
use App\Models\TransactionModel;
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
    public function store(Request $request): JsonResponse
    {
        // Temp: Implement authorization here.

        $creator = new StoreTransactionModel;

        $validated = $request->validate($creator->getValidationRules());

        $transaction_model = $creator->execute($validated);

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
    public function update(Request $request, string $transaction_model_id)
    {
        $updater = new UpdateTransactionModel;

        $transaction_model = TransactionModel::findById($transaction_model_id);

        if (! $transaction_model) {
            abort(404, 'Transaction Model not found');
        }

        $validated = $request->validate($updater->getValidationRules($transaction_model));

        $updated_transaction_model = $updater->execute($transaction_model, $validated);

        return response()->json($updated_transaction_model, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $transaction_model_id)
    {
        $transaction_model = TransactionModel::findById($transaction_model_id);

        if (! $transaction_model) {
            abort(404, 'Transaction Model not found');
        }

        $check = $transaction_model->canBeDeleted();

        if (! $check) {
            abort(403, 'Transaction Model cannot be deleted');
        }

        $transaction_model->delete();

        return response()->json(null, 204);
    }
}
