<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Traits\IsIdSearchable;

class Entry extends Model
{
    use HasFactory, HasUuids, IsIdSearchable;

    public function ledger(): BelongsTo
    {
        return $this->belongsTo(Ledger::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function uom(): BelongsTo
    {
        return $this->belongsTo(Uom::class);
    }

    public function debit_account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'debit_account_id');
    }

    public function credit_account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'credit_account_id');
    }
}
