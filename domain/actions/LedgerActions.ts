import { db } from '../../infrastructure/database/db.ts';
import { currencies, ledgers } from '../../infrastructure/database/schema.ts';
import z from 'zod';
import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { valueIsAvailable } from '../../infrastructure/database/validation.ts';
import { v7 as uuid, validate as validateUuid } from 'uuid';

export type Ledger = InferSelectModel<typeof ledgers>;
export type NewLedger = InferInsertModel<typeof ledgers>;
export type UpdateLedger = Pick<
	NewLedger,
	'ref_id' | 'alt_id' | 'name' | 'description' | 'active'
>;

const prefix = 'LGR_';

async function nameIsAvailable(name: string) {
	return await valueIsAvailable(ledgers, 'name', name);
}

async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable(ledgers, 'ref_id', ref_id);
}

async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable(ledgers, 'alt_id', alt_id);
}

export async function validateCreation(data: NewLedger) {
	const validation_schema = z.object({
		id: z.string().uuid(),
		ref_id: z.string()
			.max(64, { message: 'Ref ID must be less than 64 characters' })
			.refine(refIdIsAvailable, {
				message: 'Ref ID already exists',
			})
			.optional()
			.nullable()
			.transform((ref_id) => {
				if (!ref_id) {
					return `${prefix}${uuid()}`;
				}

				return ref_id;
			}),
		alt_id: z.string()
			.max(64, { message: 'Alt ID must be less than 64 characters' })
			.refine(altIdIsAvailable, {
				message: 'Alt ID already exists',
			})
			.optional()
			.nullable(),
		name: z.string()
			.max(255, { message: 'Name must be less than 255 characters' })
			.refine(nameIsAvailable, {
				message: 'Name already exists',
			}),
		description: z.string().optional().nullable(),
		currency_id: z.string()
			.transform(async (currency_id, ctx) => {
				const is_uuid = validateUuid(currency_id);

				const filters = is_uuid
					? {
						where: eq(currencies.id, currency_id),
					}
					: {
						where: eq(currencies.iso_code, currency_id),
					};

				const existing_currency = await db.query.currencies.findFirst(
					filters,
				);

				if (!existing_currency) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Invalid currency ID ${currency_id}`,
					});

					return z.NEVER;
				}

				return existing_currency.id;
			}),
		active: z.boolean().optional().nullable(),
	});

	return await validation_schema.safeParseAsync(data);
}

export async function create(data: NewLedger) {
	return await db.insert(ledgers).values(data).returning();
}
