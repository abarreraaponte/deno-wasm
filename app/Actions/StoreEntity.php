<?php

namespace App\Actions;

use App\Models\Entity;
use Illuminate\Support\Str;
use App\Rules\EntityExists;

class StoreEntity
{
    public string $entity_model_id;

    /**
     * Create a new class instance.
     */
    public function __construct(string $entity_model_id)
    {
        $this->entity_model_id = $entity_model_id;
    }

	public function getValidationRules(): array
	{
		return [
            'ref_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:entity_models,ref_id'],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:entity_models,alt_id'],
            'parent_id' => ['sometimes', 'nullable', 'string', new EntityExists],
            'name' => ['required', 'string', 'unique:entities,name', 'max:120'],
            'active' => ['sometimes', 'nullable', 'boolean'],
        ];
	}

    /**
     * Execute the action.
     */
    public function execute(array $validated): Entity
    {
        $validated_class = (object) $validated;

        $parent_entity = ! empty($validated_class->parent_id) ?

            Entity::findById($validated_class->parent_id)

        : null;

        $entity = new Entity;
        $entity->ref_id = $validated['ref_id'] ?? 'E_'.Str::ulid();
        $entity->alt_id = $validated['alt_id'] ?? null;
        $entity->name = $validated['name'];
        $entity->entity_model_id = $this->entity_model_id;
        $entity->parent_id = $parent_entity ? $parent_entity->id : null;
        $entity->active = $validated['active'] ?? true;

        $entity->save();

        return $entity;
    }
}
