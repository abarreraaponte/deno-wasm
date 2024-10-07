<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory, HasUuids;

    public function model(): BelongsTo
    {
        return $this->belongsTo(TransactionModel::class, 'transaction_model_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(Entry::class);
    }
}
