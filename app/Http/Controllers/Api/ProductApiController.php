<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreProduct;
use App\Http\Controllers\Controller;
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
    public function store(Request $request, string $model_route): JsonResponse
    {
        // Temp: Implement authorization here.

        $product_model = ProductModel::where('route', $model_route)->first();

        if (! $product_model) {
            abort(404, 'Product Model not found');
        }

        $creator = new StoreProduct($product_model->id);

        $validated = $request->validate($creator->getValidationRules());

        $product = $creator->execute($validated);

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
