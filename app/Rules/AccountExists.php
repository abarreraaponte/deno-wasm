<?php

namespace App\Rules;

use App\Models\Account;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AccountExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = Account::findById($value);

        if (! $exists) {
            $fail("Invalid account: $value.");
        }
    }
}
