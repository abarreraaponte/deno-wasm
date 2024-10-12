<?php

namespace App\Models;

use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ledger extends Model
{
    use HasFactory, HasUuids, IsIdSearchable;

    protected $fillable = ['ref_id', 'alt_id', 'name', 'description', 'active'];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(Entry::class);
    }
}
