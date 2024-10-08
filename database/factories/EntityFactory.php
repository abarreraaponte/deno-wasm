<?php

namespace Database\Factories;

use App\Models\EntityModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Entity>
 */
class EntityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $entity_model = EntityModel::factory()->create();

        return [
            'ref_id' => 'E_'.Str::ulid(),
            'alt_id' => 'ALT_E_'.Str::ulid(),
            'entity_model_id' => $entity_model->id,
            'name' => fake()->unique()->words(2, true),
            'active' => true,
        ];
    }
}
