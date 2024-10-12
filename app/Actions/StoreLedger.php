<?php

namespace App\Actions;

use App\Models\Currency;
use App\Models\Ledger;
use App\Rules\CurrencyExists;
use Illuminate\Support\Str;

class StoreLedger
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getValidationRules()
    {
        return [
            'ref_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:ledgers,ref_id'],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:ledgers,alt_id'],
            'name' => ['required', 'string', 'unique:ledgers,name', 'max:120'],
            'description' => ['nullable', 'string'],
            'currency_id' => ['required', 'string', new CurrencyExists],
            'active' => ['sometimes', 'nullable', 'boolean'],
        ];
    }

    /**
     * Execute the action.
     */
    public function execute(array $validated): Ledger
    {
        $currency = Currency::findByIdOrIsoCode($validated['currency_id']);

        $ledger = new Ledger;
        $ledger->ref_id = $validated['ref_id'] ?? 'LED_'.Str::ulid();
        $ledger->alt_id = $validated['alt_id'] ?? null;
        $ledger->name = $validated['name'];
        $ledger->description = $validated['description'] ?? null;
        $ledger->currency_id = $currency->id;
        $ledger->active = $validated['active'] ?? true;
        $ledger->save();

        return $ledger;
    }
}
