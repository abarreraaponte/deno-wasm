import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
