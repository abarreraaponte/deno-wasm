import { db } from "@/database/db.js";
import { currencies } from "@/database/schema.js";
import z from "zod";
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";
import { valueIsAvailable } from "@/database/validation.js";

export type Currency = InferSelectModel<typeof currencies>;
export type NewCurrency = InferInsertModel<typeof currencies>;
export type UpdateCurrency = Pick<NewCurrency, 'name' | 'symbol' | 'iso_code' | 'precision' | 'active' | 'decimal_separator' | 'thousands_separator'>;

class CurrencyManager {

	public available_separators = [',', '.'] as const;
	
	constructor()
	{

	}

	// Check if name is unique.
	private async nameIsAvailable(name: string)
	{
		return await valueIsAvailable(currencies, 'name', name);
	}

	// Check if ISO code is unique
	private async isoCodeIsAvailable(iso_code: string)
	{
		return await valueIsAvailable(currencies, 'iso_code', iso_code);
	}

	async validateCreation(data: NewCurrency)
	{
		const validation_schema = z.object({
			id: z.string().uuid(),
			name: z.string()
				.max(255, {message: 'Name must be less than 255 characters'})
				.refine(this.nameIsAvailable, {message: 'Name already exists'}),
			symbol: z.string().max(3, {message: 'Symbol must be less than 20 characters'}),
			iso_code: z.string()
				.max(3, {message: 'ISO code must be less than 8 characters'})
				.refine(this.isoCodeIsAvailable, {message: 'ISO code already exists'}),
			precision: z.number().max(8).optional().nullable(),
			active: z.boolean().optional().nullable(),
			decimal_separator: z.enum(this.available_separators),
			thousands_separator: z.enum(this.available_separators),
		});

		return validation_schema.safeParseAsync(data);
	}

	async create(data: NewCurrency)
	{	
		return db.insert(currencies).values(data).returning({
			id: currencies.id,
			name: currencies.name,
			symbol: currencies.symbol,
			iso_code: currencies.iso_code,
			precision: currencies.precision,
			active: currencies.active,
			decimal_separator: currencies.decimal_separator,
			thousands_separator: currencies.thousands_separator,
		});
	}
}

export default CurrencyManager;