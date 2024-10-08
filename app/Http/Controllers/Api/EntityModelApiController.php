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

        $entityModel = new EntityModel;
        $entityModel->ref_id = $validated['ref_id'] ?? 'ENT_'.Str::ulid();
        $entityModel->alt_id = $validated['alt_id'] ?? null;
        $entityModel->name = $validated['name'];
        $entityModel->description = $validated['description'] ?? '';
        $entityModel->save();

        return response()->json([
            'entityModel' => $entityModel,
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
