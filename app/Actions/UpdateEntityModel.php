<?php

namespace App\Actions;

use App\Models\EntityModel;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateEntityModel
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getValidationRules(EntityModel $entity_model): array
    {
        return [
            'ref_id' => ['sometimes', 'required', 'string', 'max:64', Rule::unique('ledgers', 'ref_id')->ignore($entity_model)],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', Rule::unique('ledgers', 'alt_id')->ignore($entity_model)],
            'name' => ['sometimes', 'required', 'string', Rule::unique('ledgers', 'name')->ignore($entity_model), 'max:120'],
            'update_route' => ['sometimes', 'required', 'boolean'],
            'description' => ['sometimes', 'nullable', 'string'],
        ];
    }

    /**
     * Execute the action.
     */
    public function execute(EntityModel $entity_model, array $validated)
    {
        $entity_model->fill($validated);

        if (isset($validated['update_route']) && $validated['update_route']) {
            $entity_model->route = Str::slug($validated['name']);
        }

        $entity_model->save();

        return $entity_model;
    }
}
