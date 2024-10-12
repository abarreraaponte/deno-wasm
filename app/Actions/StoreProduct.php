<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Support\Str;

class StoreProduct
{
    public string $product_model_id;

    /**
     * Create a new class instance.
     */
    public function __construct(string $product_model_id)
    {
        $this->product_model_id = $product_model_id;
    }

    /**
     * Execute the action.
     */
    public function execute(array $validated): Product
    {
        $product = new Product;
        $product->ref_id = $validated['ref_id'] ?? 'P_'.Str::ulid();
        $product->alt_id = $validated['alt_id'] ?? null;
        $product->name = $validated['name'];
        $product->product_model_id = $this->product_model_id;
        $product->active = $validated['active'] ?? true;

        $product->save();

        return $product;
    }
}
