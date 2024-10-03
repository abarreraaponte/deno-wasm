import { faker } from "@faker-js/faker";
import { NewCurrency } from "@/services/currencies/CurrencyManager.js";
import { v7 as uuid } from "uuid";

abstract class Factory {
	abstract make(): any;
	abstract makeMany(count: number): any[];
}

export class CurrencyFactory extends Factory {
	public make() :NewCurrency {
		return {
			"id": uuid(),
			"name": faker.finance.currencyName(),
			"symbol": faker.finance.currencySymbol(),
			"iso_code": faker.finance.currencyCode(),
			"precision": faker.number.int(8),
			"decimal_separator": ".",
			"thousands_separator": ","
		};
	}

	public makeMany(count: number) {
		return Array.from({length: count}, () => this.make());
	}
}