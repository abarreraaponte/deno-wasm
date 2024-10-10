<?php

namespace App\Actions;

use App\Models\Ledger;

class UpdateLedger
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
    public function execute(Ledger $ledger, array $validated): Ledger
    {
        $validated_object = (object) $validated;

        if ($validated_object->ref_id) {
            $ledger->ref_id = $validated['ref_id'];
        }

        if ($validated_object->alt_id) {
            $ledger->alt_id = $validated['alt_id'];
        }

        if ($validated_object->name) {
            $ledger->name = $validated['name'];
        }

        if ($validated_object->description) {
            $ledger->description = $validated['description'] ?? '';
        }

        if ($validated_object->active) {
            $ledger->active = $validated['active'];
        }

        $ledger->save();

        return $ledger;
    }
}
