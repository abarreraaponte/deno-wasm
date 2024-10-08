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
