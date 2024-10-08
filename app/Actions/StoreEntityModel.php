<?php

namespace App\Actions;

use App\Models\EntityModel;
use Illuminate\Support\Str;

class StoreEntityModel implements ActionInterface
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
	public function execute(array $validated): EntityModel
	{
		$entity_model = new EntityModel;
        $entity_model->ref_id = $validated['ref_id'] ?? 'ENT_'.Str::ulid();
        $entity_model->alt_id = $validated['alt_id'] ?? null;
        $entity_model->name = $validated['name'];
        $entity_model->description = $validated['description'] ?? '';

        $entity_model->route = Str::slug($entity_model->name);
        $entity_model->save();

		return $entity_model;
	}
}
