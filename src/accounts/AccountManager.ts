import { db } from "@/core/database/db";
import { accounts, currencies, ledgers } from "@/core/database/schema";
import z from "zod";
import { InferInsertModel, InferSelectModel, eq, or } from "drizzle-orm";
import { valueIsAvailable } from "@/core/database/validation";
import { balance_types, BalanceType } from "./balance";
import { ulid } from "ulidx";

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;
export type RefinedNewAccount = Omit<NewAccount, 'ledger_id' | 'balance_type'> & {
	ledger_id?: string;
	balance_type?: BalanceType;
}
export type UpdateAccount = Pick<NewAccount, 'ref_id' | 'alt_id' | 'name' | 'balance_type' | 'meta' | 'active'>;

class AccountManager {
	
	public prefix :string = 'ACC_';
	
	constructor()
	{

	}

	// Check if name is available.
	async nameIsAvailable(name: string)
	{
		return await valueIsAvailable(accounts, 'name', name);
	}

	async refIdIsAvailable(ref_id: string)
	{
		return await valueIsAvailable(accounts, 'ref_id', ref_id);
	}

	async altIdIsAvailable(alt_id: string)
	{
		return await valueIsAvailable(accounts, 'alt_id', alt_id);
	}

	async validateCreation(data: NewAccount)
	{
		const validation_schema = z.object({
			id: z.string().ulid(),
			ref_id: z.string()
			.max(64, {message: 'Ref ID must be less than 64 characters'})
			.refine(this.refIdIsAvailable, {message: 'Ref ID already exists'})
			.optional()
			.nullable()
			.transform(async (ref_id, ctx) => {
				if(!ref_id)
				{
					return `${this.prefix}${ulid()}`;
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
			balance_type: z.enum(balance_types).optional().nullable(),
			ledger_id: z.string().optional().nullable(),
			parent_id: z.string().ulid().optional().nullable(),
			meta: z.any().optional().nullable(),
			active: z.boolean().optional().nullable(),
		})
		.superRefine(async (data, ctx) => {
			if (data.parent_id) {
				// Verify that parent_id exists
				const parent = await db.query.accounts.findFirst({ where:
					or(
						eq(accounts.id, data.parent_id),
						eq(accounts.ref_id, data.parent_id),
						eq(accounts.alt_id, data.parent_id),
					)
				});
				if (!parent) {
					ctx.addIssue({
						path: ['parent_id'],
						message: 'Parent ID does not exist',
						code: z.ZodIssueCode.custom,
					});
				}

				else {
					// override balance_type, ledger_id and active with the equivalent values from the parent.
					data.balance_type = parent.balance_type;
					data.ledger_id = parent.ledger_id;
					data.active = parent.active;
				}
			}
			
			else {
				// Require balance_type and ledger_id if parent_id is not provided
				if (!data.balance_type) {
					ctx.addIssue({
						path: ['balance_type'],
						message: 'balance_type is required when parent_id is not provided',
						code: z.ZodIssueCode.custom,
					});
				}
				
				if (!data.ledger_id) {
					ctx.addIssue({
						path: ['ledger_id'],
						message: 'ledger_id is required when parent_id is not provided',
						code: z.ZodIssueCode.custom,
					});
				}

				else {
					const ledger = await db.query.ledgers.findFirst(
						{ where: or(
							eq(ledgers.id, data.ledger_id),
							eq(ledgers.ref_id, data.ledger_id),
							eq(ledgers.alt_id, data.ledger_id),
						)}
					);
	
					if (!ledger) {
						ctx.addIssue({
							path: ['ledger_id'],
							message: 'Ledger ID does not exist',
							code: z.ZodIssueCode.custom,
						});
					}

					else {
						data.ledger_id = ledger.id;
					}
				}
			}
		});

		return validation_schema.safeParseAsync(data);


	}

	async create(data: NewAccount)
	{	
		return db.insert(accounts).values(data).returning({id: accounts.id});
	}
}

export default AccountManager;