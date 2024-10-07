<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCurrencyRequest;
use Illuminate\Http\Request;
use App\Models\Currency;

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
    public function store(StoreCurrencyRequest $request)
    {
        $validated = $request->validated();

		$currency = new Currency;
        $currency->name = $validated['name'];
        $currency->iso_code = $validated['iso_code'];
        $currency->symbol = $validated['symbol'] ?? '';
        $currency->precision = $validated['precision'] ?? 2;
        $currency->active = $validated['active'] ?? true;
        $currency->thousands_separator = $validated['thousands_separator'] ?? '';
        $currency->decimal_separator = $validated['decimal_separator'] ?? '';
        $currency->save();

        return $currency;

        return response()->json([
			'currency' => $currency,
			'message' => 'Currency created successfully'
		], 201);
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
