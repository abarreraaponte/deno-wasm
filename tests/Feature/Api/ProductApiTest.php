<?php

use App\Models\Product;
use App\Models\ProductModel;
use App\Models\User;

test('product can be create', function () {

	$user = User::factory()->create();
	$product_model = ProductModel::factory()->create();
	$product = Product::factory()->make(['product_model_id' => $product_model->id]);

	$response = $this->actingAs($user)->postJson("/api/products/$product_model->route", $product->toArray());

	$response->assertStatus(201);
});

test('Duplicate product can not be created', function () {

	$user = User::factory()->create();
	$product_model = ProductModel::factory()->create();

	$product1 = Product::factory()->create(['product_model_id' => $product_model->id]);

	$product2 = Product::factory()->make(['product_model_id' => $product_model->id, 'name' => $product1->name]);

	$response = $this->actingAs($user)->postJson("/api/products/$product_model->route", $product2->toArray());

	$response->assertStatus(422);
});

test('Product with parent product can be created', function () {

	$user = User::factory()->create();
	$product_model = ProductModel::factory()->create();
	$parent_product = Product::factory()->create(['product_model_id' => $product_model->id]);

	$product = Product::factory()->make(['product_model_id' => $product_model->id, 'parent_id' => $parent_product->id]);

	$response = $this->actingAs($user)->postJson("/api/products/$product_model->route", $product->toArray());

	$response->assertStatus(201);
});