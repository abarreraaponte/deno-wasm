import { db } from "@core/database/db";
import { ledgers } from "@core/database/schema";
import z from "zod";

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
export type Ledger = InferSelectModel<typeof ledgers>;
export type NewLedger = InferInsertModel<typeof ledgers>;
export type UpdateLedger = Pick<NewLedger, 'name' | 'description' | 'dimension_1_id' | 'dimension_2_id' | 'dimension_3_id' | 'dimension_4_id' | 'dimension_5_id' | 'dimension_6_id' | 'dimension_7_id' | 'dimension_8_id' | 'active'>;


export default class LedgerManager {
	
	constructor()
	{

	}

	async createLedger(data: NewLedger)
	{
		const validation_schema = z.object({
			id: z.string().ulid(),
			name: z.string().max(255, {message: 'Name must be less than 255 characters'}),
			description: z.string().optional().nullable(),
			currency_id: z.string(),
			dimension_1_id: z.string(),
			dimension_2_id: z.string(),
			dimension_3_id: z.string(),
			dimension_4_id: z.string(),
			dimension_5_id: z.string(),
			dimension_6_id: z.string(),
			dimension_7_id: z.string(),
			dimension_8_id: z.string(),
			active: z.boolean(),
		});

		const validated_data = validation_schema.safeParse(data);

		if(validated_data.success === false)
		{
			return validated_data;
		}
		
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