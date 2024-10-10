<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Currency extends Model
{
    use HasFactory, HasUuids;

    public static function findByIdOrIsoCode(string $id): Currency
    {
        return self::where(function (Builder $query) use ($id) {

            $isUuid = Str::isUuid($id);

            if ($isUuid) {
                $query->where('id', $id)->orWhere('iso_code', $id)->orWhere('name', $id);
            } else {
                $query->where('iso_code', $id)->orWhere('name', $id);
            }

        })->first();
    }

    public function ledgers(): HasMany
    {
        return $this->hasMany(Ledger::class);
    }

    public function from_exchange_rates(): HasMany
    {
        return $this->hasMany(ExchangeRate::class, 'from_currency_id');
    }

    public function to_exchange_rates(): HasMany
    {
        return $this->hasMany(ExchangeRate::class, 'to_currency_id');
    }
}
