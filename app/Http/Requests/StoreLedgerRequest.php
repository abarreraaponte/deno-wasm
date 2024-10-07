<?php

namespace App\Http\Requests;

use App\Models\Currency;
use App\Models\Ledger;
use App\Rules\CurrencyExists;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

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
            'active' => ['boolean'],
        ];
    }

    public function action(): Ledger
    {
        $currency = Currency::where(function (Builder $query) {

            $isUuid = Str::isUuid($this->currency_id);

            if ($isUuid) {
                $query->where('id', $this->currency_id)->orWhere('iso_code', $this->currency_id)->orWhere('name', $this->currency_id);
            }

            $query->where('iso_code', $this->currency_id)->orWhere('name', $this->currency_id);

        })->first();

        $ledger = new Ledger;
        $ledger->ref_id = $this->ref_id ?? 'LED_'.Str::ulid();
        $ledger->alt_id = $this->alt_id ?? null;
        $ledger->name = $this->name;
        $ledger->description = $this->description ?? null;
        $ledger->currency_id = $currency->id;
        $ledger->active = $this->active ?? true;
        $ledger->save();

        return $ledger;
    }
}
