<?php

namespace App\Rules;

use App\Models\Ledger;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class LedgerExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = Ledger::findById($value);

        if (! $exists) {
            $fail("Invalid ledger: $value.");
        }
    }
}
