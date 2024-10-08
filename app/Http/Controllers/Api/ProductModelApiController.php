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

        $product_model = new ProductModel;
        $product_model->ref_id = $validated['ref_id'] ?? 'PM_'.Str::ulid();
        $product_model->alt_id = $validated['alt_id'] ?? null;
        $product_model->name = $validated['name'];
        $product_model->description = $validated['description'] ?? '';

        $product_model->route = Str::slug($product_model->name);
        $product_model->save();

        return response()->json([
            'productModel' => $product_model,
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
