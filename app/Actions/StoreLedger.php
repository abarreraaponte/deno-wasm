<?php

namespace App\Actions;

use App\Models\Currency;
use App\Models\Ledger;
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

    /**
     * Execute the action.
     */
    public function execute(array $validated): Ledger
    {
        $validated_object = (object) $validated;

        $currency = Currency::findByIdOrIsoCode($validated_object->currency_id);

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
