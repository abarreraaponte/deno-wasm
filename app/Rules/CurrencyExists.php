<?php

namespace App\Rules;

use App\Models\Currency;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CurrencyExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $currency = Currency::findByIdOrIsoCode($value);

        if (! $currency) {
            $fail("Invalid currency: $value.");
        }
    }
}
