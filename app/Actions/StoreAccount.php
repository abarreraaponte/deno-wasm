<?php

namespace App\Actions;

use App\Models\Account;
use App\Models\Ledger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class StoreAccount implements ActionInterface
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
    public function execute(array $data): Account
    {
        $data_class = (object) $data;

        $account = new Account;

        $ledger = Ledger::where(function (Builder $query) use ($data_class) {
            $isUuid = Str::isUuid($data_class->ledger_id);

            if ($isUuid) {
                $query->where('id', $data_class->ledger_id)
                    ->orWhere('ref_id', $data_class->ledger_id)
                    ->orWhere('alt_id', $data_class->ledger_id);
            } else {
                $query->where('ref_id', $data_class->ledger_id)->orWhere('alt_id', $data_class->ledger_id);
            }

        })->first();

        // Get the parent account if it exists.
        $parent_account = !empty($data_class->parent_id) ?

            Account::where(function (Builder $query) use ($data_class) {
                $isUuid = Str::isUuid($data_class->parent_id);

                if ($isUuid) {
                    $query->where('id', $data_class->parent_id)
                        ->orWhere('ref_id', $data_class->parent_id)
                        ->orWhere('alt_id', $data_class->parent_id);
                } else {
                    $query->where('ref_id', $data_class->parent_id)->orWhere('alt_id', $data_class->parent_id);
                }

            })->first()

        : null;

        $account->ref_id = $data['ref_id'] ?? 'ACC_'.Str::ulid();
        $account->alt_id = $data['alt_id'] ?? null;
        $account->name = $data['name'];
        $account->balance_type = $data['balance_type'];
        $account->ledger_id = $ledger->id;
        $account->parent_id = $parent_account ? $parent_account->id : null;
        $account->active = $data['active'] ?? true;

        // If the parent account exists, ensure that the account's ledger_id and balance_type match the parent account's.
        if ($parent_account) {
            if ($ledger->id !== $parent_account->ledger_id) {
                $account->ledger_id = $parent_account->ledger_id;
            }

            if ($account->balance_type !== $parent_account->balance_type) {
                $account->balance_type = $parent_account->balance_type;
            }
        }

        $account->save();

        return $account;
    }
}
