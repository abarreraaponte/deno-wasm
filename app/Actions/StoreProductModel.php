<?php

namespace App\Actions;

use App\Models\ProductModel;
use Illuminate\Support\Str;

class StoreProductModel
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
	
	/**
	 * Execute the action.
	 */
	public function execute(array $validated): ProductModel
	{
		$product_model = new ProductModel;
        $product_model->ref_id = $validated['ref_id'] ?? 'PM_'.Str::ulid();
        $product_model->alt_id = $validated['alt_id'] ?? null;
        $product_model->name = $validated['name'];
        $product_model->description = $validated['description'] ?? '';

        $product_model->route = Str::slug($product_model->name);
        $product_model->save();

		return $product_model;
	}
}
