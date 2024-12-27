import { db } from '../services/database/db.ts';
import { accounts, ledgers } from '../services/database/schema.ts';
import z from 'zod';
import { eq, or } from 'drizzle-orm';
import { valueIsAvailable } from '../services/database/validation.ts';
import { validate as validateUuid } from '@std/uuid/unstable-v7';
import { BalanceType, NewAccount } from '../types/index.ts';

/**
 * Check if the name is available
 */
async function nameIsAvailable(name: string): Promise<boolean> {
	return await valueIsAvailable(accounts, 'name', name);
}

/**
 * Check if the ref_id is available
 */
async function refIdIsAvailable(ref_id: string): Promise<boolean> {
	return await valueIsAvailable(accounts, 'ref_id', ref_id);
}

/**
 * Check if the alt_id is available
 */
async function altIdIsAvailable(alt_id: string): Promise<boolean> {
	return await valueIsAvailable(accounts, 'alt_id', alt_id);
}

/**
 * Validates the data provided for account creation
 */
export async function validateCreation(data: NewAccount) {
	const validationSchema = z.object({
		id: z.string().uuid(),
		ref_id: z.string()
			.max(64, { message: 'Ref ID must be less than 64 characters' })
			.refine(refIdIsAvailable, {
				message: 'Ref ID already exists',
			})
			.optional()
			.nullable(),
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
		balance_type: z.enum([BalanceType.DEBIT, BalanceType.CREDIT]).optional().nullable(),
		ledger_id: z.string().optional().nullable(),
		parent_id: z.string().uuid().optional().nullable(),
		meta: z.any().optional().nullable(),
		active: z.boolean().optional().nullable(),
	})
		.superRefine(async (data, ctx) => {
			if (data.parent_id) {
				const isUuid = validateUuid(data.parent_id);

				const filters = isUuid
					? {
						where: eq(accounts.id, data.parent_id),
					}
					: {
						where: or(
							eq(accounts.ref_id, data.parent_id),
							eq(accounts.alt_id, data.parent_id),
						),
					};

				// Verify that parent_id exists
				const parent = await db.query.accounts.findFirst(filters);
				if (!parent) {
					ctx.addIssue({
						path: ['parent_id'],
						message: 'Parent ID does not exist',
						code: z.ZodIssueCode.custom,
					});
				} else {
					// override balance_type, ledger_id and active with the equivalent values from the parent.
					data.balance_type = parent.balance_type;
					data.ledger_id = parent.ledger_id;
					data.active = parent.active;
				}
			} else {
				// Require balance_type and ledger_id if parent_id is not provided
				if (!data.balance_type) {
					ctx.addIssue({
						path: ['balance_type'],
						message: 'balance_type is required when parent_id is not provided',
						code: z.ZodIssueCode.custom,
					});
				}

				if (!data.ledger_id) {
					ctx.addIssue({
						path: ['ledger_id'],
						message: 'ledger_id is required when parent_id is not provided',
						code: z.ZodIssueCode.custom,
					});
				} else {
					const isUuid = validateUuid(data.ledger_id);

					const filters = isUuid ? { where: eq(ledgers.id, data.ledger_id) } : {
						where: or(
							eq(ledgers.ref_id, data.ledger_id),
							eq(ledgers.alt_id, data.ledger_id),
						),
					};

					const ledger = await db.query.ledgers.findFirst(filters);

					if (!ledger) {
						ctx.addIssue({
							path: ['ledger_id'],
							message: 'Ledger ID does not exist',
							code: z.ZodIssueCode.custom,
						});
					} else {
						data.ledger_id = ledger.id;
					}
				}
			}
		});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new account
 */
export async function create(data: NewAccount) {
	return await db.insert(accounts).values(data).returning();
}
