<?php

namespace App\Actions;

use App\Enums\CurrencySeparators;
use App\Models\Currency;
use Illuminate\Validation\Rule;

class UpdateCurrency
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getValidationRules(Currency $currency): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', Rule::unique('currencies', 'name')->ignore($currency), 'max:64'],
            'iso_code' => ['sometimes', 'required', 'string', 'max:3', Rule::unique('currencies', 'iso_code')->ignore($currency)],
            'symbol' => ['sometimes', 'nullable', 'string', 'max:5'],
            'precision' => ['sometimes', 'required', 'integer', 'min:0', 'max:12'],
            'active' => ['sometimes', 'nullable', 'boolean'],
            'thousands_separator' => ['sometimes', 'nullable', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
            'decimal_separator' => ['sometimes', 'required', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
        ];
    }

    /**
     * Execute the action.
     */
    public function execute(Currency $currency, array $data): Currency
    {
        if ($data['name']) {
            $currency->name = $data['name'];
        }

        if ($data['iso_code']) {
            $currency->iso_code = $data['iso_code'];
        }

        if ($data['symbol']) {
            $currency->symbol = $data['symbol'] ?? '';
        }

        if ($data['precision']) {
            $currency->precision = $data['precision'] ?? 2;
        }

        if ($data['active']) {
            $currency->active = $data['active'] ?? true;
        }

        if ($data['thousands_separator']) {
            $currency->thousands_separator = $data['thousands_separator'] ?? '';
        }

        if ($data['decimal_separator']) {
            $currency->decimal_separator = $data['decimal_separator'] ?? '';
        }

        $currency->save();

        return $currency;
    }
}
