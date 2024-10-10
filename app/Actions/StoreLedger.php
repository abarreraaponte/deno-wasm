<?php

namespace App\Actions;

use App\Models\Ledger;
use App\Models\Currency;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

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

		$currency = Currency::where(function (Builder $query) use ($validated_object) {

            $isUuid = Str::isUuid($validated_object->currency_id);

            if ($isUuid) {
                $query->where('id', $validated_object->currency_id)->orWhere('iso_code', $validated_object->currency_id)->orWhere('name', $validated_object->currency_id);
            } else {
                $query->where('iso_code', $validated_object->currency_id)->orWhere('name', $validated_object->currency_id);
            }

        })->first();

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
