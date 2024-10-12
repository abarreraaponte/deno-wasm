<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreAccount;
use App\Actions\UpdateAccount;
use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Temp: Implement authorization here.

        $creator = new StoreAccount;

        $validated = $request->validate($creator->getValidationRules());

        $account = $creator->execute($validated);

        return response()->json($account, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $account_id)
    {
        // Temp: Implement authorization here

        $account = Account::findById($account_id);

        if (! $account) {
            abort(404, 'Account not found');
        }

        return response()->json($account);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $account_id)
    {
        // Temp: Implement authorization here

        $updater = new UpdateAccount;

        $account = Account::findById($account_id);

        if (! $account) {
            abort(404, 'Account not found');
        }

        $validated = $request->validate($updater->getValidationRules($account));

        $updated_account = $updater->execute($account, $validated);

        return response()->json($updated_account, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $account_id)
    {
        $account = Account::findById($account_id);

        if (! $account) {
            abort(404, 'Account not found');
        }

        $check = $account->canBeDeleted();

        if (! $check) {
            abort(400, 'Account cannot be deleted');
        }

        $account->delete();

        return response()->json([], 200);
    }
}
