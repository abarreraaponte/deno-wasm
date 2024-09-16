# Main Concepts

## Ledgers
* Represents a single chart of accounts. This could be mapped to a single entity, or a single accounting book.
* Only accounts from the same ledger can interact within a transaction
* We can design multiple ledger or synced ledger features in the future for multibook or multi-currency accounting.

## Account Types
* Groups accounts by their nature.
* At a bare-minimum the account type must tells us the type of balance for the account, as in a debit balance or a credit balance. Likely we can expand this to also indicate Assets, Liabilities, Equity, Revenue and Expenses.

## Account
* EntityModel
* Represents a product, a service, an asset, a tax code

## Unit Types
* Units
* Currencies
* Exchange Rates

## Batches
* Represents a group of transactions that can be submitted together.
* The batch can be atomic, meaning either all transactions get committed or all fail.

## TransactionModel
* Base archetype for a transaction. Defines fields, properties and configuration options. 
* Invoices, Inventory Adjustments, for instance are examples of different transaction models as their purpose and details are different by definition.

## Transaction
* Represents a single operation that can generate multiple entries.
* All entries from the transaction must be balanced

## Entries
* It's the fundamental block for the whole system.
* Represents an accounting movement.


# Entry Base Model

The following two options were presented as the base way to store entries into the system.

## Model A

| Debit Account | Credit Account | Amount |
|---|---|---|
| AR | REVENUE | 90 |
| AR | VAT | 10 |
| COGS | INVENTORY | 40 |

## Model B

| Account | Debit | Credit |
|---|---|---|
| AR |100 |- |
| REVENUE |- |90 |
| VAT | -|10 |
| COGS |40 |- |
| INVENTORY |- |40 |

### Option A was choosen for being:

* Leading to fewer rows
* Enforcing balance and consistency
* Promoting atomicity by forcing transaction lines to be split on their minimum level for all the possible debit_accoun - credit_account permutations.