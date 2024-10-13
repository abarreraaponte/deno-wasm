<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreLedger;
use App\Actions\UpdateLedger;
use App\Http\Controllers\Controller;
use App\Models\Ledger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LedgerApiController extends Controller
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

        $creator = new StoreLedger;

        $validated = $request->validate($creator->getValidationRules());

        $ledger = (new StoreLedger)->execute($validated);

        return response()->json($ledger, 201);
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
    public function update(Request $request, string $ledger_id)
    {
        // Temp: Implement authorization here.

        $updater = new UpdateLedger;

        $ledger = Ledger::findById($ledger_id);

        if (! $ledger) {
            abort(404, 'Ledger not found');
        }

        $validated = $request->validate($updater->getValidationRules($ledger), [
            'currency_id.missing' => 'The currency_id field is not allowed.',
        ]);

        $updated_ledger = $updater->execute($ledger, $validated);

        return response()->json($updated_ledger, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $ledger_id)
    {
        $ledger = Ledger::findById($ledger_id);

        if (! $ledger) {
            abort(404, 'Ledger not found');
        }

        $check = $ledger->canBeDeleted();

        if (! $check) {
            abort(403, 'Ledger cannot be deleted');
        }

        $ledger->delete();

        return response()->json([], 204);
    }
}
