<?php 

use App\Models\Currency;

use Illuminate\Support\Facades\Log;


test('currency can be created', function () {

	$currency = Currency::factory()->make();

	Log::info($currency->toArray());
	
	$response = $this->postJson('/api/currencies', $currency->toArray());

	$response->assertStatus(201);
});

test('Duplicate currency can not be created', function () {
	$currency1 = Currency::factory()->create();

	$currency2 = Currency::factory()->make(['name' => $currency1->name, 'iso_code' => $currency1->iso_code]);

	$response = $this->postJson('/api/currencies', $currency2->toArray());

	$response->assertStatus(422);
});