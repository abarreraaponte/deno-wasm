import z from "zod";
import { valueIsAvailable } from "../services/storage/validation.js";
import { EntityModel } from "../services/storage/types.js";
import { valkey } from "@/services/storage/primary/valkey.js";

/**
 * Check if the name is available
 */
async function nameIsAvailable(name: string): Promise<boolean> {
	return await valueIsAvailable("name", name);
}

/**
 * Check if the ref_id is available
 */
async function refIdIsAvailable(ref_id: string): Promise<boolean> {
	return await valueIsAvailable("ref_id", ref_id);
}

/**
 * Check if the alt_id is available
 */
async function altIdIsAvailable(alt_id: string): Promise<boolean> {
	return await valueIsAvailable("alt_id", alt_id);
}

/**
 * Validate the creation of a new entity model
 */
export async function validateCreation(data: EntityModel.New) {
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
export async function create(data: EntityModel.New): Promise<EntityModel.Model> {
	// TODO: Define key creation logic
	const key = `ENTITY_MODEL#${data.id}`;
	await valkey.set(key, JSON.stringify(data));
	const value = await valkey.get(key);

	if (!value) {
		throw new Error("Failed to create entity model");
	}

	return JSON.parse(value.toString()) as EntityModel.Model;
}
