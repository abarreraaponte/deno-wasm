import { valkey } from "@/services/storage/primary/valkey.js";
import z from "zod";
import { valueIsAvailable } from "../services/storage/validation.js";
import { BalanceType, Account } from "../services/storage/types.js";

/**
 * Check if the name is available
 */
async function nameIsAvailable(name: string): Promise<boolean> {
	return await valueIsAvailable("name", name);
}

/**
 * Check if the ref_id is available
 */
async function refIdIsAvailable(ref_id: string): Promise<boolean> {
	return await valueIsAvailable("ref_id", ref_id);
}

/**
 * Check if the alt_id is available
 */
async function altIdIsAvailable(alt_id: string): Promise<boolean> {
	return await valueIsAvailable("alt_id", alt_id);
}

/**
 * Validates the data provided for account creation
 */
export async function validateCreation(data: Account.New) {
	const validationSchema = z
		.object({
			id: z.string().uuid(),
			ref_id: z
				.string()
				.max(64, { message: "Ref ID must be less than 64 characters" })
				.refine(refIdIsAvailable, {
					message: "Ref ID already exists",
				})
				.optional()
				.nullable(),
			alt_id: z
				.string()
				.max(64, { message: "Alt ID must be less than 64 characters" })
				.refine(altIdIsAvailable, {
					message: "Alt ID already exists",
				})
				.optional()
				.nullable(),
			name: z.string().max(255, { message: "Name must be less than 255 characters" }).refine(nameIsAvailable, {
				message: "Name already exists",
			}),
			balance_type: z.enum([BalanceType.DEBIT, BalanceType.CREDIT]).optional().nullable(),
			ledger_id: z.string().optional().nullable(),
			parent_id: z.string().uuid().optional().nullable(),
			meta: z.any().optional().nullable(),
			active: z.boolean().optional().nullable(),
		})
		.superRefine(async (data, ctx) => {
			if (data.parent_id) {
				// Verify that parent_id exists
				// TODO: Implement parent retrieval.
				const parent = { id: "parent_id", balance_type: BalanceType.DEBIT, ledger_id: "ledger_id", active: true };
				if (!parent) {
					ctx.addIssue({
						path: ["parent_id"],
						message: "Parent ID does not exist",
						code: z.ZodIssueCode.custom,
					});
				} else {
					// override balance_type, ledger_id and active with the equivalent values from the parent.
					data.balance_type = parent.balance_type;
					data.ledger_id = parent.ledger_id;
					data.active = parent.active;
				}
			} else {
				// Require balance_type and ledger_id if parent_id is not provided
				if (!data.balance_type) {
					ctx.addIssue({
						path: ["balance_type"],
						message: "balance_type is required when parent_id is not provided",
						code: z.ZodIssueCode.custom,
					});
				}

				if (!data.ledger_id) {
					ctx.addIssue({
						path: ["ledger_id"],
						message: "ledger_id is required when parent_id is not provided",
						code: z.ZodIssueCode.custom,
					});
				} else {
					// TODO: Implement ledger retrieval.
					const ledger = { id: "ledger_id" };
					if (!ledger) {
						ctx.addIssue({
							path: ["ledger_id"],
							message: "Ledger ID does not exist",
							code: z.ZodIssueCode.custom,
						});
					} else {
						data.ledger_id = ledger.id;
					}
				}
			}
		});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new account
 */
export async function create(data: Account.Model): Promise<Account.Model> {
	// TODO: Define key logic
	const key: string = `ACCOUNT#${data.id}`;
	await valkey.set(key, JSON.stringify(data));

	const value = await valkey.get(key);

	if (!value) {
		throw new Error("Failed to create account");
	}

	return JSON.parse(value.toString()) as Account.Model;
}
