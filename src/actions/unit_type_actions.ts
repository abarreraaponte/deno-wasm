import z from "zod";
import { UnitType } from "../services/storage/types.js";
import { valueIsAvailable } from "../services/storage/validation.js";
import { valkey } from "@/services/storage/primary/valkey.js";

/**
 * Check if the name is available
 */
async function nameIsAvailable(name: string) {
	return await valueIsAvailable("name", name);
}

/**
 * Check if the ref_id is available
 */
async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable("ref_id", ref_id);
}

/**
 * Check if the alt_id is available
 */
async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable("alt_id", alt_id);
}

export async function validateCreation(data: UnitType.New) {
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
		name: z.string().max(255, { message: "Name must be less than 255 characters" }).refine(nameIsAvailable, {
			message: "Name already exists",
		}),
		active: z.boolean().optional().nullable(),
	});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new UOM type
 */
export async function create(data: UnitType.Model): Promise<UnitType.Model> {
	// TODO: Define key creation logic
	const key = `UNIT_TYPE#${data.id}`;
	await valkey.set(key, JSON.stringify(data));
	const value = await valkey.get(key);

	if (!value) {
		throw new Error("Failed to create unit type");
	}

	return JSON.parse(value.toString()) as UnitType.Model;
}
