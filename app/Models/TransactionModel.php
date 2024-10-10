<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Traits\IsIdSearchable;

class TransactionModel extends Model
{
    use HasFactory, HasUuids, IsIdSearchable;

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
