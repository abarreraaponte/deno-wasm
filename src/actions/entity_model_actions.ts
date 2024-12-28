import { db } from "../services/database/db.js";
import { entity_models } from "../services/database/schema.js";
import z from "zod";
import { valueIsAvailable } from "../services/database/validation.js";
import { NewEntityModel } from "../types/index.js";

/**
 * Check if the name is available
 */
async function nameIsAvailable(name: string): Promise<boolean> {
	return await valueIsAvailable(entity_models, "name", name);
}

/**
 * Check if the ref_id is available
 */
async function refIdIsAvailable(ref_id: string): Promise<boolean> {
	return await valueIsAvailable(entity_models, "ref_id", ref_id);
}

/**
 * Check if the alt_id is available
 */
async function altIdIsAvailable(alt_id: string): Promise<boolean> {
	return await valueIsAvailable(entity_models, "alt_id", alt_id);
}

/**
 * Validate the creation of a new entity model
 */
export async function validateCreation(data: NewEntityModel) {
	const validationSchema = z.object({
		id: z.string().uuid(),
		ref_id: z.string().max(64, { message: "Ref ID must be less than 64 characters" }).refine(refIdIsAvailable, {
			message: "Ref ID already exists",
		}),
		alt_id: z
			.string()
			.max(64, { message: "Alt ID must be less than 64 characters" })
			.refine(altIdIsAvailable, {
				message: "Alt ID already exists",
			})
			.optional()
			.nullable(),
		name: z.string().max(64, { message: "Name must be less than 64 characters" }).refine(nameIsAvailable, {
			message: "Name already exists",
		}),
		active: z.boolean().optional().nullable(),
	});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new entity model
 */
export async function create(data: NewEntityModel) {
	return await db.insert(entity_models).values(data).returning();
}
