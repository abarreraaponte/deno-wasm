<?php

namespace App\Actions;
use App\Models\Currency;

class UpdateCurrency
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

	/**
	 * Execute the action.
	 */
	public function execute(Currency $currency, array $data): Currency
	{
		if($data['name'])
		{
			$currency->name = $data['name'];
		}

		if($data['iso_code'])
		{
			$currency->iso_code = $data['iso_code'];
		}

		if($data['symbol'])
		{
			$currency->symbol = $data['symbol'] ?? '';
		}

		if($data['precision'])
		{
			$currency->precision = $data['precision'] ?? 2;
		}

		if($data['active'])
		{
			$currency->active = $data['active'] ?? true;
		}

		if($data['thousands_separator'])
		{
			$currency->thousands_separator = $data['thousands_separator'] ?? '';
		}

		if($data['decimal_separator'])
		{
			$currency->decimal_separator = $data['decimal_separator'] ?? '';
		}

        $currency->save();

		return $currency;
	}
}
