<?php

namespace App\Actions;

use App\Enums\CurrencySeparators;
use App\Models\Currency;
use Illuminate\Validation\Rule;

class StoreCurrency
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getValidationRules(): array
    {
        return [
            'name' => ['required', 'string', 'unique:currencies,name', 'max:64'],
            'iso_code' => ['required', 'string', 'max:3', 'unique:currencies,iso_code'],
            'symbol' => ['nullable', 'string', 'max:5'],
            'precision' => ['required', 'integer', 'min:0', 'max:12'],
            'active' => ['sometimes', 'nullable', 'boolean'],
            'thousands_separator' => ['sometimes', 'nullable', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
            'decimal_separator' => ['required', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
        ];
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
