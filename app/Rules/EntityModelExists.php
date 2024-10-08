<?php

namespace App\Rules;

use App\Models\EntityModel;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class EntityModelExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $entity_model = EntityModel::where(function (Builder $query) use ($value) {

            $isUuid = Str::isUuid($value);

            if ($isUuid) {
                $query->where('id', $value)
                    ->orWhere('ref_id', $value)
                    ->orWhere('alt_id', $value);
            } else {
                $query->where('ref_id', $value)->orWhere('alt_id', $value);
            }

        })
            ->where('active', true)
            ->first();

        if (! $entity_model) {
            $fail("Invalid entity model: $value.");
        }
    }
}
