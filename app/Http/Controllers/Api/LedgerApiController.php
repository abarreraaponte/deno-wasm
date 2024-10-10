<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreLedger;
use App\Actions\UpdateLedger;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLedgerRequest;
use App\Http\Requests\UpdateLedgerRequest;
use App\Models\Ledger;
use Illuminate\Http\JsonResponse;

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
    public function store(StoreLedgerRequest $request): JsonResponse
    {
        $validated = $request->validated();

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
    public function update(UpdateLedgerRequest $request, string $id)
    {
        $ledger = Ledger::findById($id);

        $validated = $request->validated();

        $updated_ledger = (new UpdateLedger)->execute($ledger, $validated);

        return response()->json($updated_ledger, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
