import { faker } from "@faker-js/faker";
import { BalanceType, Account, EntityModel, Ledger, TransactionModel, UnitType } from "./types.js";
import { v7 as uuid } from "uuid";

abstract class Factory {
	abstract make(type?: string): Ledger.New | Account.New | UnitType.New | EntityModel.New | TransactionModel.New;
	abstract makeMany(
		count: number,
		type?: string,
	): Ledger.New[] | Account.New[] | UnitType.New[] | EntityModel.New[] | TransactionModel.New[];
}

export class LedgerFactory extends Factory {
	public make(type?: string): Ledger.Model {
		// Choose to not do anything with the type argument
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.company.name(),
			description: faker.company.catchPhrase(),
			unit_type_id: uuid(),
			active: true,
		};
	}

	public makeMany(count: number) {
		return Array.from({ length: count }, () => this.make());
	}
}

export class AccountFactory extends Factory {
	public make(type?: string): Account.Model {
		// Choose to not do anything with the type argument
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.company.name(),
			balance_type: [BalanceType.DEBIT, BalanceType.CREDIT][Math.floor(Math.random() * 2)],
			ledger_id: uuid(),
			active: true,
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class UnitTypeFactory extends Factory {
	public make(type?: string): UnitType.Model {
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.word.words(2),
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class EntityModelFactory extends Factory {
	public make(type?: string): EntityModel.Model {
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.company.name(),
			active: true,
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class TransactionModelFactory extends Factory {
	public make(type?: string): TransactionModel.Model {
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.company.name(),
			active: true,
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}
