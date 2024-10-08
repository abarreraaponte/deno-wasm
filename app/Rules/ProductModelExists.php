<?php

namespace App\Rules;

use App\Models\ProductModel;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class ProductModelExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $product_model = ProductModel::where(function (Builder $query) use ($value) {
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

        if (! $product_model) {
            $fail("Invalid product model: $value.");
        }
    }
}
