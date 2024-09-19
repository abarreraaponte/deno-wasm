import { db } from "@/core/database/db";
import { currencies } from "@/core/database/schema";
import z, { ZodEnum } from "zod";
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";

export type Currency = InferSelectModel<typeof currencies>;
export type NewCurrency = InferInsertModel<typeof currencies>;
export type UpdateCurrency = Pick<NewCurrency, 'name' | 'symbol' | 'iso_code' | 'precision' | 'active' | 'decimal_separator' | 'thousands_separator'>;

class CurrencyManager {

	public available_separators = [',', '.'] as const;
	
	constructor()
	{

	}

	async validateCurrencyCreation(data: NewCurrency)
	{
		// Check if name is unique.
		async function nameIsUnique(name: string)
		{
			const results = await db.query.currencies.findMany({
				where: eq(currencies.name, name),
			});

			return results.length === 0;
		}

		// Check if ISO code is unique
		async function isoCodeIsUnique(iso_code: string)
		{
			const results = await db.query.currencies.findMany({
				where: eq(currencies.iso_code, iso_code),
			});

			return results.length === 0;
		}

		const validation_schema = z.object({
			id: z.string().ulid(),
			name: z.string()
				.max(255, {message: 'Name must be less than 255 characters'})
				.refine(nameIsUnique, {message: 'Name already exists'}),
			symbol: z.string().max(3, {message: 'Symbol must be less than 20 characters'}),
			iso_code: z.string()
				.max(8, {message: 'ISO code must be less than 8 characters'})
				.refine(isoCodeIsUnique, {message: 'ISO code already exists'}),
			precision: z.number().optional().nullable(),
			active: z.boolean().optional().nullable(),
			decimal_separator: z.enum(this.available_separators),
			thousands_separator: z.enum(this.available_separators),
		});

		return validation_schema.safeParseAsync(data);
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

export default CurrencyManager;