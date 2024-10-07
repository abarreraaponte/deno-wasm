<?php

use App\Models\Currency;
use App\Models\Ledger;

test('ledger can be created', function () {

    $currency = Currency::factory()->create();

    $ledger = Ledger::factory()->make(['currency_id' => $currency->id]);

    $response = $this->postJson('/api/ledgers', $ledger->toArray());

    $response->assertStatus(201);
});

test('Duplicate ledger can not be created', function () {
    $currency = Currency::factory()->create();

    $ledger1 = Ledger::factory()->create(['currency_id' => $currency->id]);

    $ledger2 = Ledger::factory()->make(['currency_id' => $currency->id, 'name' => $ledger1->name]);

    $response = $this->postJson('/api/ledgers', $ledger2->toArray());

    $response->assertStatus(422);
});
