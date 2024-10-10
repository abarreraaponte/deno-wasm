<?php

use App\Models\Ledger;
use App\Models\User;

test('ledger can be created', function () {

    $user = User::factory()->create();
    $ledger = Ledger::factory()->make();

    $response = $this->actingAs($user)->postJson('/api/ledgers', $ledger->toArray());

    $response->assertStatus(201);
});

test('Duplicate ledger can not be created', function () {

    $user = User::factory()->create();
    $ledger1 = Ledger::factory()->create();

    $ledger2 = Ledger::factory()->make(['name' => $ledger1->name]);

    $response = $this->actingAs($user)->postJson('/api/ledgers', $ledger2->toArray());

    $response->assertStatus(422);
});

test('Update an existing ledger', function () {
    $user = User::factory()->create();
    $ledger = Ledger::factory()->create();

    $ledger->name = fake()->unique()->name;

    // Remove the currency_id from the ledger object.
    unset($ledger->currency_id);

    $response = $this->actingAs($user)->putJson('/api/ledgers/'.$ledger->id, $ledger->toArray());

    $response->assertStatus(200);
});
