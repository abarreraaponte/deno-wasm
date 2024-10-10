<?php

namespace Database\Factories;

use App\Models\ProductModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
		$product_model = ProductModel::factory()->create();

        return [
            'ref_id' => 'E_'.Str::ulid(),
            'alt_id' => 'ALT_E_'.Str::ulid(),
            'product_model_id' => $product_model->id,
            'name' => fake()->unique()->words(2, true),
            'active' => true,
        ];
    }
}
