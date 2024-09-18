import { db } from "@/core/database/db";
import { currencies } from "@/core/database/schema";
import z, { ZodEnum } from "zod";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Currency = InferSelectModel<typeof currencies>;
export type NewCurrency = InferInsertModel<typeof currencies>;
export type UpdateCurrency = Pick<NewCurrency, 'name' | 'symbol' | 'iso_code' | 'precision' | 'active' | 'decimal_separator' | 'thousands_separator'>;

export default class CurrencyManager {

	public available_separators = [',', '.'] as const;
	
	constructor()
	{

	}

	async validateCurrencyCreation(data: NewCurrency)
	{
		const validation_schema = z.object({
			id: z.string().ulid(),
			name: z.string().max(255, {message: 'Name must be less than 255 characters'}),
			symbol: z.string().max(20, {message: 'Symbol must be less than 20 characters'}),
			iso_code: z.string().max(8, {message: 'ISO code must be less than 8 characters'}),
			precision: z.number().optional().nullable(),
			active: z.boolean().optional().nullable(),
			decimal_separator: z.enum(this.available_separators),
			thousands_separator: z.enum(this.available_separators),
		});

		return validation_schema.safeParse(data);
	}

	async createCurrency(data: NewCurrency)
	{	
		return db.insert(currencies).values(data).returning({id: currencies.id});
	}

	async updateCurrency(data : UpdateCurrency)
	{

	}

	async getCurrencies()
	{

	}

	async getCurrency(currency_id: string)
	{

	}

	async deleteCurrency(currency_id: string)
	{

	}
}