import { pgTable, varchar, char, bigint, text, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: varchar('id', { length: 26 }).primaryKey(),
	first_name: varchar('first_name', { length: 255 }).notNull(),
	last_name: varchar('last_name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).unique().notNull(),
}, (table) => {
	return {
		emailIdx: index('email_idx').on(table.email),
	}
});

export const branches = pgTable('branches', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
}, (table) => {
	return {
		nameIdx: index('name_idx').on(table.name),
	}
});

export const locations = pgTable('locations', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	branch_id: varchar('branch_id', { length: 26 }).references(() => branches.id, { onDelete: 'restrict' }),
	has_inventory: boolean('inventory').notNull().default(false),
}, (table) => {
	return {
		nameIdx: index('name_idx').on(table.name),
	}
});