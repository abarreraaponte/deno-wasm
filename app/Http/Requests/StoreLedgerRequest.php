<?php

namespace App\Http\Requests;

use App\Rules\CurrencyExists;
use Illuminate\Foundation\Http\FormRequest;

class StoreLedgerRequest extends FormRequest
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
            'ref_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:ledgers,ref_id'],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:ledgers,alt_id'],
            'name' => ['required', 'string', 'unique:ledgers,name'],
            'description' => ['nullable', 'string'],
            'currency_id' => ['required', 'string', new CurrencyExists],
            'active' => ['sometimes', 'nullable', 'boolean'],
        ];
    }
}
