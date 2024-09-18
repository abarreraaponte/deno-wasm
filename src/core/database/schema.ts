import { pgTable, varchar, char, bigint, text, boolean, index, integer, AnyPgColumn, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const ledgers = pgTable('ledgers', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	description: text('description'),
	currency_id: varchar('currency_id', { length: 26 }).references(() => currencies.id).notNull(),
	dimension_1_id: varchar('dimension_1_id', { length: 26 }).references(() => entity_models.id),
	dimension_2_id: varchar('dimension_2_id', { length: 26 }).references(() => entity_models.id),
	dimension_3_id: varchar('dimension_3_id', { length: 26 }).references(() => entity_models.id),
	dimension_4_id: varchar('dimension_4_id', { length: 26 }).references(() => entity_models.id),
	dimension_5_id: varchar('dimension_5_id', { length: 26 }).references(() => entity_models.id),
	dimension_6_id: varchar('dimension_6_id', { length: 26 }).references(() => entity_models.id),
	dimension_7_id: varchar('dimension_7_id', { length: 26 }).references(() => entity_models.id),
	dimension_8_id: varchar('dimension_8_id', { length: 26 }).references(() => entity_models.id),
	active: boolean('active').default(true),
}, (table) => {
	return {
		name_idx: index().on(table.name),
	}
});

export const ledger_relations = relations(ledgers, ({one, many}) => {
	return {
		dimension_1: one(entity_models, {fields: [ledgers.dimension_1_id], references: [entity_models.id],}),
		dimension_2: one(entity_models, {fields: [ledgers.dimension_2_id], references: [entity_models.id],}),
		dimension_3: one(entity_models, {fields: [ledgers.dimension_3_id], references: [entity_models.id],}),
		dimension_4: one(entity_models, {fields: [ledgers.dimension_4_id], references: [entity_models.id],}),
		dimension_5: one(entity_models, {fields: [ledgers.dimension_5_id], references: [entity_models.id],}),
		dimension_6: one(entity_models, {fields: [ledgers.dimension_6_id], references: [entity_models.id],}),
		dimension_7: one(entity_models, {fields: [ledgers.dimension_7_id], references: [entity_models.id],}),
		dimension_8: one(entity_models, {fields: [ledgers.dimension_8_id], references: [entity_models.id],}),
		currency: one(currencies, {fields: [ledgers.currency_id], references: [currencies.id],}),
	}
})

export const account_types = pgTable('account_types', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }).unique().notNull(),
}, (table) => {
	return {
		name_idx: index().on(table.name),
	}
});

export const account_type_relations = relations(account_types, ({one, many}) => {
	return {
		accounts: many(accounts),
	}
});

export const accounts = pgTable('accounts', {
	id: varchar('id', { length: 26 }).primaryKey(),
	parent_id: varchar('parent_id', { length: 26 }).references(() :AnyPgColumn => accounts.id),
	name: varchar('name', { length: 255 }).unique().notNull(),
	meta: jsonb('meta'),
}, (table) => {
	return {
		name_idx: index().on(table.name),
	}
});

export const account_relations = relations(accounts, ({one, many}) => {
	return {
		account_type: one(account_types, {fields: [accounts.id], references: [account_types.id],}),
		parent: one(accounts, {fields: [accounts.id], references: [accounts.id],}),
		children: many(accounts),
	}
});

export const uom_types = pgTable('uom_types', {
	id: varchar('id', { length: 26}).primaryKey(),
	name: varchar('name', { length: 255 }).unique().notNull(),
}, (table) => {
	return {
		name_idx: index().on(table.name),
	}
});

export const uom_type_relations = relations(uom_types, ({one, many}) => {
	return {
		uoms: many(uom),
	}
});

export const uom = pgTable('uom', {
	id: varchar('id', { length: 26 }).primaryKey(),
	uom_type_id: varchar('uom_type_id', { length: 26 }).references(() => uom_types.id).notNull(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	plural_name: varchar('plural_name', { length: 255 }).unique().notNull(),
	symbol: varchar('symbol', { length: 20 }).unique().notNull(),
	plural_symbol: varchar('plural_symbol', { length: 20 }).unique().notNull(),
}, (table) => {
	return {
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
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }).unique().notNull(),
}, (table) => {
	return {
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
	id: varchar('id', { length: 26 }).primaryKey(),
	entity_model_id: varchar('entity_model_id', { length: 26 }).references(() => entity_models.id).notNull(),
	parent_id: varchar('parent_id', { length: 26 }).references(() :AnyPgColumn => entities.id),
	name: varchar('name', { length: 255 }).notNull(),
	meta: jsonb('meta'),
}, (table) => {
	return {
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
	id: varchar('id', { length: 26 }).primaryKey(),
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
	id: varchar('id', { length: 26 }).primaryKey(),
	from_currency_id: varchar('from_currency_id', { length: 26 }).references(() => currencies.id).notNull(),
	to_currency_id: varchar('to_currency_id', { length: 26 }).references(() => currencies.id).notNull(),
	rate: bigint('rate', { mode: 'number' }).default(1),
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
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull().unique(),
}, (table) => {
	return {
		name_idx: index().on(table.name),
	}
});

export const transaction_model_relations = relations(transaction_models, ({one, many}) => {
	return {
		transactions: many(transactions),
	}
});


export const transactions = pgTable('transactions', {
	id: varchar('id', { length: 26 }).primaryKey(),
	transaction_model_id: varchar('transaction_model_id', { length: 26 }).references(() => transaction_models.id).notNull(),
	meta: jsonb('meta'),
}, (table) => {
	return {
		
	}
});

export const transaction_relations = relations(transactions, ({one, many}) => {
	return {
		transaction_model: one(transaction_models, {fields: [transactions.id], references: [transaction_models.id],}),
	}
});

export const entries = pgTable('entries', {
	id: varchar('id', { length: 26 }).primaryKey(),
	transaction_id: varchar('transaction_id', { length: 26 }).references(() => transactions.id).notNull(),
}, (table) => {
	return {
		
	}
});

export const entry_relations = relations(entries, ({one, many}) => {
	return {
		transaction: one(transactions, {fields: [entries.id], references: [transactions.id],}),
	}
});