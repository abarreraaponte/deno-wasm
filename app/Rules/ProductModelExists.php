<?php

namespace App\Rules;

use App\Models\ProductModel;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ProductModelExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = ProductModel::findById($value);

        if (! $exists) {
            $fail("Invalid product model: $value.");
        }
    }
}
