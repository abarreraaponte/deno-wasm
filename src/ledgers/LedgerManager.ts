import { db } from "@/core/database/db";
import { ledgers, currencies } from "@/core/database/schema";
import z from "zod";
import { InferInsertModel, InferSelectModel, eq, or } from "drizzle-orm";

export type Ledger = InferSelectModel<typeof ledgers>;
export type NewLedger = InferInsertModel<typeof ledgers>;
export type UpdateLedger = Pick<NewLedger, 'name' | 'description' | 'dimension_1_id' | 'dimension_2_id' | 'dimension_3_id' | 'dimension_4_id' | 'dimension_5_id' | 'dimension_6_id' | 'dimension_7_id' | 'dimension_8_id' | 'active'>;

export default class LedgerManager {
	
	constructor()
	{

	}

	async validateLedgerCreation(data: NewLedger)
	{
		// Check if name is unique.
		async function nameIsUnique(name: string)
		{
			const results = await db.query.ledgers.findMany({
				where: eq(ledgers.name, name),
			});

			return results.length === 0;
		}

		const validation_schema = z.object({
			id: z.string().ulid(),
			name: z.string()
				.max(255, {message: 'Name must be less than 255 characters'})
				.refine(nameIsUnique, {message: 'Name already exists'}),
			description: z.string().optional().nullable(),
			currency_id: z.string()
				.transform(async (currency_id, ctx) => {
					const existing_currency = await db.query.currencies.findFirst({
						where: or(
							eq(currencies.id, currency_id),
							eq(currencies.iso_code, currency_id),
						)
					});

					if(!existing_currency)
					{
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Invalid currency ID ${currency_id}`,
						});

						return z.NEVER;
					}

					return existing_currency.id;
				}),
			dimension_1_id: z.string().optional().nullable(),
			dimension_2_id: z.string().optional().nullable(),
			dimension_3_id: z.string().optional().nullable(),
			dimension_4_id: z.string().optional().nullable(),
			dimension_5_id: z.string().optional().nullable(),
			dimension_6_id: z.string().optional().nullable(),
			dimension_7_id: z.string().optional().nullable(),
			dimension_8_id: z.string().optional().nullable(),
			active: z.boolean().optional().nullable(),
		});

		return validation_schema.safeParseAsync(data);
	}

	async createLedger(data: NewLedger)
	{	
		return db.insert(ledgers).values(data).returning({id: ledgers.id});
	}

	async updateLedger(data : UpdateLedger)
	{

	}

	async getLedgers()
	{

	}

	async getLedger(ledger_id: string)
	{

	}

	async deleteLedger(ledger_id: string)
	{

	}

}