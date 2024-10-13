<?php

namespace App\Actions;

use App\Models\ProductModel;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateProductModel
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getValidationRules(ProductModel $product_model): array
    {
        return [
            'ref_id' => ['sometimes', 'required', 'string', 'max:64', Rule::unique('ledgers', 'ref_id')->ignore($product_model)],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', Rule::unique('ledgers', 'alt_id')->ignore($product_model)],
            'name' => ['sometimes', 'required', 'string', Rule::unique('ledgers', 'name')->ignore($product_model), 'max:120'],
            'description' => ['sometimes', 'nullable', 'string'],
        ];
    }

    /**
     * Execute the action.
     */
    public function execute(ProductModel $product_model, array $validated)
    {
        $product_model->fill($validated);

        if (isset($validated['update_slug']) && $validated['update_slug']) {
            $product_model->route = Str::slug($validated['name']);
        }

        $product_model->save();

        return $product_model;
    }
}
