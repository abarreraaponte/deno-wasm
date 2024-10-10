<?php

namespace App\Rules;

use App\Models\EntityModel;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class EntityModelExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = EntityModel::findById($value);

        if (! $exists) {
            $fail("Invalid entity model: $value.");
        }
    }
}
