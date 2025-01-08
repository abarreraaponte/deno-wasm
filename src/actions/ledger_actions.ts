import z from "zod";
import { valueIsAvailable } from "../services/storage/validation.js";
import { Ledger } from "../services/storage/types.js";
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

/**
 * Validate the creation of a new ledger
 */
export async function validateCreation(data: Ledger.New) {
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
		description: z.string().optional().nullable(),
		unit_type_id: z.string().transform(async (unit_type_id, ctx) => {
			// TODO: implement unit type validation
			const existing_unit_type = { id: unit_type_id };

			if (!existing_unit_type) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Invalid UOM type ID ${unit_type_id}`,
				});

				return z.NEVER;
			}

			return existing_unit_type.id;
		}),
		active: z.boolean().optional().nullable(),
	});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new ledger
 */
export async function create(data: Ledger.New): Promise<Ledger.Model> {
	// TODO: implement key generation logic
	const key = `LEDGER#${data.id}`;
	await valkey.set(key, JSON.stringify(data));

	const value = await valkey.get(key);

	if (!value) {
		throw new Error("Failed to create ledger");
	}

	return JSON.parse(value.toString()) as Ledger.Model;
}
