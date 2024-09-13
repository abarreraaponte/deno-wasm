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

export const user_relations = relations(users, ({many}) => {
	return {
		organization_users: many(organization_users),
	}
});

export const organizations = pgTable('organizations', {
	id: varchar('id', { length: 26 }).primaryKey(),
	name: varchar('name', { length: 255 }),
});

export const organization_relations = relations(organizations, ({many}) => {
	return {
		organization_users: many(organization_users),
	}
});

export const organization_users = pgTable('organization_users', {
	user_id: varchar('user_id', { length: 26 }).references(() => users.id, { onDelete: 'restrict' }),
	organization_id: varchar('organization_id', { length: 26 }).references(() => organizations.id, { onDelete: 'restrict' }),
});

export const organization_user_relations = relations(organization_users, ({one}) => {
	return {
		user: one(users, {fields: [organization_users.user_id], references: [users.id]}),
		organization: one(organizations, {fields: [organization_users.organization_id], references: [organizations.id]}),
	}
});