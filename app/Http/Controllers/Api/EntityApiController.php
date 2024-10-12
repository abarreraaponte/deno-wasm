<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreEntity;
use App\Http\Controllers\Controller;
use App\Models\EntityModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
    public function store(Request $request, string $model_route): JsonResponse
    {
        // Temp: Implement authorization here.

        // Check the route first
        $entity_model = EntityModel::where('route', $model_route)->first();

        if (! $entity_model) {
            abort(404, 'Entity Model not found');
        }

        $creator = new StoreEntity($entity_model);

        $validated = $request->validated();

        $entity = $creator->execute($validated);

        return response()->json($entity, 201);
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
