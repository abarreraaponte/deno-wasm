import { db } from "@/core/database/db";
import { currencies } from "@/core/database/schema";
import z from "zod";
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";
import { valueIsAvailable } from "@/core/database/validation";

export type Currency = InferSelectModel<typeof currencies>;
export type NewCurrency = InferInsertModel<typeof currencies>;
export type UpdateCurrency = Pick<NewCurrency, 'name' | 'symbol' | 'iso_code' | 'precision' | 'active' | 'decimal_separator' | 'thousands_separator'>;

class CurrencyManager {

	public available_separators = [',', '.'] as const;
	
	constructor()
	{

	}

	// Check if name is unique.
	async nameIsAvailable(name: string)
	{
		return await valueIsAvailable(currencies, 'name', name);
	}

	// Check if ISO code is unique
	async isoCodeIsAvailable(iso_code: string)
	{
		return await valueIsAvailable(currencies, 'iso_code', iso_code);
	}

	async validateCreation(data: NewCurrency)
	{
		const validation_schema = z.object({
			id: z.string().ulid(),
			name: z.string()
				.max(255, {message: 'Name must be less than 255 characters'})
				.refine(this.nameIsAvailable, {message: 'Name already exists'}),
			symbol: z.string().max(3, {message: 'Symbol must be less than 20 characters'}),
			iso_code: z.string()
				.max(8, {message: 'ISO code must be less than 8 characters'})
				.refine(this.isoCodeIsAvailable, {message: 'ISO code already exists'}),
			precision: z.number().optional().nullable(),
			active: z.boolean().optional().nullable(),
			decimal_separator: z.enum(this.available_separators),
			thousands_separator: z.enum(this.available_separators),
		});

		return validation_schema.safeParseAsync(data);
	}

	async create(data: NewCurrency)
	{	
		return db.insert(currencies).values(data).returning({id: currencies.id});
	}
}

export default CurrencyManager;