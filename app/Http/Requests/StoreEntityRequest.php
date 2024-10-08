<?php

namespace App\Http\Requests;

use App\Rules\EntityExists;
use Illuminate\Foundation\Http\FormRequest;

class StoreEntityRequest extends FormRequest
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
            'parent_id' => ['sometimes', 'nullable', 'string', new EntityExists],
            'name' => ['required', 'string', 'unique:entities,name', 'max:120'],
            'active' => ['sometimes', 'nullable', 'boolean'],
        ];
    }
}
