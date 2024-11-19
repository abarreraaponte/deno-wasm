// Test Cases for Account Creation Validation

const testCases = [
	// **1. Valid Account Creation without `parent_id`**
	// **Description:**
	// Creating an account without a `parent_id`, providing all required fields with valid data.
	// **Expected Result:**
	// Success. The account is created with the provided `ledger_id` and `balance_type`.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XV',
		ref_id: 'REF1234567890',
		alt_id: 'ALT1234567890',
		name: 'New Account A',
		balance_type: 'debit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Primary account',
		},
	},

	// **2. Missing `balance_type` without `parent_id`**
	// **Description:**
	// Attempting to create an account without providing the `balance_type` while `parent_id` is not set.
	// **Expected Result:**
	// Validation error indicating that `balance_type` is required.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XY',
		ref_id: 'REF0987654321',
		alt_id: 'ALT0987654321',
		name: 'New Account B',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Secondary account',
		},
	},

	// **3. Missing `ledger_id` without `parent_id`**
	// **Description:**
	// Attempting to create an account without providing the `ledger_id` while `parent_id` is not set.
	// **Expected Result:**
	// Validation error indicating that `ledger_id` is required.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XZ',
		ref_id: 'REF1122334455',
		alt_id: 'ALT1122334455',
		name: 'New Account C',
		balance_type: 'credit',
		active: true,
		meta: {
			description: 'Tertiary account',
		},
	},

	// **4. Invalid `ledger_id` without `parent_id`**
	// **Description:**
	// Attempting to create an account with a `ledger_id` that does not exist.
	// **Expected Result:**
	// Validation error indicating that `ledger_id` does not exist.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X1',
		ref_id: 'REF2233445566',
		alt_id: 'ALT2233445566',
		name: 'New Account D',
		balance_type: 'debit',
		ledger_id: 'INVALID_LEDGER',
		active: true,
		meta: {
			description: 'Invalid ledger account',
		},
	},

	// **5. Invalid `balance_type` without `parent_id`**
	// **Description:**
	// Attempting to create an account with an invalid `balance_type` value.
	// **Expected Result:**
	// Validation error indicating that `balance_type` must be either "debit" or "credit".
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X2',
		ref_id: 'REF3344556677',
		alt_id: 'ALT3344556677',
		name: 'New Account E',
		balance_type: 'invalid_type',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Invalid balance type',
		},
	},

	// **6. Duplicate `ref_id` without `parent_id`**
	// **Description:**
	// Attempting to create an account with a `ref_id` that already exists in the database.
	// **Assumption:**
	// An account with `ref_id`: "REF1234567890" already exists.
	// **Expected Result:**
	// Validation error indicating that `ref_id` already exists.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X3',
		ref_id: 'REF1234567890', // Duplicate ref_id
		alt_id: 'ALT4455667788',
		name: 'New Account F',
		balance_type: 'credit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Duplicate ref_id',
		},
	},

	// **7. Duplicate `alt_id` without `parent_id`**
	// **Description:**
	// Attempting to create an account with an `alt_id` that already exists in the database.
	// **Assumption:**
	// An account with `alt_id`: "ALT1234567890" already exists.
	// **Expected Result:**
	// Validation error indicating that `alt_id` already exists.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X4',
		ref_id: 'REF4455667788',
		alt_id: 'ALT1234567890', // Duplicate alt_id
		name: 'New Account G',
		balance_type: 'debit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Duplicate alt_id',
		},
	},

	// **8. Duplicate `name` without `parent_id`**
	// **Description:**
	// Attempting to create an account with a `name` that already exists in the database.
	// **Assumption:**
	// An account with `name`: "Existing Account" already exists.
	// **Expected Result:**
	// Validation error indicating that `name` already exists.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X5',
		ref_id: 'REF5566778899',
		alt_id: 'ALT5566778899',
		name: 'Existing Account', // Duplicate name
		balance_type: 'credit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Duplicate name',
		},
	},

	// **9. `ref_id` Not Provided (Auto-Generate)**
	// **Description:**
	// Creating an account without providing the `ref_id`. The system should auto-generate it.
	// **Expected Result:**
	// Success. `ref_id` is auto-generated based on the prefix and a new ULID.
	// **Dummy Data:**
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X6',
		alt_id: 'ALT6677889900',
		name: 'New Account H',
		balance_type: 'debit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Auto-generated ref_id',
		},
		// Note: The `ref_id` field is omitted.
	},

	// **10. Valid Account Creation with `parent_id` by `id`**
	// **Description:**
	// Creating an account with a valid `parent_id` provided as the parent's `id`. The new account should inherit `ledger_id`, `balance_type`, and `active` from the parent.
	// **Assumption:**
	// Parent account exists with:
	// - `id`: "PARENT_ID_1"
	// - `balance_type`: "credit"
	// - `ledger_id`: "MAIN_LEDGER"
	// - `active`: false
	// **Expected Result:**
	// Success. The new account inherits the specified fields from the parent.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X7',
		ref_id: 'REF6677889900',
		alt_id: 'ALT6677889901',
		name: 'New Account I',
		parent_id: 'PARENT_ID_1',
		active: true, // This will be overridden to false
		meta: {
			description: 'Inherits from parent by id',
		},
		// Note: Although `active` is provided, it will be overridden by the parent's `active` value (`false`).
	},

	// **11. Valid Account Creation with `parent_id` by `ref_id`**
	// **Description:**
	// Creating an account with a valid `parent_id` provided as the parent's `ref_id`. The new account should inherit `ledger_id`, `balance_type`, and `active` from the parent.
	// **Assumption:**
	// Parent account exists with:
	// - `ref_id`: "REF_PARENT_1"
	// - `balance_type`: "debit"
	// - `ledger_id`: "MAIN_LEDGER"
	// - `active`: true
	// **Expected Result:**
	// Success. The new account inherits the specified fields from the parent.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X8',
		ref_id: 'REF7788990011',
		alt_id: 'ALT7788990011',
		name: 'New Account J',
		parent_id: 'REF_PARENT_1',
		balance_type: 'credit', // This will be overridden to "debit"
		meta: {
			description: 'Inherits from parent by ref_id',
		},
		// Note: Although `balance_type` is provided as "credit", it will be overridden by the parent's `balance_type` ("debit").
	},

	// **12. Valid Account Creation with `parent_id` by `alt_id`**
	// **Description:**
	// Creating an account with a valid `parent_id` provided as the parent's `alt_id`. The new account should inherit `ledger_id`, `balance_type`, and `active` from the parent.
	// **Assumption:**
	// Parent account exists with:
	// - `alt_id`: "ALT_PARENT_1"
	// - `balance_type`: "debit"
	// - `ledger_id`: "MAIN_LEDGER"
	// - `active`: true
	// **Expected Result:**
	// Success. The new account inherits the specified fields from the parent.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79X9',
		ref_id: 'REF8899001122',
		alt_id: 'ALT8899001122',
		name: 'New Account K',
		parent_id: 'ALT_PARENT_1',
		balance_type: 'credit', // This will be overridden to "debit"
		ledger_id: 'OTHER_LEDGER', // This will be overridden to "MAIN_LEDGER"
		active: false, // This will be overridden to true
		meta: {
			description: 'Inherits from parent by alt_id',
		},
		// Note: Although `balance_type`, `ledger_id`, and `active` are provided, they will be overridden by the parent's values.
	},

	// **13. Invalid `parent_id` (Does Not Exist)**
	// **Description:**
	// Attempting to create an account with a `parent_id` that does not correspond to any existing account.
	// **Expected Result:**
	// Validation error indicating that `parent_id` does not exist.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XA',
		ref_id: 'REF9900112233',
		alt_id: 'ALT9900112233',
		name: 'New Account L',
		parent_id: 'NON_EXISTENT_PARENT',
		balance_type: 'debit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Invalid parent_id',
		},
	},

	// **14. `parent_id` Provided Along with `balance_type` and `ledger_id`**
	// **Description:**
	// Creating an account with a valid `parent_id` while also providing `balance_type` and `ledger_id`. According to your final schema, these fields should be overridden by the parent's values.
	// **Assumption:**
	// Parent account exists with:
	// - `id`: "PARENT_ID_2"
	// - `balance_type`: "credit"
	// - `ledger_id`: "MAIN_LEDGER"
	// - `active`: true
	// **Expected Result:**
	// Success. `balance_type` and `ledger_id` are overridden by the parent's values.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XB',
		ref_id: 'REF1011121314',
		alt_id: 'ALT1011121314',
		name: 'New Account M',
		parent_id: 'PARENT_ID_2',
		balance_type: 'debit', // Will be overridden to "credit"
		ledger_id: 'OTHER_LEDGER', // Will be overridden to "MAIN_LEDGER"
		active: false, // Will be overridden to true
		meta: {
			description: 'Overrides provided fields',
		},
	},

	// **15. `parent_id` Provided and Inherits Different `active` Flag**
	// **Description:**
	// Creating an account with a valid `parent_id` where the parent has a different `active` status. Ensures that the `active` flag is correctly inherited.
	// **Assumption:**
	// Parent account exists with:
	// - `id`: "PARENT_ID_3"
	// - `balance_type`: "debit"
	// - `ledger_id`: "MAIN_LEDGER"
	// - `active`: false
	// **Expected Result:**
	// Success. `active` is overridden by the parent's value (`false`).
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XC',
		ref_id: 'REF1112131415',
		alt_id: 'ALT1112131415',
		name: 'New Account N',
		parent_id: 'PARENT_ID_3',
		active: true, // Will be overridden to false
		meta: {
			description: 'Inherits different active flag',
		},
	},

	// **16. Optional Fields Set to `null`**
	// **Description:**
	// Creating an account with optional fields explicitly set to `null`.
	// **Expected Result:**
	// Success. Optional fields are accepted as `null`.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XD',
		ref_id: null,
		alt_id: null,
		name: 'New Account O',
		balance_type: 'credit',
		ledger_id: 'MAIN_LEDGER',
		active: null,
		meta: null,
	},

	// **17. Optional Fields Omitted**
	// **Description:**
	// Creating an account without providing optional fields.
	// **Expected Result:**
	// Success. Optional fields are either auto-generated or set to default values.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XE',
		name: 'New Account P',
		balance_type: 'debit',
		ledger_id: 'MAIN_LEDGER',
		// `ref_id`, `alt_id`, `active`, and `meta` are omitted
	},

	// **18. `meta` Provided as JSON**
	// **Description:**
	// Creating an account with the `meta` field provided as a JSON object.
	// **Expected Result:**
	// Success. The `meta` field is stored as provided.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XF',
		ref_id: 'REF1213141516',
		alt_id: 'ALT1213141516',
		name: 'New Account Q',
		balance_type: 'credit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			preferences: {
				notifications: true,
				theme: 'dark',
			},
			tags: ['primary', 'important'],
		},
	},

	// **19. Invalid `id` (Not a ULID)**
	// **Description:**
	// Attempting to create an account with an `id` that does not conform to the ULID format.
	// **Expected Result:**
	// Validation error indicating that `id` must be a valid ULID.
	{
		id: 'INVALID_ULID',
		ref_id: 'REF1314151617',
		alt_id: 'ALT1314151617',
		name: 'New Account R',
		balance_type: 'debit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Invalid id format',
		},
	},

	// **20. Invalid `parent_id` Format (Not a ULID)**
	// **Description:**
	// Attempting to create an account with a `parent_id` that does not conform to the ULID format.
	// **Expected Result:**
	// Validation error indicating that `parent_id` must be a valid ULID.
	{
		id: '01F8MECHZX3TBDSZ7XRADM79XG',
		ref_id: 'REF1415161718',
		alt_id: 'ALT1415161718',
		name: 'New Account S',
		parent_id: 'INVALID_PARENT_ID',
		balance_type: 'credit',
		ledger_id: 'MAIN_LEDGER',
		active: true,
		meta: {
			description: 'Invalid parent_id format',
		},
	},
];

export default testCases;
