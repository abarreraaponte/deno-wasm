<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreCurrency;
use App\Actions\UpdateCurrency;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCurrencyRequest;
use App\Http\Requests\UpdateCurrencyRequest;
use App\Models\Currency;
use Illuminate\Http\JsonResponse;

class CurrencyApiController extends Controller
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
    public function store(StoreCurrencyRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $currency = (new StoreCurrency)->execute($validated);

        return response()->json($currency, 201);
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
    public function update(UpdateCurrencyRequest $request, string $id)
    {
        $currency = Currency::findByIdOrIsoCode($id);

        $validated = $request->validated();

        $updated_currency = (new UpdateCurrency)->execute($currency, $validated);

        return response()->json($updated_currency, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
