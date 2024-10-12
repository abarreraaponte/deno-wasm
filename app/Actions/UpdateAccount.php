<?php

namespace App\Actions;

use App\Models\Account;
use Illuminate\Validation\Rule;

class UpdateAccount
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getValidationRules(Account $account)
    {
        return [
            'ref_id' => ['sometimes', 'required', 'string', 'max:64', Rule::unique('accounts', 'ref_id')->ignore($account)],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', Rule::unique('accounts', 'alt_id')->ignore($account)],
            'name' => ['sometimes', 'required', 'string', Rule::unique('accounts', 'name')->ignore($account), 'max:120'],
            'active' => ['sometimes', 'nullable', 'boolean'],
        ];
    }

    /**
     * Execute the action.
     */
    public function execute(Account $account, array $data): Account
    {
        $account->update($data);

        return $account;
    }
}
