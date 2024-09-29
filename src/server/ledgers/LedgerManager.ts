import { db } from "@/server/database/db";
import { ledgers, currencies } from "@/server/database/schema";
import z from "zod";
import { InferInsertModel, InferSelectModel, eq, or } from "drizzle-orm";
import { valueIsAvailable } from "@/server/database/validation";
import { v7 as uuid } from 'uuid';

export type Ledger = InferSelectModel<typeof ledgers>;
export type NewLedger = InferInsertModel<typeof ledgers>;
export type UpdateLedger = Pick<NewLedger, 'ref_id' | 'alt_id' | 'name' | 'description' | 'active'>;

class LedgerManager {
	
	public prefix :string = 'LED_';

	constructor()
	{

	}

	// Check if name is unique.
	async nameIsAvailable(name: string)
	{
		return await valueIsAvailable(ledgers, 'name', name);
	}

	async refIdIsAvailable(ref_id: string)
	{
		return await valueIsAvailable(ledgers, 'ref_id', ref_id);
	}

	async altIdIsAvailable(alt_id: string)
	{
		return await valueIsAvailable(ledgers, 'alt_id', alt_id);
	}

	async validateCreation(data: NewLedger)
	{
		const validation_schema = z.object({
			id: z.string().uuid(),
			ref_id: z.string()
			.max(64, {message: 'Ref ID must be less than 64 characters'})
			.refine(this.refIdIsAvailable, {message: 'Ref ID already exists'})
			.optional()
			.nullable()
			.transform(async (ref_id, ctx) => {
				if(!ref_id)
				{
					return `${this.prefix}${uuid()}`;
				}

				return ref_id;
			}),
			alt_id: z.string()
				.max(64, {message: 'Alt ID must be less than 64 characters'})
				.refine(this.altIdIsAvailable, {message: 'Alt ID already exists'})
				.optional()
				.nullable(),
			name: z.string()
				.max(255, {message: 'Name must be less than 255 characters'})
				.refine(this.nameIsAvailable, {message: 'Name already exists'}),
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
			active: z.boolean().optional().nullable(),
		});

		return validation_schema.safeParseAsync(data);
	}

	async create(data: NewLedger)
	{	
		return db.insert(ledgers).values(data).returning({id: ledgers.id});
	}
}

export default LedgerManager;