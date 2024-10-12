<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreProduct;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\ProductModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductApiController extends Controller
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
    public function store(StoreProductRequest $request, string $model_route): JsonResponse
    {
        // Check the route first
        $product_model = ProductModel::where('route', $model_route)->first();

        if (! $product_model) {
            abort(404, 'Product Model not found');
        }

        $validated = $request->validated();

        $product = (new StoreProduct($product_model->id))->execute($validated);

        return response()->json($product, 201);
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
