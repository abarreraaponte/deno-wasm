<?php

use App\Models\EntityModel;
use App\Models\User;

test('entity model can be created', function () {

    $user = User::factory()->create();
    $entityModel = EntityModel::factory()->make();

    $response = $this->actingAs($user)->postJson('/api/entity-models', $entityModel->toArray());

    $response->assertStatus(201);
});

test('Duplicate entity model can not be created', function () {

    $user = User::factory()->create();
    $entityModel1 = EntityModel::factory()->create();

    $entityModel2 = EntityModel::factory()->make(['name' => $entityModel1->name]);

    $response = $this->actingAs($user)->postJson('/api/entity-models', $entityModel2->toArray());

    $response->assertStatus(422);
});
