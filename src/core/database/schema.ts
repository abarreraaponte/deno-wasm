import { pgTable, varchar, char, bigint, text, boolean, index, integer, AnyPgColumn, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const ledgers = pgTable('ledgers', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }),
	description: text('description'),
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
	}
});

export const ledger_relations = relations(ledgers, ({one, many}) => {
	return {
		
	}
})

export const account_types = pgTable('account_types', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }),
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
	}
});

export const account_type_relations = relations(account_types, ({one, many}) => {
	return {
		accounts: many(accounts),
	}
})


export const accounts = pgTable('accounts', {
	id: varchar('id', { length: 26 }).primaryKey(),
	parent_id: varchar('parent_id', { length: 26 }).references(() :AnyPgColumn => spaces.id),
	name: varchar('name', { length: 255 }),
	meta: jsonb('meta'),
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
	}
});

export const account_relations = relations(accounts, ({one, many}) => {
	return {
		account_type: one(account_types, {fields: [accounts.id], references: [account_types.id],}),
		parent: one(accounts, {fields: [accounts.id], references: [accounts.id],}),
		children: many(accounts),
	}
})


export const resources = pgTable('resources', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }),
	meta: jsonb('meta'),
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
	}
});

export const resource_relations = relations(resources, ({one, many}) => {
	return {
		
	}
})


export const uom_types = pgTable('uom_types', {
	id: varchar('id', { length: 26}).primaryKey(),
	name: varchar('name', { length: 255 })
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
	}
});

export const uom_type_relations = relations(uom_types, ({one, many}) => {
	return {
		uoms: many(uom),
	}
})


export const uom = pgTable('uom', {
	id: varchar('id', { length: 26 }).primaryKey(),
	uom_type_id: varchar('uom_type_id', { length: 26 }).references(() => uom_types.id),
	name: varchar('name', { length: 255 }).unique(),
	plural_name: varchar('name', { length: 255 }).unique(),
	symbol: varchar('symbol', { length: 20 }).unique(),
	plural_symbol: varchar('plural_symbol', { length: 20 }).unique(),
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
		plural_name_idx: index('plural_name_idx').on(table.plural_name),
		symbol_idx: index('symbol_idx').on(table.symbol),
		plural_symbol_idx: index('plural_symbol_idx').on(table.plural_symbol),
	}
});

export const uom_relations = relations(uom, ({one, many}) => {
	return {
		uom_type: one(uom_types, {fields: [uom.id], references: [uom_types.id],}),
	}
})



export const spaces = pgTable('uom', {
	id: varchar('id', { length: 26 }).primaryKey(),
	parent_id: varchar('parent_id', { length: 26 }).references(() :AnyPgColumn => spaces.id),
	name: varchar('name', { length: 255 }),
	meta: jsonb('meta'),
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
	}
});

export const space_relations = relations(spaces, ({one, many}) => {
	return {
		parent: one(spaces, {fields: [spaces.id], references: [spaces.id],}),
		children: many(spaces),
	}
});

export const divisions = pgTable('divisions', {
	id: varchar('id', { length: 26 }).primaryKey(),
	parent_id: varchar('parent_id', { length: 26 }).references(() :AnyPgColumn => divisions.id),
	name: varchar('name', { length: 255 }),
	meta: jsonb('meta'),
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
	}
});

export const division_relations = relations(divisions, ({one, many}) => {
	return {
		parent: one(divisions, {fields: [divisions.id], references: [divisions.id],}),
		children: many(divisions),
	}
});


export const dimensions = pgTable('dimensions', {
	id: varchar('id', { length: 26 }).primaryKey(),
	parent_id: varchar('parent_id', { length: 26 }).references(() :AnyPgColumn => dimensions.id ),
	name: varchar('name', { length: 255 }),
	meta: jsonb('meta'),
}, (table) => {
	return {
		name_idx: index('name_idx').on(table.name),
	}
});

export const dimension_relations = relations(dimensions, ({one, many}) => {
	return {
		parent: one(dimensions, {fields: [dimensions.id], references: [dimensions.id],}),
		children: many(dimensions),
	}
});

export const currencies = pgTable('currencies', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }),
	symbol: varchar('symbol', { length: 20 }),
	iso_code: varchar('code', { length: 8 }),
	precision: integer('precision'),
	active: boolean('active').default(true),
	decimal_separator: char('decimal_separator', { length: 1 }),
	thousands_separator: char('thousands_separator', { length: 1 }),
}, (table) => {
	return {
		iso_code_idx: index('iso_code_idx').on(table.iso_code),
		name_idx: index('name_idx').on(table.name),
	}
});

export const currency_relations = relations(currencies, ({one, many}) => {
	return {
		
	}
});

export const exchange_rates = pgTable('exchange_rates', {
	id: varchar('id', { length: 26 }).primaryKey(),
	from_currency_id: varchar('from_currency_id', { length: 26 }).references(() => currencies.id),
	to_currency_id: varchar('to_currency_id', { length: 26 }).references(() => currencies.id),
	rate: bigint('rate', { mode: 'bigint' }),
	valid_from: bigint('valid_from', { mode: 'bigint' }),
	valid_to: bigint('valid_to', { mode: 'bigint' }),
}, (table) => {
	return {
		valid_from_idx: index('from_currency_idx').on(table.valid_from),
		valid_to_idx: index('to_currency_idx').on(table.valid_to),
	}
});

export const exchange_rate_relations = relations(exchange_rates, ({one, many}) => {
	return {
		from_currency: one(currencies, {fields: [exchange_rates.from_currency_id], references: [currencies.id],}),
		to_currency: one(currencies, {fields: [exchange_rates.to_currency_id], references: [currencies.id],}),
	}
});


export const batches = pgTable('batches', {
	id: varchar('id', { length: 26 }).primaryKey(),

}, (table) => {
	return {
		
	}
});

export const transactions = pgTable('transactions', {
	id: varchar('id', { length: 26 }).primaryKey(),
}, (table) => {
	return {
		
	}
});

export const events = pgTable('events', {
	id: varchar('id', { length: 26 }).primaryKey(),
}, (table) => {
	return {
		
	 }
});


export const entries = pgTable('entries', {
	id: varchar('id', { length: 26 }).primaryKey(),
}, (table) => {
	return {
		
	}
});