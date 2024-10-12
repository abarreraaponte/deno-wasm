<?php

namespace App\Models;

use App\Models\Contracts\DeletionProtected;
use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model implements DeletionProtected
{
    use HasFactory, HasUuids, IsIdSearchable;

    protected $casts = [
        'meta' => 'array',
    ];

    protected $fillable = [
        'ref_id',
        'alt_id',
        'name',
        'active',
    ];

    public function canBeDeleted(): bool
    {
        // For now allow deletion.
        return true;
    }

    public function ledger(): BelongsTo
    {
        return $this->belongsTo(Ledger::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    public function debiting_entries(): HasMany
    {
        return $this->hasMany(Entry::class, 'debit_account_id');
    }

    public function crediting_entries(): HasMany
    {
        return $this->hasMany(Entry::class, 'credit_account_id');
    }
}
