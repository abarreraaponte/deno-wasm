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
    public function execute(Currency $currency, array $validated): Currency
    {
        $currency->update($validated);

        return $currency;
    }
}
