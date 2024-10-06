<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\BalanceTypes;
use App\Models\Ledger;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
		// Generate a ledger from factory
		$ledger = Ledger::factory()->create();

        return [
            'ref_id' => fake()->unique()->uuid(),
			'alt_id' => fake()->optional()->uuid(),
			'name' => fake()->unique()->words(2, true),
			'balance_type' => fake()->randomElement(array_column(BalanceTypes::cases(), 'value')),
			'ledger_id' => $ledger->id,
			'active' => fake()->boolean(),
			'meta' => [
				'key' => 'value',
			],
        ];
    }
}
