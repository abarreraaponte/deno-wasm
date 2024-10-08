<?php

namespace App\Http\Requests;

use App\Enums\CurrencySeparators;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'name' => ['required', 'string', 'unique:currencies,name', 'max:64'],
            'iso_code' => ['required', 'string', 'max:3', 'unique:currencies,iso_code'],
            'symbol' => ['nullable', 'string', 'max:5'],
            'precision' => ['required', 'integer', 'min:0', 'max:12'],
            'active' => ['sometimes', 'nullable', 'boolean'],
            'thousands_separator' => ['sometimes', 'nullable', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
            'decimal_separator' => ['sometimes', 'nullable', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
        ];
    }
}
