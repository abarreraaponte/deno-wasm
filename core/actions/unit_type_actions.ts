import { db } from '../services/postgres/db.ts';
import { unit_types } from '../services/postgres/schema.ts';
import z from 'zod';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { valueIsAvailable } from '../services/postgres/validation.ts';

export type UnitType = InferSelectModel<typeof unit_types>;
export type NewUnitType = InferInsertModel<typeof unit_types>;

/**
 * Check if the name is available
 * @param name 
 * @returns Promise<boolean>
 */
async function nameIsAvailable(name: string) {
	return await valueIsAvailable(unit_types, 'name', name);
}

/**
 * Check if the ref_id is available
 * @param ref_id
 * @returns Promise<boolean>
 */
async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable(unit_types, 'ref_id', ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id
 * @returns Promise<boolean>
 */
async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable(unit_types, 'alt_id', alt_id);
}

export async function validateCreation(data: NewUnitType) {
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
		active: z.boolean().optional().nullable(),
	});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new UOM type
 * @param data 
 * @returns Promise<UnitType>
 */
export async function create(data: NewUnitType) {
	return await db.insert(unit_types).values(data).returning();
}
