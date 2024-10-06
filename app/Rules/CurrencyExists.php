<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Currency;

class CurrencyExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $currency = Currency::where(function (Builder $query) use ($value) {

			$isUuid = Str::isUuid($value);

			if ($isUuid) {
				$query->where('id', $value)->orWhere('iso_code', $value)->orWhere('name', $value);
			}

			$query->where('iso_code', $value)->orWhere('name', $value);
			
		})->first();

		if (!$currency) {
			$fail("Invalid currency: $value.");
		}
    }
}
