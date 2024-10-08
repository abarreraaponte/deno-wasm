<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEntityModelRequest extends FormRequest
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
            'ref_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:entity_models,ref_id'],
            'alt_id' => ['sometimes', 'nullable', 'string', 'max:64', 'unique:entity_models,alt_id'],
            'name' => ['required', 'string', 'unique:entity_models,name', 'max:120'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
