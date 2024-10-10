<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreAccount;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccountRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(['message' => 'Hello World']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAccountRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $account = (new StoreAccount)->execute($validated);

        return response()->json($account, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
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
