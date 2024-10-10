<?php

namespace App\Actions;

use App\Models\Entity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class StoreEntity implements ActionInterface
{
	public string $entity_model_id;

    /**
     * Create a new class instance.
     */
    public function __construct(string $entity_model_id)
	{
		$this->entity_model_id = $entity_model_id;
	}

	/**
	 * Execute the action.
	 */
	public function execute(array $validated) :Entity
	{
		$validated_class = (object) $validated;

        $parent_entity = !empty($validated_class->parent_id) ?

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
