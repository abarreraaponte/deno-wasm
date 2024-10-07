<?php

namespace Database\Factories;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ledger>
 */
class LedgerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a currency from factory
        $currency = Currency::factory()->create();

        return [
            'ref_id' => fake()->unique()->uuid(),
            'alt_id' => fake()->optional()->uuid(),
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->optional()->sentence(),
            'currency_id' => $currency->id,
            'active' => fake()->boolean(),
        ];
    }
}
