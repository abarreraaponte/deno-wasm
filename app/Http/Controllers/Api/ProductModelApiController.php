<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreProductModel;
use App\Actions\UpdateProductModel;
use App\Http\Controllers\Controller;
use App\Models\ProductModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
    public function store(Request $request): JsonResponse
    {
        // Temp: Implement authorization here.

        $creator = new StoreProductModel;

        $validated = $request->validate($creator->getValidationRules());

        $product_model = $creator->execute($validated);

        return response()->json($product_model, 201);
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
    public function update(Request $request, string $product_model_id)
    {
        $updater = new UpdateProductModel;

        $product_model = ProductModel::findById($product_model_id);

        if (! $product_model) {
            abort(404, 'ProductModel not found');
        }

        $validated = $request->validate($updater->getValidationRules($product_model));

        $updated_product_model = $updater->execute($product_model, $validated);

        return response()->json($updated_product_model, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $product_model_id)
    {
        $product_model = ProductModel::findById($product_model_id);

        if (! $product_model) {
            abort(404, 'Product Model not found');
        }

        $check = $product_model->canBeDeleted();

        if (! $check) {
            abort(403, 'ProductModel cannot be deleted');
        }

        $product_model->delete();

        return response()->json(null, 204);
    }
}
