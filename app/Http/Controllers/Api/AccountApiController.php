<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccountRequest;
use App\Models\Account;
use App\Models\Ledger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AccountApiController extends Controller
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
    public function store(StoreAccountRequest $request)
    {
        $validated = $request->validated();

        $account = new Account;

        $ledger = Ledger::where(function (Builder $query) use ($request) {
            $isUuid = Str::isUuid($request->ledger_id);

            if ($isUuid) {
                $query->where('id', $request->ledger_id)
                    ->orWhere('ref_id', $request->ledger_id)
                    ->orWhere('alt_id', $request->ledger_id);
            }

            $query->where('ref_id', $request->ledger_id)->orWhere('alt_id', $request->ledger_id);

        })->first();

        // Get the parent account if it exists.
        $parent_account = $request->parent_id ?

            Account::where(function (Builder $query) use ($request) {
                $isUuid = Str::isUuid($request->parent_id);

                if ($isUuid) {
                    $query->where('id', $request->parent_id)
                        ->orWhere('ref_id', $request->parent_id)
                        ->orWhere('alt_id', $request->parent_id);
                }

                $query->where('ref_id', $request->parent_id)->orWhere('alt_id', $request->parent_id);

            })->first()

        : null;

        $account->ref_id = $validated['ref_id'] ?? 'ACC_'.Str::ulid();
        $account->alt_id = $validated['alt_id'] ?? null;
        $account->name = $validated['name'];
        $account->balance_type = $validated['balance_type'];
        $account->ledger_id = $ledger->id;
        $account->parent_id = $parent_account ? $parent_account->id : null;
        $account->active = $validated['active'] ?? true;

        $parent_account_overrides = [];

        // If the parent account exists, ensure that the account's ledger_id and balance_type match the parent account's.
        if ($parent_account) {
            if ($ledger->id !== $parent_account->ledger_id) {
                $account->ledger_id = $parent_account->ledger_id;
                array_push($parent_account_overrides, 'ledger_id');
            }

            if ($account->balance_type !== $parent_account->balance_type) {
                $account->balance_type = $parent_account->balance_type;
                array_push($parent_account_overrides, 'balance_type');
            }
        }

        $account->save();

        return response()->json([
            'account' => $account,
            'message' => count($parent_account_overrides) > 0 ?
                'Account created successfully. Parameters overriden by parent account: '.implode(', ', $parent_account_overrides)
                : 'Account created successfully',
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
