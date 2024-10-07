<?php

namespace App\Http\Requests;

use App\Enums\BalanceTypes;
use App\Models\Account;
use App\Models\Ledger;
use Illuminate\Support\Str;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;
use App\Rules\AccountExists;
use App\Rules\LedgerExists;

class StoreAccountRequest extends FormRequest
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
			'ref_id' => 'required|string|max:64|unique:accounts',
			'alt_id' => 'nullable|string|max:64|unique:accounts',
			'name' => 'required|string|unique:accounts',
			'balance_type' => ['required', Rule::in(array_column(BalanceTypes::cases(), 'value'))],
			'ledger_id' => ['required', 'string', new LedgerExists],
			'parent_id' => ['sometimes', 'nullable', 'string', new AccountExists],
			'active' => ['sometimes', 'nullable', 'boolean'],
        ];
    }
}
