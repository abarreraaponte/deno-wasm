import { pgTable, pgEnum, varchar, char, bigint, text, boolean, index, integer, numeric, AnyPgColumn, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { balance_types } from '@/accounts/balance';
import { MetaType } from './validation';
export const  balance_type_pg_enum = pgEnum('balance_type', balance_types);

export const ledgers = pgTable('ledgers', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	description: text('description'),
	currency_id: uuid('currency_id').references(() => currencies.id).notNull(),
	active: boolean('active').default(true),
}, (table) => {
	return {
		name_idx: index().on(table.name),
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	}
});

export const ledger_relations = relations(ledgers, ({one, many}) => {
	return {
		currency: one(currencies, {fields: [ledgers.currency_id], references: [currencies.id],}),
	}
})

export const accounts = pgTable('accounts', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	balance_type: balance_type_pg_enum('balance_type'),
	ledger_id: uuid('ledger_id').references(() => ledgers.id).notNull(),
	parent_id: uuid('parent_id').references(() :AnyPgColumn => accounts.id),
	name: varchar('name', { length: 255 }).unique().notNull(),
	meta: jsonb('meta').$type<MetaType>(),
	active: boolean('active').default(true),
}, (table) => {
	return {
		balance_type_idx: index().on(table.balance_type),
		name_idx: index().on(table.name),
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	}
});

export const account_relations = relations(accounts, ({one, many}) => {
	return {
		ledger: one(ledgers, {fields: [accounts.id], references: [ledgers.id],}),
		parent: one(accounts, {fields: [accounts.id], references: [accounts.id],}),
		children: many(accounts),
	}
});

export const uom_types = pgTable('uom_types', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	name: varchar('name', { length: 255 }).unique().notNull(),
}, (table) => {
	return {
		name_idx: index().on(table.name),
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	}
});

export const uom_type_relations = relations(uom_types, ({one, many}) => {
	return {
		uoms: many(uom),
	}
});

export const uom = pgTable('uom', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	uom_type_id: uuid('uom_type_id').references(() => uom_types.id).notNull(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	plural_name: varchar('plural_name', { length: 255 }).unique().notNull(),
	symbol: varchar('symbol', { length: 20 }).unique().notNull(),
	plural_symbol: varchar('plural_symbol', { length: 20 }).unique().notNull(),
	rate: numeric('rate', { precision: 24, scale: 8 }),
	active: boolean('active').default(true),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
		name_idx: index().on(table.name),
		plural_name_idx: index().on(table.plural_name),
		symbol_idx: index().on(table.symbol),
		plural_symbol_idx: index().on(table.plural_symbol),
	}
});

export const uom_relations = relations(uom, ({one, many}) => {
	return {
		uom_type: one(uom_types, {fields: [uom.id], references: [uom_types.id],}),
	}
});

export const entity_models = pgTable('entity_models', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	name: varchar('name', { length: 255 }).unique().notNull(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
		name_idx: index().on(table.name),
	}
});

export const entity_model_relations = relations(entity_models, ({one, many}) => {
	return {
		ledgers: many(ledgers),
		entities: many(entities),
	}
});


export const entities = pgTable('entities', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	entity_model_id: uuid('entity_model_id').references(() => entity_models.id).notNull(),
	parent_id: uuid('parent_id').references(() :AnyPgColumn => entities.id),
	name: varchar('name', { length: 255 }).notNull(),
	meta: jsonb('meta').$type<MetaType>(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
		name_idx: index().on(table.name),
	}
});

export const entity_relations = relations(entities, ({one, many}) => {
	return {
		entity_model: one(entity_models, {fields: [entities.id], references: [entity_models.id],}),
		parent: one(entities, {fields: [entities.id], references: [entities.id],}),
		children: many(entities),
	}
});

export const currencies = pgTable('currencies', {
	id: uuid('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull().unique(),
	symbol: varchar('symbol', { length: 3 }).notNull(),
	iso_code: varchar('code', { length: 8 }).notNull().unique(),
	precision: integer('precision').default(0),
	active: boolean('active').default(true),
	decimal_separator: char('decimal_separator', { length: 1 }).notNull(),
	thousands_separator: char('thousands_separator', { length: 1 }).notNull(),
}, (table) => {
	return {
		iso_code_idx: index().on(table.iso_code),
		name_idx: index().on(table.name),
	}
});

export const currency_relations = relations(currencies, ({one, many}) => {
	return {
		ledgers: many(ledgers),
	}
});

export const exchange_rates = pgTable('exchange_rates', {
	id: uuid('id').primaryKey(),
	from_currency_id: uuid('from_currency_id').references(() => currencies.id).notNull(),
	to_currency_id: uuid('to_currency_id').references(() => currencies.id).notNull(),
	rate: numeric('rate', { precision: 24, scale: 8 }).notNull(),
	valid_from: bigint('valid_from', { mode: 'number' }).notNull(),
	valid_to: bigint('valid_to', { mode: 'number' }).notNull(),
}, (table) => {
	return {
		valid_from_idx: index().on(table.valid_from),
		valid_to_idx: index().on(table.valid_to),
	}
});

export const exchange_rate_relations = relations(exchange_rates, ({one, many}) => {
	return {
		from_currency: one(currencies, {fields: [exchange_rates.from_currency_id], references: [currencies.id],}),
		to_currency: one(currencies, {fields: [exchange_rates.to_currency_id], references: [currencies.id],}),
	}
});

export const transaction_models = pgTable('transaction_models', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	name: varchar('name', { length: 255 }).notNull().unique(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
		name_idx: index().on(table.name),
	}
});

export const transaction_model_relations = relations(transaction_models, ({one, many}) => {
	return {
		transactions: many(transactions),
	}
});


export const transactions = pgTable('transactions', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	transaction_model_id: uuid('transaction_model_id').references(() => transaction_models.id).notNull(),
	meta: jsonb('meta').$type<MetaType>(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	}
});

export const transaction_relations = relations(transactions, ({one, many}) => {
	return {
		transaction_model: one(transaction_models, {fields: [transactions.id], references: [transaction_models.id],}),
	}
});

export const entries = pgTable('entries', {
	id: uuid('id').primaryKey(),
	ref_id: varchar('ref_id', { length: 64 }).unique().notNull(),
	alt_id: varchar('alt_id', { length: 64 }).unique(),
	ledger_id: uuid('ledger_id').references(() => ledgers.id).notNull(),
	debit_account_id: uuid('debit_account_id').references(() => accounts.id).notNull(),
	credit_account_id: uuid('credit_account_id').references(() => accounts.id).notNull(),
	uom_id: uuid('uom_id').references(() => uom.id).notNull(),
	quantity: numeric('quantity', { precision: 64, scale: 16 }),
	amount: numeric('quantity', { precision: 64, scale: 16 }),
	transaction_id: uuid('transaction_id').references(() => transactions.id).notNull(),
}, (table) => {
	return {
		ref_id_idx: index().on(table.ref_id),
		alt_id_idx: index().on(table.alt_id),
	}
});

export const entry_relations = relations(entries, ({one, many}) => {
	return {
		transaction: one(transactions, {fields: [entries.id], references: [transactions.id],}),
	}
});