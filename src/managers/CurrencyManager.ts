import { db } from '../services/database/db.ts';
import { currencies } from '../services/database/schema.ts';
import z from 'zod';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { valueIsAvailable } from '../services/database/validation.ts';

export type Currency = InferSelectModel<typeof currencies>;
export type NewCurrency = InferInsertModel<typeof currencies>;
export type UpdateCurrency = Pick<
	NewCurrency,
	| 'name'
	| 'symbol'
	| 'iso_code'
	| 'precision'
	| 'active'
	| 'decimal_separator'
	| 'thousands_separator'
>;

const available_separators = [',', '.'] as const;

async function nameIsAvailable(name: string) {
	return await valueIsAvailable(currencies, 'name', name);
}

async function isoCodeIsAvailable(iso_code: string) {
	return await valueIsAvailable(currencies, 'iso_code', iso_code);
}

export async function validateCreation(data: NewCurrency) {
	const validation_schema = z.object({
		id: z.string().uuid(),
		name: z.string()
			.max(255, { message: 'Name must be less than 255 characters' })
			.refine(nameIsAvailable, {
				message: 'Name already exists',
			}),
		symbol: z.string().max(3, {
			message: 'Symbol must be less than 20 characters',
		}),
		iso_code: z.string()
			.max(3, { message: 'ISO code must be less than 8 characters' })
			.refine(isoCodeIsAvailable, {
				message: 'ISO code already exists',
			}),
		precision: z.number().max(8).optional().nullable(),
		active: z.boolean().optional().nullable(),
		decimal_separator: z.enum(available_separators),
		thousands_separator: z.enum(available_separators),
	});

	return await validation_schema.safeParseAsync(data);
}

export async function create(data: NewCurrency) {
	return await db.insert(currencies).values(data).returning({
		id: currencies.id,
		name: currencies.name,
		symbol: currencies.symbol,
		iso_code: currencies.iso_code,
		precision: currencies.precision,
		active: currencies.active,
		decimal_separator: currencies.decimal_separator,
		thousands_separator: currencies.thousands_separator,
	});
}
