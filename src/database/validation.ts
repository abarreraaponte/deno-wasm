import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { db } from "./db.js";
import { eq } from "drizzle-orm";
import z from "zod";

export const MetaSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]));
export type MetaType = z.infer<typeof MetaSchema>;

export const TransactionLineSchema = z.record(z.string(), MetaSchema);
export type TransactionLineType = z.infer<typeof TransactionLineSchema>;

export const DimensionSchema = z.record(z.string(), z.string());
export type DimensionType = z.infer<typeof DimensionSchema>;

/**
 * Generic function to validate unique values before they enter the database.
 * It's meant to be paired with a config function within the .transform method in Zod schemas
 */
export async function valueIsAvailable(table: PgTableWithColumns<any>, key: string, value: string)
{
	const results = await db.select()
		.from(table)
		.where(eq(table[key], value));

	return results.length === 0;
}
