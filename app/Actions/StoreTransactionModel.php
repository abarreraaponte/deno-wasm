<?php

namespace App\Actions;

use App\Models\TransactionModel;
use Illuminate\Support\Str;

class StoreTransactionModel
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getValidationRules(): array
    {
        return [
            'ref_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:transaction_models,ref_id'],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:transaction_models,alt_id'],
            'name' => ['required', 'string', 'unique:transaction_models,name', 'max:120'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Execute the action.
     */
    public function execute(array $validated): TransactionModel
    {
        $transaction_model = new TransactionModel;
        $transaction_model->ref_id = $validated['ref_id'] ?? 'TM_'.Str::ulid();
        $transaction_model->alt_id = $validated['alt_id'] ?? null;
        $transaction_model->name = $validated['name'];
        $transaction_model->description = $validated['description'] ?? '';

        $transaction_model->route = Str::slug($transaction_model->name);
        $transaction_model->save();

        return $transaction_model;
    }
}
