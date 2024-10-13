<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreEntityModel;
use App\Actions\UpdateEntityModel;
use App\Http\Controllers\Controller;
use App\Models\EntityModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EntityModelApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Temp: Implement authorization here.

        $creator = new StoreEntityModel;

        $validated = $request->validate($creator->getValidationRules());

        $entity_model = $creator->execute($validated);

        return response()->json($entity_model, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $entity_model_id)
    {
        $updater = new UpdateEntityModel;

        $entity_model = EntityModel::findById($entity_model_id);

        if (! $entity_model) {
            abort(404, 'EntityModel not found');
        }

        $validated = $request->validate($updater->getValidationRules($entity_model));

        $updated_entity_model = $updater->execute($entity_model, $validated);

        return response()->json($updated_entity_model, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $entity_model_id)
    {
        $entity_model = EntityModel::findById($entity_model_id);

        if (! $entity_model) {
            abort(404, 'Entity Model not found');
        }

        $check = $entity_model->canBeDeleted();

        if (! $check) {
            abort(403, 'EntityModel cannot be deleted');
        }

        $entity_model->delete();

        return response()->json(null, 204);
    }
}
