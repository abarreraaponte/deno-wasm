<?php

namespace App\Rules;

use App\Models\TransactionModel;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class TransactionModelExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = TransactionModel::findById($value);

        if (! $exists) {
            $fail("Invalid transaction model: $value.");
        }
    }
}
