<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\CurrencySeparators;
use Illuminate\Validation\Rule;

class UpdateCurrencyRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', Rule::unique('currencies', 'name')->ignore($this->id), 'max:64'],
            'iso_code' => ['sometimes', 'required', 'string', 'max:3', Rule::unique('currencies', 'iso_code')->ignore($this->id)],
            'symbol' => ['sometimes', 'nullable', 'string', 'max:5'],
            'precision' => ['sometimes', 'required', 'integer', 'min:0', 'max:12'],
            'active' => ['sometimes', 'nullable', 'boolean'],
            'thousands_separator' => ['sometimes', 'nullable', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
            'decimal_separator' => ['sometimes', 'required', 'string', Rule::in(array_column(CurrencySeparators::cases(), 'value'))],
        ];
    }
}
