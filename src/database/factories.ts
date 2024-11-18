import { faker } from "@faker-js/faker";
import { NewCurrency } from "../services/currencies/CurrencyManager.ts";
import { NewLedger } from "../services/ledgers/LedgerManager.ts";
import { v7 as uuid } from "uuid";

abstract class Factory {
	abstract make(): any;
	abstract makeMany(count: number): any[];
}

export class CurrencyFactory extends Factory {
	public make() :NewCurrency {
		return {
			"id": uuid(),
			"name": uuid(),
			"symbol": faker.string.alphanumeric(3),
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

export class LedgerFactory extends Factory {
	public make() :NewLedger {
		return {
			"id": uuid(),
			"ref_id": uuid(),
			"alt_id": uuid(),
			"name": faker.company.name(),
			"description": faker.company.catchPhrase(),
			"currency_id": uuid(),
			"active": true
		};
	}

	public makeMany(count: number) {
		return Array.from({length: count}, () => this.make());
	}
}