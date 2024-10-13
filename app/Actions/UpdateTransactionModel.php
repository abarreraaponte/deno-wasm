<?php

namespace App\Actions;

use App\Models\TransactionModel;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateTransactionModel
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getValidationRules(TransactionModel $transaction_model): array
    {
        return [
            'ref_id' => ['sometimes', 'required', 'string', 'max:64', Rule::unique('ledgers', 'ref_id')->ignore($transaction_model)],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', Rule::unique('ledgers', 'alt_id')->ignore($transaction_model)],
            'name' => ['sometimes', 'required', 'string', Rule::unique('ledgers', 'name')->ignore($transaction_model), 'max:120'],
            'description' => ['sometimes', 'nullable', 'string'],
        ];
    }

    /**
     * Execute the action.
     */
    public function execute(TransactionModel $transaction_model, array $validated)
    {
        $transaction_model->fill($validated);

        if (isset($validated['update_slug']) && $validated['update_slug']) {
            $transaction_model->route = Str::slug($validated['name']);
        }

        $transaction_model->save();

        return $transaction_model;
    }
}
