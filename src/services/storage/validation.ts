import z from "zod";

export const MetaSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]));

export const TransactionLineSchema = z.record(z.string(), MetaSchema);

/**
 * Generic function to validate unique values before they enter the database.
 * It's meant to be paired with a config function within the .transform method in Zod schemas
 */
export async function valueIsAvailable(key: string, value: string) {
	// TODO: Implement
	return true;
}
