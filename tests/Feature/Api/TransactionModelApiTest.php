<?php

use App\Models\TransactionModel;
use App\Models\User;

test('transaction model can be created', function () {

    $user = User::factory()->create();
    $transactionModel = TransactionModel::factory()->make();

    $response = $this->actingAs($user)->postJson('/api/transaction-models', $transactionModel->toArray());

    $response->assertStatus(201);
});

test('Duplicate transaction model can not be created', function () {

    $user = User::factory()->create();
    $transactionModel1 = TransactionModel::factory()->create();

    $transactionModel2 = TransactionModel::factory()->make(['name' => $transactionModel1->name]);

    $response = $this->actingAs($user)->postJson('/api/transaction-models', $transactionModel2->toArray());

    $response->assertStatus(422);
});

test('transaction model can be updated', function () {

    $user = User::factory()->create();
    $transactionModel = TransactionModel::factory()->create();

    $transactionModel->name = fake()->unique()->words(2, true);

    $response = $this->actingAs($user)->putJson('/api/transaction-models/'.$transactionModel->id, $transactionModel->toArray());

    $response->assertStatus(200);
});

test('transaction model and slug can be updated', function () {

    $user = User::factory()->create();
    $transactionModel = TransactionModel::factory()->create();

    $transactionModel->name = fake()->unique()->words(2, true);
    $transactionModel->update_slug = true;

    $response = $this->actingAs($user)->putJson('/api/transaction-models/'.$transactionModel->id, $transactionModel->toArray());

    $response->assertStatus(200);
});
