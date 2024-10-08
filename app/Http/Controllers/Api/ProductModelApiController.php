<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductModelRequest;
use App\Models\ProductModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductModelApiController extends Controller
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
    public function store(StoreProductModelRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $productModel = new ProductModel;
        $productModel->ref_id = $validated['ref_id'] ?? 'PM_'.Str::ulid();
        $productModel->alt_id = $validated['alt_id'] ?? null;
        $productModel->name = $validated['name'];
        $productModel->description = $validated['description'] ?? '';
        $productModel->save();

        return response()->json([
            'productModel' => $productModel,
            'message' => 'Product Model created successfully',
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
