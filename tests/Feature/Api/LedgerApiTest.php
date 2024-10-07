<?php

use App\Models\Currency;
use App\Models\Ledger;

test('ledger can be created', function () {

    $ledger = Ledger::factory()->make();

    $response = $this->postJson('/api/ledgers', $ledger->toArray());

    $response->assertStatus(201);
});

test('Duplicate ledger can not be created', function () {

    $ledger1 = Ledger::factory()->create();

    $ledger2 = Ledger::factory()->make(['name' => $ledger1->name]);

    $response = $this->postJson('/api/ledgers', $ledger2->toArray());

    $response->assertStatus(422);
});
