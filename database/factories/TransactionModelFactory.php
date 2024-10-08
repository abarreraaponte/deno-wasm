<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransactionModel>
 */
class TransactionModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ref_id' => 'TM_'.Str::ulid(),
            'alt_id' => 'ALT_TM_'.Str::ulid(),
            'name' => fake()->unique()->words(2, true),
            'route' => Str::ulid(),
        ];
    }
}
