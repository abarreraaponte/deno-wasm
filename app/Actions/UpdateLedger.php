<?php

namespace App\Actions;

use App\Models\Ledger;
use Illuminate\Validation\Rule;

class UpdateLedger
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

	public function getValidationRules(Ledger $ledger): array
	{
		return [
            'ref_id' => ['sometimes', 'required', 'string', 'max:64', Rule::unique('ledgers', 'ref_id')->ignore($ledger)],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', Rule::unique('ledgers', 'alt_id')->ignore($ledger)],
            'name' => ['sometimes', 'required', 'string', Rule::unique('ledgers', 'name')->ignore($ledger), 'max:120'],
            'description' => ['sometimes', 'nullable', 'string'],
            'currency_id' => ['missing'],
            'active' => ['sometimes', 'nullable', 'boolean'],
        ];
	}

    /**
     * Execute the action.
     */
    public function execute(Ledger $ledger, array $validated): Ledger
    {
		$ledger->update($validated);

        return $ledger;
    }
}
