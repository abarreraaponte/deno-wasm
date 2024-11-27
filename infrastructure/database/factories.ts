import { faker } from '@faker-js/faker';
import { NewLedger } from '../../domain/actions/ledger_actions.ts';
import { NewAccount } from '../../domain/actions/account_actions.ts';
import { NewUnitType } from '../../domain/actions/unit_type_actions.ts';
import { NewEntityModel } from '../../domain/actions/entity_model_actions.ts';
import { NewTransactionModel } from '../../domain/actions/transaction_model_actions.ts';
import { v7 as uuid } from 'uuid';
import { balance_types, BalanceType } from '../../types/balance.ts';

abstract class Factory {
	abstract make(type?: string): any;
	abstract makeMany(count: number, type?: string): any[];
}

export class LedgerFactory extends Factory {
	public make(type?:string): NewLedger {

		// Choose to not do anything with the type argument
		type;

		return {
			'id': uuid(),
			'ref_id': uuid(),
			'alt_id': uuid(),
			'name': faker.company.name(),
			'description': faker.company.catchPhrase(),
			'active': true,
		};
	}

	public makeMany(count: number) {
		return Array.from({ length: count }, () => this.make());
	}
}

export class AccountFactory extends Factory {
	public make(type?: string): NewAccount {

		// Choose to not do anything with the type argument
		type;

		return {
			'id': uuid(),
			'ref_id': uuid(),
			'alt_id': uuid(),
			'name': faker.company.name(),
			'balance_type': balance_types[Math.floor(Math.random() * balance_types.length)] as BalanceType,
			'ledger_id': uuid(),
			'active': true,
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class UomTypeFactory extends Factory {
	public make(type?: string) :NewUnitType {
		type;

		return {
			'id': uuid(),
			'ref_id': uuid(),
			'alt_id': uuid(),
			'name': faker.science.unit().name,
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class EntityModelFactory extends Factory {
	public make(type?: string) :NewEntityModel {
		type;

		return {
			'id': uuid(),
			'ref_id': uuid(),
			'alt_id': uuid(),
			'name': faker.company.name(),
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class TransactionModelFactory extends Factory {
	public make(type?: string) :NewTransactionModel {
		type;

		return {
			'id': uuid(),
			'ref_id': uuid(),
			'alt_id': uuid(),
			'name': faker.company.name(),
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}
