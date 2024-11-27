import { db } from '../../infrastructure/database/db.ts';
import { entity_models } from '../../infrastructure/database/schema.ts';
import z from 'zod';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { value_is_available } from '../../infrastructure/database/validation.ts';

export type EntityModel = InferSelectModel<typeof entity_models>;
export type NewEntityModel = InferInsertModel<typeof entity_models>;

/**
 * Check if the name is available
 * @param name
 * @returns Promise<boolean>
 */
async function name_is_available(name: string): Promise<boolean> {
	return await value_is_available(entity_models, 'name', name);
}

/**
 * Check if the ref_id is available
 * @param ref_id
 * @returns :Promise<boolean>
 */
async function ref_id_is_available(ref_id: string): Promise<boolean> {
	return await value_is_available(entity_models, 'ref_id', ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id
 * @returns :Promise<boolean>
 */
async function alt_id_is_available(alt_id: string): Promise<boolean> {
	return await value_is_available(entity_models, 'alt_id', alt_id);
}

/**
 * Validate the creation of a new entity model
 * @param data
 * @returns Promise<z.infer<typeof validation_schema>>
 */
export async function validate_creation(data: NewEntityModel) {
	const validation_schema = z.object({
		id: z.string().uuid(),
		ref_id: z.string()
			.max(64, { message: 'Ref ID must be less than 64 characters' })
			.refine(ref_id_is_available, {
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
			.max(64, { message: 'Name must be less than 64 characters' })
			.refine(name_is_available, {
				message: 'Name already exists',
			}),
		active: z.boolean().optional().nullable(),
	});

	return await validation_schema.safeParseAsync(data);
}

/**
 * Create a new entity model
 * @param data 
 */
export async function create(data: NewEntityModel) {
	return await db.insert(entity_models).values(data).returning();
}
