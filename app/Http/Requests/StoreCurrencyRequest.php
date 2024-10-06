<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\CurrencySeparators;
use App\Models\Currency;

class StoreCurrencyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TEMPORARY: Allow all requests
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'unique:currencies,name'],
			'iso_code' => ['required', 'string', 'max:3', 'unique:currencies,iso_code'],
			'symbol' => ['nullable', 'string', 'max:5'],
			'precision' => ['required', 'integer', 'min:0', 'max:12'],
			'active' => ['sometimes', 'nullable', 'boolean'],
			'thousands_separator' => ['sometimes', 'nullable', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
			'decimal_separator' => ['sometimes', 'nullable', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
        ];
    }

	public function action() :Currency
	{
		$currency = new Currency();
		$currency->name = $this->name;
		$currency->iso_code = $this->iso_code;
		$currency->symbol = $this->symbol;
		$currency->precision = $this->precision ?? 2;
		$currency->active = $this->active ?? true;
		$currency->thousands_separator = $this->thousands_separator ?? '';
		$currency->decimal_separator = $this->decimal_separator ?? '';
		$currency->save();

		return $currency;
	}
}
