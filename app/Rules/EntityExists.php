<?php

namespace App\Rules;

use App\Models\Entity;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class EntityExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = Entity::findById($value);

        if (! $exists) {
            $fail("Invalid entity: $value.");
        }
    }
}
