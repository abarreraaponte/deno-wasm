<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEntityRequest;
use App\Models\Entity;
use App\Models\EntityModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EntityApiController extends Controller
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
    public function store(StoreEntityRequest $request, string $model_route): JsonResponse
    {
        // Check the route first
        $entity_model = EntityModel::where('route', $model_route)->first();

        if (! $entity_model) {
            abort(404, 'Entity Model not found');
        }

        $validated = $request->validated();

        $parent_entity = $request->parent_id ?

            Entity::where(function (Builder $query) use ($request) {
                $isUuid = Str::isUuid($request->parent_id);

                if ($isUuid) {
                    $query->where('id', $request->parent_id)
                        ->where('ref_id', $request->parent_id)
                        ->orWhere('alt_id', $request->parent_id);
                } else {
                    $query->where('ref_id', $request->parent_id)->orWhere('alt_id', $request->parent_id);
                }

            })->first()

        : null;

        $entity = new Entity;
        $entity->ref_id = $validated['ref_id'] ?? 'E_'.Str::ulid();
        $entity->alt_id = $validated['alt_id'] ?? null;
        $entity->name = $validated['name'];
        $entity->entity_model_id = $entity_model->id;
        $entity->parent_id = $parent_entity ? $parent_entity->id : null;
        $entity->active = $validated['active'] ?? true;

        $entity->save();

        return response()->json([
            'entity' => $entity,
            'message' => 'Entity created successfully',
        ], 201);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
