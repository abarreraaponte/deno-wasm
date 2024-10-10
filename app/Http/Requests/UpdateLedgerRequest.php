<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLedgerRequest extends FormRequest
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
            'ref_id' => ['sometimes', 'required', 'string', 'max:64', Rule::unique('ledgers', 'ref_id')->ignore($this->id)],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', Rule::unique('ledgers', 'alt_id')->ignore($this->id)],
            'name' => ['sometimes', 'required', 'string', Rule::unique('ledgers', 'name')->ignore($this->id), 'max:120'],
            'description' => ['sometimes', 'nullable', 'string'],
            'currency_id' => ['missing'],
            'active' => ['sometimes', 'nullable', 'boolean'],
        ];
    }
}
