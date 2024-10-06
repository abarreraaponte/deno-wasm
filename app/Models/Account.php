<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use HasFactory, HasUuids;

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
