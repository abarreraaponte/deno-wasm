<?php

namespace App\Models;

use App\Models\Contracts\DeletionProtected;
use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransactionModel extends Model implements DeletionProtected
{
    use HasFactory, HasUuids, IsIdSearchable;

    protected $fillable = [
        'ref_id',
        'alt_id',
        'name',
        'description',
    ];

    public function canBeDeleted(): bool
    {
        // For now allow deletion.
        return true;
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
