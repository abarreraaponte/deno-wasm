import { db } from '../../infrastructure/database/db.ts';
import { uom_types } from '../../infrastructure/database/schema.ts';
import z from 'zod';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { value_is_available } from '../../infrastructure/database/validation.ts';

export type UomType = InferSelectModel<typeof uom_types>;
export type NewUomType = InferInsertModel<typeof uom_types>;

/**
 * Check if the name is available
 * @param name 
 * @returns Promise<boolean>
 */
async function nameIsAvailable(name: string) {
	return await value_is_available(uom_types, 'name', name);
}

/**
 * Check if the ref_id is available
 * @param ref_id
 * @returns Promise<boolean>
 */
async function red_id_is_available(ref_id: string) {
	return await value_is_available(uom_types, 'ref_id', ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id
 * @returns Promise<boolean>
 */
async function alt_id_is_available(alt_id: string) {
	return await value_is_available(uom_types, 'alt_id', alt_id);
}

export async function validate_creation(data: NewUomType) {
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
			.refine(nameIsAvailable, {
				message: 'Name already exists',
			}),
		active: z.boolean().optional().nullable(),
	});

	return await validation_schema.safeParseAsync(data);
}

/**
 * Create a new UOM type
 * @param data 
 * @returns Promise<UomType>
 */
export async function create(data: NewUomType) {
	return await db.insert(uom_types).values(data).returning();
}
