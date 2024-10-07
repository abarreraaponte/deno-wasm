<?php

namespace Database\Factories;

use App\Enums\CurrencySeparators;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Currency>
 */
class CurrencyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'iso_code' => fake()->unique()->regexify('[A-Z]{3}'),
            'symbol' => fake()->optional()->regexify('[A-Z]{3}'),
            'precision' => fake()->numberBetween(0, 12),
            'active' => fake()->boolean(),
            'thousands_separator' => fake()->randomElement(array_column(CurrencySeparators::cases(), 'value')),
            'decimal_separator' => fake()->randomElement(array_column(CurrencySeparators::cases(), 'value')),
        ];
    }
}
