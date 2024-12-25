import { db } from '../services/database/db.ts';
import { ledgers, unit_types } from '../services/database/schema.ts';
import z from 'zod';
import { eq, or } from 'drizzle-orm';
import { valueIsAvailable } from '../services/database/validation.ts';
import { validate as validateUuid } from '@std/uuid/unstable-v7';
import { NewLedger } from '../types/index.ts';

/**
 * Check if the name is available
 * @param name
 * @returns Promise<boolean>
 */
async function nameIsAvailable(name: string) {
	return await valueIsAvailable(ledgers, 'name', name);
}

/**
 * Check if the ref_id is available
 * @param ref_id
 * @returns Promise<boolean>
 */
async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable(ledgers, 'ref_id', ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id
 * @returns Promise<boolean>
 */
async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable(ledgers, 'alt_id', alt_id);
}

/**
 * Validate the creation of a new ledger
 * @param data
 * @returns Promise<z.infer<typeof validationSchema>>
 */
export async function validateCreation(data: NewLedger) {
	const validationSchema = z.object({
		id: z.string().uuid(),
		ref_id: z.string()
			.max(64, { message: 'Ref ID must be less than 64 characters' })
			.refine(refIdIsAvailable, {
				message: 'Ref ID already exists',
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
		unit_type_id: z.string()
			.transform(async (unit_type_id, ctx) => {
				const is_uuid = validateUuid(unit_type_id);

				const filters = is_uuid
					? {
						where: eq(unit_types.id, unit_type_id),
					}
					: {
						where: or(
							eq(unit_types.ref_id, unit_type_id),
							eq(unit_types.alt_id, unit_type_id),
						),
					};

				const existing_uom_type = await db.query.unit_types.findFirst(
					filters,
				);

				if (!existing_uom_type) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Invalid UOM type ID ${unit_type_id}`,
					});

					return z.NEVER;
				}

				return existing_uom_type.id;
			}).optional(),
		active: z.boolean().optional().nullable(),
	});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new ledger
 * @param data
 * @returns Promise<InferSelectModel<typeof ledgers>>
 */
export async function create(data: NewLedger) {
	return await db.insert(ledgers).values(data).returning();
}
