import z from "zod";
import { MetaSchema, TransactionLineSchema } from "./validation.js";

/**
 * Balance Types
 * @description Core types for handling debit and credit operations
 */
export enum BalanceType {
	DEBIT = "debit",
	CREDIT = "credit",
}

/**
 * Ledger Module
 * @description Types for managing ledger entities and operations
 */
export namespace Ledger {
	/** Base ledger entity */
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		name: string;
		description?: string;
		unit_type_id: string;
		active: boolean;
	}

	/** Type for creating new ledger */
	export interface New extends Omit<Model, "active" | "description"> {
		active?: boolean | null | undefined;
		description?: string | null | undefined;
	}

	/** Type for updating existing ledger */
	export type Update = Pick<Model, "ref_id" | "alt_id" | "name" | "description" | "active">;
}

/**
 * Account Module
 * @description Types for managing account entities and operations
 */
export namespace Account {
	/** Base account entity */
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		balance_type?: BalanceType;
		ledger_id: string;
		parent_id?: string;
		name: string;
		meta?: MetaType;
		active: boolean;
	}

	/** Type for creating new account */
	export type New = Pick<
		Model,
		"ref_id" | "alt_id" | "balance_type" | "ledger_id" | "parent_id" | "name" | "meta" | "active"
	>;

	/** Refined type for creating new account with optional fields */
	export type RefinedNew = Omit<New, "ledger_id" | "balance_type"> & {
		ledger_id?: string;
		balance_type?: BalanceType;
	};

	/** Type for updating existing account */
	export type Update = Pick<Model, "ref_id" | "alt_id" | "name" | "balance_type" | "meta" | "active">;
}

/**
 * Unit Type namespace
 * @description Template definitions for units
 */
export namespace UnitType {
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		name: string;
	}

	export type New = Pick<Model, "ref_id" | "alt_id" | "name">;
}

/**
 * Unit namespace
 * @description Instances of unit types
 */
export namespace Unit {
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		unit_type_id: string;
		name: string;
		symbol?: string;
		precision: number;
		decimal_separator: string;
		thousands_separator: string;
		active: boolean;
	}

	export type New = Pick<
		Model,
		| "ref_id"
		| "alt_id"
		| "unit_type_id"
		| "name"
		| "symbol"
		| "precision"
		| "decimal_separator"
		| "thousands_separator"
		| "active"
	>;
}

/**
 * Conversion Module
 * @description Types for managing unit conversions
 */
export namespace Conversion {
	/** Base conversion rate entity */
	export interface Rate {
		id: string;
		from_uom_id: string;
		to_uom_id: string;
		rate: number;
	}
}

/**
 * Entity Model namespace
 * @description Template definitions for entities
 */
export namespace EntityModel {
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		name: string;
		active: boolean;
	}

	export interface New extends Omit<Model, "active" | "description"> {
		active?: boolean | null | undefined;
	}
}

/**
 * Entity namespace
 * @description Instances of entity models
 */
export namespace Entity {
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		entity_model_id: string;
		parent_id?: string;
		name: string;
		meta?: MetaType;
	}
}

/**
 * Transaction Model namespace
 * @description Template definitions for transactions
 */
export namespace TransactionModel {
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		name: string;
		active: boolean;
	}

	export interface New extends Omit<Model, "active" | "description"> {
		active?: boolean | null | undefined;
	}
}

/**
 * Transaction namespace
 * @description Instances of transaction models
 */
export namespace Transaction {
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		transaction_model_id: string;
		meta?: MetaType;
		lines: TransactionLineType;
	}
}

/**
 * Entry Module
 * @description Types for managing ledger entries
 */
export namespace Entry {
	/** Base entry entity */
	export interface Model {
		id: string;
		ref_id: string;
		alt_id?: string | null;
		ledger_id: string;
		debit_account_id: string;
		credit_account_id: string;
		uom_id: string;
		value: number;
		transaction_id: string;
	}
}

/**
 * Dimension Module
 * @description Types for managing entry dimensions
 */
export namespace Dimension {
	/** Base dimension entity */
	export interface Model {
		id: string;
		entry_id: string;
		entity_model_id?: string;
		entity_id: string;
	}
}

/**
 * Meta Types
 * @description Types for metadata handling
 */
export type MetaType = z.infer<typeof MetaSchema>;

/**
 * Transaction Line Types
 * @description Types for transaction line items
 */
export type TransactionLineType = z.infer<typeof TransactionLineSchema>;
