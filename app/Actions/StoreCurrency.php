<?php

namespace App\Actions;

use App\Models\Currency;

class StoreCurrency
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the action.
     */
    public function execute(array $data): Currency
    {
        $currency = new Currency;
        $currency->name = $data['name'];
        $currency->iso_code = $data['iso_code'];
        $currency->symbol = $data['symbol'] ?? '';
        $currency->precision = $data['precision'] ?? 2;
        $currency->active = $data['active'] ?? true;
        $currency->thousands_separator = $data['thousands_separator'] ?? '';
        $currency->decimal_separator = $data['decimal_separator'] ?? '';
        $currency->save();

        return $currency;
    }
}
