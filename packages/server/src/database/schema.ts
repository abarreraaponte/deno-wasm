import { pgTable, varchar, char, bigint, text, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: varchar('id', { length: 26 }).primaryKey(),
	first_name: varchar('first_name', { length: 255 }),
	last_name: varchar('last_name', { length: 255 }),
	email: varchar('email', { length: 255 }).unique(),
}, (table) => {
	return {
		emailIdx: index('email_idx').on(table.email),
	}
});

export const branches = pgTable('branches', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }),

}, (table) => {
	return {
		nameIdx: index('name_idx').on(table.name),
	}
});