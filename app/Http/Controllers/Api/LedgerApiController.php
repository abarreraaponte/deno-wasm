<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLedgerRequest;
use App\Actions\StoreLedger;
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
