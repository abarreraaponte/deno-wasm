<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEntityModelRequest;
use App\Models\EntityModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
    public function store(StoreEntityModelRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $entity_model = new EntityModel;
        $entity_model->ref_id = $validated['ref_id'] ?? 'ENT_'.Str::ulid();
        $entity_model->alt_id = $validated['alt_id'] ?? null;
        $entity_model->name = $validated['name'];
        $entity_model->description = $validated['description'] ?? '';

        $entity_model->route = Str::slug($entity_model->name);
        $entity_model->save();

        return response()->json([
            'entityModel' => $entity_model,
            'message' => 'Entity Model created successfully',
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
