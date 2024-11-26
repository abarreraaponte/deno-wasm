import { db } from '../../infrastructure/database/db.ts';
import { uom_types, ledgers } from '../../infrastructure/database/schema.ts';
import z from 'zod';
import { eq, or, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { value_is_available } from '../../infrastructure/database/validation.ts';
import { validate as validateUuid } from 'uuid';

export type Ledger = InferSelectModel<typeof ledgers>;
export type NewLedger = InferInsertModel<typeof ledgers>;
export type UpdateLedger = Pick<
	NewLedger,
	'ref_id' | 'alt_id' | 'name' | 'description' | 'active'
>;

/**
 * Check if the name is available
 * @param name
 * @returns Promise<boolean>
 */
async function name_is_available(name: string) {
	return await value_is_available(ledgers, 'name', name);
}

/**
 * Check if the ref_id is available
 * @param ref_id
 * @returns Promise<boolean>
 */
async function red_id_is_available(ref_id: string) {
	return await value_is_available(ledgers, 'ref_id', ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id
 * @returns Promise<boolean>
 */
async function alt_id_is_available(alt_id: string) {
	return await value_is_available(ledgers, 'alt_id', alt_id);
}

/**
 * Validate the creation of a new ledger
 * @param data
 * @returns Promise<z.infer<typeof validation_schema>>
 */
export async function validate_creation(data: NewLedger) {
	const validation_schema = z.object({
		id: z.string().uuid(),
		ref_id: z.string()
			.max(64, { message: 'Ref ID must be less than 64 characters' })
			.refine(red_id_is_available, {
				message: 'Ref ID already exists',
			}),
		alt_id: z.string()
			.max(64, { message: 'Alt ID must be less than 64 characters' })
			.refine(alt_id_is_available, {
				message: 'Alt ID already exists',
			})
			.optional()
			.nullable(),
		name: z.string()
			.max(255, { message: 'Name must be less than 255 characters' })
			.refine(name_is_available, {
				message: 'Name already exists',
			}),
		description: z.string().optional().nullable(),
		uom_type_id: z.string()
			.transform(async (uom_type_id, ctx) => {
				const is_uuid = validateUuid(uom_type_id);

				const filters = is_uuid
					? {
						where: eq(uom_types.id, uom_type_id),
					}
					: {
						where: or(
							eq(uom_types.ref_id, uom_type_id),
							eq(uom_types.alt_id, uom_type_id),
						),
					};

				const existing_uom_type = await db.query.uom_types.findFirst(
					filters,
				);

				if (!existing_uom_type) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Invalid UOM type ID ${uom_type_id}`,
					});

					return z.NEVER;
				}

				return existing_uom_type.id;
			}).optional(),
		active: z.boolean().optional().nullable(),
	});

	return await validation_schema.safeParseAsync(data);
}

/**
 * Create a new ledger
 * @param data
 * @returns Promise<InferSelectModel<typeof ledgers>>
 */
export async function create(data: NewLedger) {
	return await db.insert(ledgers).values(data).returning();
}
