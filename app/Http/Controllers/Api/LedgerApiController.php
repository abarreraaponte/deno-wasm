<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLedgerRequest;
use App\Models\Currency;
use App\Models\Ledger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
    public function store(StoreLedgerRequest $request)
    {
        $validated = $request->validated();

        $currency = Currency::where(function (Builder $query) use ($request) {

            $isUuid = Str::isUuid($request->currency_id);

            if ($isUuid) {
                $query->where('id', $request->currency_id)->orWhere('iso_code', $request->currency_id)->orWhere('name', $request->currency_id);
            }

            $query->where('iso_code', $request->currency_id)->orWhere('name', $request->currency_id);

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

        return response()->json([
            'ledger' => $ledger,
            'message' => 'Ledger created successfully',
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
